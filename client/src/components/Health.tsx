import { Button } from "./ui/button"
import { useState } from "react"
import { ArrowRightIcon } from "lucide-react"
export default function Health(){
    const [activeNav, setActiveNav] = useState("Overview")
    return(
        <div className="border rounded-2xl bg-white py-1 p-2 mt-2">
          <span className="flex justify-between font-bold">Assets Health
            <span><Button onClick={() => setActiveNav("Assets")} className="bg-white text-black border-3">View all assets<ArrowRightIcon/></Button></span>
          </span>
          <p className="font-extralight text-sm text-gray-500 ">Real-time status across all field equipment</p>
          <div className="grid grid-cols-4 gap-4 mt-3 border-t p-2 ml-1">
            <div className="flex flex-col border-r">
            <strong className="text-lg ml-3">1,248</strong>
            <small className="text-gray-500 mt-1">Solar modules</small>
            <div className="flex gap-1 mt-1">
            <small className=" text-green-300">⏺</small><small className="flex justify-center">100% online</small></div>
            </div>
            <div className="flex flex-col border-r">
            <strong className="ml-4 text-lg">48</strong>
            <small className="p-1 pl-2">Inverters</small>
            <div className="flex gap-1 mt-1">
            <small className="text-orange-400">⏺</small><small className="flex">47 online, 1 warning</small></div>
            </div>
            <div className="flex flex-col border-r">
            <strong className="text-lg ml-3">12</strong><small className="p-1">Combiner boxes</small>
            <div className="flex gap-1">
            <small className="text-green-300">⏺</small>
            <small>100% online</small>
            </div>
            </div>
            <div className="border-r">
            <strong className="ml-8 text-lg">6</strong>
            <p><small>Weather sensors</small></p>
              <div className="flex gap-1">
            <small className="text-green-300">⏺</small>
            <small>100% online</small>
            </div>
            </div>
          <div className="border rounded-2xl bg-gray-200 p-2 mt-5 mb-1">
              <small className="text-sm text-gray-500">SITE UPTIME</small>
              <p className="font-extrabold text-2xl">99.94%</p>
              <small className="font-extralight text-gray-500">Last 30 days</small>
            </div>
        </div>
      </div>
    )
}