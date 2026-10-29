import { useEffect, useState } from "react";
import { Zap, BatteryCharging, Sun } from "lucide-react";
import { apiRequest } from "../../services/api";

interface Household {
    _id: string;
}

interface UserProfile {
    households?: Household[];
}

interface ProfileResponse {
    success: boolean;
    message: string;
    data: {
        user: UserProfile;
    };
}

interface TelemetryRecord {
    _id?: string;
    timestamp: string;
    scope: "Community" | "Household";
    household: string;
    solarGeneratedKW: number;
    powerConsumedKW: number;
    batteryLevelPercent: number;
    gridVoltage: number;
    solarGeneratedKWh?: number;
    powerConsumedKWh?: number;
}

interface TelemetryResponse {
    success: boolean;
    message: string;
    data: TelemetryRecord[];
}

export default function ResidentLiveStats() {
    const [telemetry, setTelemetry] = useState<TelemetryRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchTelemetry() {
            try {
                setLoading(true);
                setError("");

                // Step 1: Get the logged-in user's profile.
                const profileResponse =
                    await apiRequest<ProfileResponse>("user");

                // Step 2: Get the household linked to that user.
                const householdId =
                    profileResponse.data.user.households?.[0]?._id;

                if (!householdId) {
                    throw new Error(
                        "No household is linked to your user profile."
                    );
                }

                // Step 3: Fetch the household's telemetry records.
                const telemetryResponse =
                    await apiRequest<TelemetryResponse>(
                        `telemetry/household/${householdId}`
                    );

                // The backend sorts records newest first.
                const latestRecord = telemetryResponse.data?.[0] ?? null;

                if (!latestRecord) {
                    throw new Error(
                        "No household telemetry records are available yet."
                    );
                }

                setTelemetry(latestRecord);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load resident energy statistics."
                );
            } finally {
                setLoading(false);
            }
        }

        void fetchTelemetry();
    }, []);

    const stats = [
        {
            title: "Current Power Usage",
            value: telemetry
                ? `${telemetry.powerConsumedKW.toFixed(2)} kW`
                : "—",
            description: "Household power consumption",
            icon: Zap,
            color: "text-amber-500",
            background: "bg-amber-500/10",
        },
        {
            title: "Battery Level",
            value: telemetry
                ? `${telemetry.batteryLevelPercent}%`
                : "—",
            description: "Battery charge level",
            icon: BatteryCharging,
            color: "text-emerald-500",
            background: "bg-emerald-500/10",
        },
        {
            title: "Solar Generation",
            value: telemetry
                ? `${telemetry.solarGeneratedKW.toFixed(2)} kW`
                : "—",
            description: "Solar power generation",
            icon: Sun,
            color: "text-orange-500",
            background: "bg-orange-500/10",
        },
    ];

    return (
        <section className="space-y-4">
            {loading && (
                <p className="text-sm text-muted-foreground">
                    Loading energy statistics...
                </p>
            )}

            {!loading && error && (
                <output
                   className="text-sm text-destructive"
                   aria-live="polite" >
                    {error}
                   </output>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <article
                            key={stat.title}
                            className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {stat.title}
                                    </p>

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight">
                                        {loading ? "..." : stat.value}
                                    </h2>
                                </div>

                                <div
                                    className={`rounded-lg p-3 ${stat.background}`}
                                >
                                    <Icon
                                        className={`size-5 ${stat.color}`}
                                    />
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-muted-foreground">
                                {stat.description}
                            </p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}