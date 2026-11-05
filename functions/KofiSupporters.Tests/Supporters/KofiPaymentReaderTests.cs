using KofiSupporters.Supporters;

namespace KofiSupporters.Tests.Supporters;

public sealed class KofiPaymentReaderTests
{
    private const string Token = "test-token";

    private static string Payload(string token = Token, bool isPublic = true, string messageId = "abc-123") =>
        $$"""{"verification_token":"{{token}}","message_id":"{{messageId}}","timestamp":"2026-11-04T08:00:00Z","type":"Donation","is_public":{{(isPublic ? "true" : "false")}},"from_name":"Jo Example","message":"Good morning","amount":"3.00","email":"jo@example.com"}""";

    [Fact]
    public void Public_payment_with_the_right_token_is_public()
    {
        var reading = KofiPaymentReader.Read(Payload(), Token);

        Assert.Equal(PaymentOutcome.Public, reading.Outcome);
        Assert.Equal("Jo Example", reading.Payment!.FromName);
    }

    [Fact]
    public void Private_payment_is_private()
    {
        Assert.Equal(PaymentOutcome.Private, KofiPaymentReader.Read(Payload(isPublic: false), Token).Outcome);
    }

    [Fact]
    public void Wrong_token_is_unverified()
    {
        Assert.Equal(PaymentOutcome.Unverified, KofiPaymentReader.Read(Payload(token: "forged"), Token).Outcome);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("not json")]
    [InlineData("""{"verification_token":"test-token"}""")]
    public void Missing_or_broken_data_is_malformed(string? data)
    {
        Assert.Equal(PaymentOutcome.Malformed, KofiPaymentReader.Read(data, Token).Outcome);
    }

    [Fact]
    public void Missing_configuration_fails_loudly()
    {
        Assert.Throws<InvalidOperationException>(() => KofiPaymentReader.Read(Payload(), null));
    }
}
