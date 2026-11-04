using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;

namespace KofiSupporters.Supporters;

/// <summary>One public thank-you entry in supporters.json. No amount, no e-mail.</summary>
public sealed record Supporter(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("message")] string? Message,
    [property: JsonPropertyName("type")] string Type,
    [property: JsonPropertyName("date")] DateOnly Date)
{
    private const int MaxMessageLength = 200;

    /// <summary>Builds the public entry. The id is a short hash of Ko-fi's message_id, so retries can be spotted without publishing the id.</summary>
    public static Supporter From(KofiPayment payment)
    {
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(payment.MessageId ?? string.Empty));
        var name = string.IsNullOrWhiteSpace(payment.FromName) ? "Someone" : payment.FromName.Trim();
        var message = string.IsNullOrWhiteSpace(payment.Message) ? null : Shorten(payment.Message.Trim());
        return new Supporter(Convert.ToHexStringLower(hash)[..12], name, message, payment.Type ?? "Tip", DateOnly.FromDateTime(payment.Timestamp.UtcDateTime));
    }

    private static string Shorten(string text) =>
        text.Length <= MaxMessageLength ? text : string.Concat(text.AsSpan(0, MaxMessageLength - 1), "…");
}
