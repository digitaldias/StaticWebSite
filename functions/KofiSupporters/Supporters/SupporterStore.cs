using System.Text.Json;
using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Logging;

namespace KofiSupporters.Supporters;

/// <summary>Reads and writes supporters.json in the blog's $web container, guarded by ETag so concurrent payments never overwrite each other.</summary>
public sealed class SupporterStore(BlobServiceClient blobs, ILogger<SupporterStore> logger)
{
    private const string Container = "$web";
    private const string FileName = "supporters.json";
    private const int MaxAttempts = 5;

    public async Task<bool> AddAsync(Supporter supporter, CancellationToken cancellationToken)
    {
        var blob = blobs.GetBlobContainerClient(Container).GetBlobClient(FileName);
        for (var attempt = 1; attempt <= MaxAttempts; attempt++)
        {
            var (current, etag) = await ReadAsync(blob, cancellationToken);
            var updated = SupporterList.Add(current, supporter);
            if (updated is null)
            {
                logger.LogInformation("Supporter {Id} is already listed; Ko-fi retry ignored", supporter.Id);
                return false;
            }

            try
            {
                await WriteAsync(blob, updated, etag, cancellationToken);
                logger.LogInformation("Added supporter {Id} to {File}", supporter.Id, FileName);
                return true;
            }
            catch (RequestFailedException failure) when (failure.Status is 409 or 412)
            {
                logger.LogWarning("{File} changed during write, attempt {Attempt} of {Max}", FileName, attempt, MaxAttempts);
            }
        }

        throw new InvalidOperationException($"Could not update {FileName} after {MaxAttempts} attempts.");
    }

    private static async Task<(IReadOnlyList<Supporter> Supporters, ETag? ETag)> ReadAsync(BlobClient blob, CancellationToken cancellationToken)
    {
        try
        {
            var download = await blob.DownloadContentAsync(cancellationToken);
            var supporters = download.Value.Content.ToObjectFromJson<List<Supporter>>() ?? [];
            return (supporters, download.Value.Details.ETag);
        }
        catch (RequestFailedException failure) when (failure.Status == 404)
        {
            return ([], null);
        }
    }

    private static Task WriteAsync(BlobClient blob, IReadOnlyList<Supporter> supporters, ETag? etag, CancellationToken cancellationToken)
    {
        var options = new BlobUploadOptions
        {
            HttpHeaders = new BlobHttpHeaders { ContentType = "application/json; charset=utf-8", CacheControl = "public, max-age=300" },
            Conditions = etag is { } match ? new BlobRequestConditions { IfMatch = match } : new BlobRequestConditions { IfNoneMatch = ETag.All },
        };
        return blob.UploadAsync(BinaryData.FromString(JsonSerializer.Serialize(supporters)), options, cancellationToken);
    }
}
