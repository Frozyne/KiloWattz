import { X, Bell, Sun, ArrowRightIcon } from "lucide-react";

export default function WeatherCard() {
  return (
    <div className="p-1 flex items-stretch gap-1">
      <div className="bg-white border p-4 rounded-2xl w-72 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="font-medium">Site Conditions</h1>
          <span className="border px-2 py-1 rounded-2xl text-sm bg-green-200 text-green-900 font-extralight">
            ⏺ Optimal
          </span>
        </div>
        <p className="text-sm text-gray-400 mt-1">On-site weather station</p>

        <div className="flex items-center gap-3 mt-5">
          <Sun size={40} color="orange" className="border p-1 bg-orange-200 rounded" />
          <div>
            <p className="text-2xl font-bold">28&deg;</p>
            <small className="text-gray-400">Clear skies</small>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-6 mt-4 pt-4 border-t text-sm">
          <div>
            <p className="text-gray-500">IRRADIANCE</p>
            <p className="font-bold">892<small className="font-extralight">W/m&sup2;</small></p>
          </div>
          <div>
            <p className="text-gray-500">WIND</p>
            <p className="font-bold">8.4<small className="font-extralight">km/h</small></p>
          </div>
          <div>
            <p className="text-gray-500">HUMIDITY</p>
            <p className="font-bold">34%</p>
          </div>
          <div>
            <p className="text-gray-500">MODULE TEMP</p>
            <p className="font-bold">42.6<small className="font-extralight">&deg;C</small></p>
          </div>
        </div>
      </div>
      <div className="bg-white border rounded-2xl p-4 w-80 shrink-0 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-500 text-sm">
            <Bell size={25} color="brown" className="py-1" />
            PERFORMANCE ALERT
          </span>
          <div className="flex items-center gap-1">
            <small className="font-extralight">12mins ago</small>
            <button><X size={15} /></button>
          </div>
        </div>

        <div className="mt-2 pl-8">
          <p className="font-black text-sm">Inverter B-14 underperforming</p>
          <p className="font-extralight text-sm">Output is 8.2% below its peer group.</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <small>Review asset</small>
            <ArrowRightIcon size={10} />
          </div>
        </div>
      </div>
    </div>
  );
}