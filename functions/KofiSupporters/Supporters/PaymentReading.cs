namespace KofiSupporters.Supporters;

/// <summary>The outcome of reading a webhook request, with the payment when it was genuine.</summary>
public sealed record PaymentReading(PaymentOutcome Outcome, KofiPayment? Payment = null);
