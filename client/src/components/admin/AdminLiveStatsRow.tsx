import { ArrowUpIcon, BarChartIcon, RatioIcon, Sun, Zap } from "lucide-react";

export default function AdminLiveStat(){
  return( 
<div className="grid grid-cols-2 gap-2 bg-background">
        <div className="border bg-background mt-5 p-5 rounded-4xl text-2xl font-bold text-secondary">
          <h1 className="flex justify-between pt-2 mb-2 font-extralight text-sm text-primary">LIVE OUTPUT <Zap size={20} className="text-accent" /> </h1>
          18.42MW
          <p className="flex items-center gap-1 mt-4 text-sm">
            <ArrowUpIcon size={10}
              className="font-extralight" /> 4.8% vs forecast
          </p>
        </div>
        <div className="border bg-background mt-5 p-5 rounded-2xl font-extrabold text-2xl">
          <h1 className="flex justify-between text-sm font-extralight text-primary">
            ENERGY TODAY <Sun className="text-amber-300" />
          </h1> 112.8WHM
          <p className="flex items-center gap-1 mt-2 text-sm font-bold">
            <ArrowUpIcon size={10}
              className="font-extrabold" /> 7.2% vs yesterday
          </p>
        </div>
        <div className="border bg-background rounded-4xl mt-5 p-5 text-2xl font-bold">
          <h1 className="flex justify-between font-extralight text-sm text-primary">
            REVENEW TODAY <BarChartIcon className="text-green-400"/>
          </h1>
          $8,206
          <p className="flex items-center text-sm gap-1 mt-2"> <ArrowUpIcon size={10} />1.4% this month</p>
        </div>
        <div className="border rounded-4xl mt-5 p-5 bg-background font-bold text-2xl">
          <h1 className="flex justify-between text-sm font-extralight text-primary">PERFOMANCE RATIO <RatioIcon className="text-secondary" /></h1>
          94.7%
          <p className="flex items-center gap-1 mt-2 text-sm"> <ArrowUpIcon size={10} /> 0.6% vs. baseline</p>
      </div>
      </div>
      )
};