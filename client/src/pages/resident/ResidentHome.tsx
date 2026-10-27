
import ResidentLiveStats from "../../components/resident/ResidentLiveStats";
import QuotaProgressBar from "../../components/resident/QuotaProgressBar";
import SavingsSummary from "../../components/resident/SavingsSummary";

export default function ResidentHome() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <header>
          <p className="text-sm font-medium text-primary">
            KILOWATTZ RESIDENT PORTAL
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            My Home Overview
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Monitor your community energy usage, quota, and savings.
            Stay informed about your energy consumption and solar generation.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Live Energy Stats</h2>
          <ResidentLiveStats />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Electricity Quota</h2>
            <QuotaProgressBar />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Savings Summary</h2>
            <SavingsSummary />
          </div>
        </section>
      </div>
    </main>
  );
}
