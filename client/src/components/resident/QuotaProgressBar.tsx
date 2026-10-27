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
            
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
                <progress
                className="quota-progress h-full w-full"
                value={used}
                max={quota}
                aria-label="Electricity quota used"
                />
            </div>

            <div className="mt-3 flex items-center justify-betweentext-sm">
                <span className="text-muted-foreground">
                    {percentage}% used
                </span>
                <span className="font-medium">
                    {remaining} kWh remaining
                </span>
            </div>

            <style>{`
            .quota-progress {
            appearance: none;
            -webkit-appearance: none;
            border: none;
            background: transparent;
            }
            
            .quota-progress::-webkit-progress-bar {
            background: transparent;
            }

            .quota-progress::-webkit-progress-value {
            background: hsl(var(--primary));
            border-radius: 9999px;
            transition: width 300ms ease;
            }

            .quota-progress::-moz-progress-bar {
            background: hsl(var(--primary));
            border-radius: 9999px;
            }
            `}</style>
        </section>
    );
}