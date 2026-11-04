using Azure.Identity;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace KofiSupporters.Supporters;

/// <summary>Wires the supporters slice: the blog's blob endpoint through the Function's managed identity, no keys.</summary>
public static class SupportersRegistration
{
    public static IServiceCollection AddSupporters(this IServiceCollection services, IConfiguration configuration)
    {
        var endpoint = configuration["SUPPORTERS_BLOB_URI"] ?? throw new InvalidOperationException("SUPPORTERS_BLOB_URI is not configured.");
        services.AddSingleton(new BlobServiceClient(new Uri(endpoint), new DefaultAzureCredential()));
        services.AddSingleton<SupporterStore>();
        return services;
    }
}
