using KofiSupporters.Supporters;

namespace KofiSupporters.Tests.Supporters;

public sealed class SupporterTests
{
    private static KofiPayment Payment(string? name = "Jo Example", string? message = "Good morning", string messageId = "abc-123") =>
        new("token", messageId, new DateTimeOffset(2026, 11, 4, 23, 30, 0, TimeSpan.FromHours(-2)), "Donation", true, name, message);

    [Fact]
    public void Keeps_name_message_type_and_utc_date_only()
    {
        var supporter = Supporter.From(Payment());

        Assert.Equal("Jo Example", supporter.Name);
        Assert.Equal("Good morning", supporter.Message);
        Assert.Equal("Donation", supporter.Type);
        Assert.Equal(new DateOnly(2026, 11, 5), supporter.Date);
    }

    [Fact]
    public void Id_is_a_stable_short_hash_not_the_message_id()
    {
        var first = Supporter.From(Payment());

        Assert.Equal(first.Id, Supporter.From(Payment()).Id);
        Assert.NotEqual(first.Id, Supporter.From(Payment(messageId: "other")).Id);
        Assert.Equal(12, first.Id.Length);
        Assert.DoesNotContain("abc", first.Id, StringComparison.Ordinal);
    }

    [Fact]
    public void Blank_name_and_blank_message_are_dropped()
    {
        var supporter = Supporter.From(Payment(name: "  ", message: " "));

        Assert.Null(supporter.Name);
        Assert.Null(supporter.Message);
    }

    [Fact]
    public void Long_message_is_cut_to_200_characters()
    {
        Assert.Equal(200, Supporter.From(Payment(message: new string('a', 500))).Message!.Length);
    }
}
