import ResidentLiveStats from "../../components/resident/ResidentLiveStats";
import QuotaProgressBar from "../../components/resident/QuotaProgressBar";

export default function ResidentDashboard() {
    return (
        <main className="space-y-6 p-6">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">
                    Resident Dashboard
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Monitor your community energy usage and quota. The dashboard provides real-time insights into your energy consumption, battery levels, and solar generation. Stay informed and manage your energy usage effectively.
                </p>
            </header>

            <ResidentLiveStats />
            <QuotaProgressBar />
        </main>
    )
}