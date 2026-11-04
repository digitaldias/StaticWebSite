namespace KofiSupporters.Supporters;

/// <summary>The pure list rule behind supporters.json: newest first, each payment once.</summary>
public static class SupporterList
{
    /// <summary>Returns the list with the supporter on top, or null when the entry is already there (a Ko-fi retry).</summary>
    public static IReadOnlyList<Supporter>? Add(IReadOnlyList<Supporter> current, Supporter supporter) =>
        current.Any(existing => existing.Id == supporter.Id) ? null : [supporter, .. current];
}
