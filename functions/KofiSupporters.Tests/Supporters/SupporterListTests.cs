using KofiSupporters.Supporters;

namespace KofiSupporters.Tests.Supporters;

public sealed class SupporterListTests
{
    private static Supporter Entry(string id) => new(id, "Name " + id, null, "Donation", new DateOnly(2026, 11, 4));

    [Fact]
    public void New_supporter_goes_on_top()
    {
        var updated = SupporterList.Add([Entry("a")], Entry("b"));

        Assert.Equal(["b", "a"], updated!.Select(entry => entry.Id));
    }

    [Fact]
    public void Same_payment_twice_is_ignored()
    {
        Assert.Null(SupporterList.Add([Entry("a")], Entry("a")));
    }
}
