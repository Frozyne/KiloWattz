import { ArrowRightIcon } from "lucide-react"
export default function Health(){
    return(
        <div className="border-zinc-800/80 rounded-2xl bg-green-100 py-1 p-2 mt-2">
          <span className="flex justify-between font-bold text-primary">Assets Health
            <span>View all assets <ArrowRightIcon/></span>
          </span>
          <p className="font-extralight text-sm text-primary">Real-time status across all field equipment</p>
          <div className="grid grid-cols-4 gap-4 mt-3 border-t p-2 ml-1">
            <div className="flex flex-col border-r">
            <strong className="text-lg ml-3 text-primary">1,248</strong>
            <small className="text-primary mt-1">Solar modules</small>
            <div className="flex gap-1 mt-1">
            <small className=" text-green-300">⏺</small><small className="flex justify-center text-primary">100% online</small></div>
            </div>
            <div className="flex flex-col border-r">
            <strong className="ml-4 text-lg text-primary">48</strong>
            <small className="p-1 pl-2 text-primary">Inverters</small>
            <div className="flex gap-1 mt-1">
            <small className="text-orange-400">⏺</small><small className="flex text-primary">47 online, 1 warning</small></div>
            </div>
            <div className="flex flex-col border-r">
            <strong className="text-lg ml-3 text-primary">12</strong><small className="p-1 text-primary">Combiner boxes</small>
            <div className="flex gap-1">
            <small className="text-green-300">⏺</small>
            <small className="text-primary">100% online</small>
            </div>
            </div>
            <div className="border-r">
            <strong className="ml-8 text-lg text-primary">6</strong>
            <p><small className="text-primary">Weather sensors</small></p>
              <div className="flex gap-1">
            <small className="text-green-300">⏺</small>
            <small className="text-primary">100% online</small>
            </div>
            </div>
          <div className="border rounded-2xl bg-white p-2 mt-5 mb-1">
              <small className="text-sm text-primary">SITE UPTIME</small>
              <p className="font-extrabold text-2xl text-primary">99.94%</p>
              <small className="font-extralight text-primary">Last 30 days</small>
            </div>
        </div>
      </div>
    )
}