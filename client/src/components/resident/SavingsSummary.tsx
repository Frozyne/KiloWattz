import { TrendingDown, Wallet } from "lucide-react";

export default function SavingsSummary() {
  // Mock data
  const monthlySavings = 42.5;
  const totalSavings = 286.75;
  const currency = "CAD";

  return (
    <section className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Your Solar Savings
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            ${monthlySavings.toFixed(2)}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Estimated savings this month ({currency})
          </p>
        </div>

        <div className="rounded-lg bg-emerald-500/10 p-3">
          <Wallet className="size-6 text-emerald-600" />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-lg bg-muted/50 p-3">
        <TrendingDown className="size-5 text-emerald-600" />

        <div>
          <p className="text-sm font-semibold">
            ${totalSavings.toFixed(2)} saved so far
          </p>
          <p className="text-xs text-muted-foreground">
            Estimated total savings from community solar
          </p>
        </div>
      </div>
    </section>
  );
}
