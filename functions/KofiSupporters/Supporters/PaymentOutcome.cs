namespace KofiSupporters.Supporters;

/// <summary>What the webhook should do with an incoming request.</summary>
public enum PaymentOutcome
{
    /// <summary>No data field, or data that is not a Ko-fi payment.</summary>
    Malformed,

    /// <summary>The verification token is missing or wrong.</summary>
    Unverified,

    /// <summary>A genuine payment the supporter chose to keep private: publish nothing.</summary>
    Private,

    /// <summary>A genuine public payment: thank the supporter on the blog.</summary>
    Public,
}
