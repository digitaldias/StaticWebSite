using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace KofiSupporters.Supporters;

/// <summary>Receives Ko-fi's payment webhook and thanks public supporters on the blog.</summary>
public sealed class KofiWebhook(SupporterStore store, IConfiguration configuration, ILogger<KofiWebhook> logger)
{
    [Function(nameof(KofiWebhook))]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "kofi")] HttpRequest request,
        CancellationToken cancellationToken)
    {
        if (!request.HasFormContentType)
        {
            return new BadRequestResult();
        }

        var form = await request.ReadFormAsync(cancellationToken);
        var reading = KofiPaymentReader.Read(form["data"], configuration["KOFI_VERIFICATION_TOKEN"]);
        logger.LogInformation("Ko-fi webhook: {Outcome}", reading.Outcome);

        switch (reading.Outcome)
        {
            case PaymentOutcome.Malformed:
                return new BadRequestResult();
            case PaymentOutcome.Unverified:
                return new UnauthorizedResult();
            case PaymentOutcome.Public:
                await store.AddAsync(Supporter.From(reading.Payment!), cancellationToken);
                return new OkResult();
            default:
                return new OkResult();
        }
    }
}
