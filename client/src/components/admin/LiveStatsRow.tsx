import { Power, PowerOff, BatteryFull, BatteryMedium, BatteryLow, BatteryWarning, Zap, ZapOff } from "lucide-react";
import { useCommunityTelemetryQuery } from "@/hooks/useTelementryQueries";

const getBatteryStatusIcon = (batteryLevelPercent: number = 0) => {
  if (batteryLevelPercent >= 80) {
    return <BatteryFull size={20} className="text-indigo-300" />;
  }

  if (batteryLevelPercent > 50) {
    return <BatteryMedium size={20} className="text-gray-500" />;
  }

  if (batteryLevelPercent > 20) {
    return <BatteryLow size={20} className="text-gray-500" />;
  }

  return <BatteryWarning size={20} className="text-gray-500" />;
};

export default function LiveStat(){
  const { data: stats } = useCommunityTelemetryQuery()

  return( 
    <div className="grid grid-cols-3 gap-2">
      <div className="border bg-background mt-5 p-5 rounded-4xl text-2xl font-bold text-secondary">
        <h1 className="flex justify-between pt-2 mb-2 font-extralight text-sm text-primary">
          POWER 
          {
            stats?.summary.solarGeneratedKW ? 
            <Power size={20} className="text-amber-300" /> : 
            <PowerOff size={20} className="text-gray-500"/> 
          } 
        </h1>
        {stats?.summary.solarGeneratedKW} W
        {/* <p className="flex items-center gap-1 mt-4 text-sm">
          <ArrowUpIcon size={10}
            className="font-extralight" /> 7.2% vs yesterday
        </p> */}
      </div>
      <div className="border bg-background mt-5 p-5 rounded-4xl text-2xl font-bold text-secondary">
        <h1 className="flex justify-between pt-2 mb-2 font-extralight text-sm text-primary">
          BATTERY
          {getBatteryStatusIcon(stats?.summary.batteryLevelPercent)}
        </h1>
        {stats?.summary.batteryLevelPercent} %
        {/* <p className="flex items-center gap-1 mt-4 text-sm">
          <ArrowUpIcon size={10}
            className="font-extralight" /> 1.4% this month
        </p> */}
      </div>
      <div className="border bg-background mt-5 p-5 rounded-4xl text-2xl font-bold text-secondary">
        <h1 className="flex justify-between pt-2 mb-2 font-extralight text-sm text-primary">
          GRID VOLTAGE 
          {
            stats?.summary.gridVoltage ? 
            <Zap size={20} className="text-amber-300" /> : 
            <ZapOff size={20} className="text-gray-500"/> 
          } 
        </h1>
        {stats?.summary.gridVoltage} V
        {/* <p className="flex items-center gap-1 mt-4 text-sm">
          <ArrowUpIcon size={10}
            className="font-extralight" /> 0.6% vs. baseline
        </p> */}
      </div>
    </div>
  )
};