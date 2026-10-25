export default function QuotaProgressBar() {
    const quota = 100;
    const used = 65;
    const remaining = quota - used;
    const percentage = (used / quota) * 100;

    return (
        <section className = "rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">
                        Electricity Quota
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Your monthly energy allowance
                    </p>
                </div>

                <span className="text-sm font-medium">
                    {used} / {quota} kWh
                </span>
            </div>

            <div
            className="mt-5 h-3 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Electricity quota used"
            aria-valuemin={0}
            aria-valuemax={quota}
            aria-valuenow={used} >
                <div
                className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${percentage}%` }} />
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    {percentage}% used
                </span>
                <span className="font-medium">
                    {remaining} kWh remaining
                </span>
            </div>
        </section>

    );
}