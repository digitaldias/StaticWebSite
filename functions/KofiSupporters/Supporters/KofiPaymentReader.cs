using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace KofiSupporters.Supporters;

/// <summary>Parses Ko-fi's form field "data" and checks the verification token. Pure, so it is unit tested.</summary>
public static class KofiPaymentReader
{
    public static PaymentReading Read(string? data, string? expectedToken)
    {
        if (string.IsNullOrWhiteSpace(expectedToken))
        {
            throw new InvalidOperationException("KOFI_VERIFICATION_TOKEN is not configured.");
        }

        var payment = Parse(data);
        if (payment is null || string.IsNullOrWhiteSpace(payment.MessageId))
        {
            return new PaymentReading(PaymentOutcome.Malformed);
        }

        if (!TokensMatch(payment.VerificationToken, expectedToken))
        {
            return new PaymentReading(PaymentOutcome.Unverified);
        }

        return new PaymentReading(payment.IsPublic ? PaymentOutcome.Public : PaymentOutcome.Private, payment);
    }

    private static KofiPayment? Parse(string? data)
    {
        if (string.IsNullOrWhiteSpace(data))
        {
            return null;
        }

        try
        {
            return JsonSerializer.Deserialize<KofiPayment>(data);
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private static bool TokensMatch(string? actual, string expected) =>
        actual is not null && CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(actual), Encoding.UTF8.GetBytes(expected));
}
