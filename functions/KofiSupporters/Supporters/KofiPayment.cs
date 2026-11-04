using System.Text.Json.Serialization;

namespace KofiSupporters.Supporters;

/// <summary>The fields of a Ko-fi webhook payment that this feature reads.</summary>
public sealed record KofiPayment(
    [property: JsonPropertyName("verification_token")] string? VerificationToken,
    [property: JsonPropertyName("message_id")] string? MessageId,
    [property: JsonPropertyName("timestamp")] DateTimeOffset Timestamp,
    [property: JsonPropertyName("type")] string? Type,
    [property: JsonPropertyName("is_public")] bool IsPublic,
    [property: JsonPropertyName("from_name")] string? FromName,
    [property: JsonPropertyName("message")] string? Message);
