import { useState } from "react";
import Health from "../Health";

type Reading = { date: string; output: number };

export default function Analytics({ data = [] }: { data?: Reading[] }) {
  const [mode, setMode] = useState<"day" | "month">("day");
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA")); // today, YYYY-MM-DD

  const [y, m, d] = date.split("-").map(Number);
  const start = mode === "day" ? new Date(y, m - 1, d) : new Date(y, m - 1, 1);
  const end = mode === "day" ? new Date(y, m - 1, d + 1) : new Date(y, m, 1);

  const filteredData = data.filter((item) => {
    const [iy, im, id] = item.date.slice(0, 10).split("-").map(Number);
    const t = new Date(iy, im - 1, id);
    return t >= start && t < end;
  });

  return (
    <>
      <div className="border rounded-4xl mt-4 p-5 bg-white">
        <div className="flex justify-between items-center font-normal text-black text-3xl">
          <span>Analytics</span>

          <div className="flex items-center gap-2 text-base">
            <div className="flex border rounded-lg overflow-hidden">
              {(["day", "month"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setMode(v)}
                  className={`px-1 ${mode === v ? "bg-orange-200 text-white" : ""}`}
                >
                  {v === "day" ? "Daily" : "Monthly"}
                </button>
              ))}
            </div>

            {mode === "day" ? (
              <input
                type="date"
                value={date}
                onChange={(e) => e.target.value && setDate(e.target.value)}
                className="border rounded-lg px-1"
              />
            ) : (
              <input
                type="month"
                value={date.slice(0, 7)}
                onChange={(e) => e.target.value && setDate(e.target.value + "-01")}
                className="border rounded-lg px-3 py-1"
              />
            )}
          </div>
        </div>

        <p className="text-sm text-gray-400">
          Analyze yield, availability, and environmental impact.
        </p>
        <h2 className="mt-2 p-5 pb-0">Current output</h2>

        <div className="flex justify-between items-center text-sm font-extralight">
          <p className="translate-x-6 pb-4">18.42MW</p>
          --- Actual --- Forecast
        </div>
        <div className="translate-x-10/14 text-sm font-mono mt-1">NOW</div>

        <div className="flex">
          <div className="shrink-0 w-14 flex flex-col justify-between text-sm text-gray-500 h-57.5 pt-1.25 pb-[3px] ml-2 leading-none">
            <span>24 MW</span>
            <span>18 MW</span>
            <span>12 MW</span>
            <span>6 MW</span>
            <span>0</span>
          </div>

          <div className="flex-1 min-w-0">
            <svg className="w-full block" preserveAspectRatio="none" viewBox="0 0 700 230">
              <defs>
                <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f4b63f" stopOpacity=".28" />
                  <stop offset="100%" stopColor="#f4b63f" stopOpacity=".02" />
                </linearGradient>
              </defs>
              <g stroke="#e5e7eb" strokeWidth="1">
                <line x1="0" x2="700" y1="12" y2="12" />
                <line x1="0" x2="700" y1="64" y2="64" />
                <line x1="0" x2="700" y1="116" y2="116" />
                <line x1="0" x2="700" y1="168" y2="168" />
                <line x1="0" x2="700" y1="220" y2="220" />
              </g>
              <path
                d="M0 219 C80 218 110 193 155 157 S230 76 294 49 S405 15 475 27 S590 91 700 190"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <path
                d="M0 220 C75 220 114 199 158 161 S233 83 294 55 S400 20 472 34 S584 99 700 194 L700 230 L0 230 Z"
                fill="url(#areaFill)"
              />
              <path
                d="M0 220 C75 220 114 199 158 161 S233 83 294 55 S400 20 472 34 S584 99 700 194"
                fill="none"
                stroke="#f4b63f"
                strokeWidth="3"
              />
              <line
                x1="489"
                x2="489"
                y1="22"
                y2="220"
                stroke="#9ca3af"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <circle cx="489" cy="39" r="7" fill="#f4b63f" fillOpacity="0.25" />
              <circle cx="489" cy="39" r="3.5" fill="#f4b63f" />
            </svg>

            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>June</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border rounded-4xl mt-4 p-5 bg-white">
        <Health />
      </div>
    </>
  );
}