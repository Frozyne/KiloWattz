import { ChartAreaIcon, PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";


export default function SolarSites(){
    const [query, setQuery] = useState("")
    const [region, setRegion] = useState("All")
    return(
        <div className="bg-white border rounded-2xl mt-3 ml-2">
            <span className="flex justify-between mt-3 p-3 text-2xl font-bold">Solar sites
            <Button className="bg-teal-800 text"><PlusIcon/>Add site</Button></span>
            <div>
                <p className="p-1 ml-2 text-sm text-gray-500 -translate-y-4">Monitor capacity, output, and operational health by location.</p>
            </div>

            <div>
                <div className="relative w-full max-w-sm ml-2 flex justify-between">
                     <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"/> 
                    <input 
                    type="text" 
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                    }}
                    placeholder="Search sites..."
                    className="rounded-md border py-2 pl-9 pr-3 text-sm outline-none focus:ring-gray-200"
                    />
                    <div className="translate-x-48">
                     <select value={region}
                        onChange={(e) => { setRegion(e.target.value); }}
                        className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200">
                            <option value="All">All regions</option>
                            <option value="North">North</option>
                            <option value="South">South</option>
                            <option value="East">East</option>
                            <option value="West">West</option>
                        </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 p-2 gap-2 border-t border-lg mt-2">
                    <div className="border rounded-lg mt-3 transition duration-300 hover:-translate-y-1 hover:bg-gray-50 hover:shadow-2xl cursor-pointer">
                        <div>
                        <span className="p-12 flex items-center justify-center rounded-lg font-bold text-2xl bg-gray-600 text-purple-100">DB</span>
                        <div className="p-1 ml-4 text-gray-500 text-sm"><small>Phoenix, AZ</small></div>
                        <p className="flex justify-end pr-2">Desert Bloom</p>
                        <span className="p-1 ml-4"><strong>12.8 MW</strong></span>
                        </div>
                        <span className="border-t border-gray-200 flex justify-between">
                        <p className="text-green-800 p-1 ml-2"><small>98% performance</small></p>
                        <p className="text-gray-500 pr-3"><small>68 MWh today</small></p></span>
                        <div className="flex ml-2 pr-3 justify-between">
                        <Button className="bg-white text-black border-gray-200 p-2 ml-2 w-50 mb-2"><ChartAreaIcon/><small>View site</small></Button>
                        <Button className="bg-white text-black -translate-x-6 p-2 w-fit">...</Button>
                        </div>
                    </div>
                    <div className="border rounded-lg mt-3 transition duration-300 hover:-transition-y-1 hover:bg-gray-50 hover:shadow-2xl cursor-pointer">
                        <div>
                        <span className="p-12 flex items-center justify-center rounded-lg font-bold text-2xl bg-purple-100 text-gray-600">NR</span>
                        <div className="p-1 ml-4 text-gray-500 text-sm"><small>Reno, NV</small></div>
                        <p className="flex justify-end pr-2">North Ridge</p>
                        <span className="p-1 ml-4"><strong>8.4 MW</strong></span>
                        </div>
                        <span className="border-t border-gray-200 flex justify-between">
                        <p className="text-green-800 p-1 ml-2"><small>96% performance</small></p>
                        <p className="text-gray-500 pr-3"><small>45 MWh today</small></p></span>
                        <div className="flex ml-2 pr-3 justify-between">
                        <Button className="bg-white text-black border-gray-200 p-2 ml-2 w-50 mb-2"><ChartAreaIcon/><small>View site</small></Button>
                        <Button className="bg-white text-black -translate-x-7 p-2 w-fit">...</Button>
                        </div>
                    </div>
                    <div className="border rounded-lg mt-2 transition duration-300 hover:-transition-y-1 hover:bg-gray-50 hover:shadow-2xl cursor-pointer">
                        <div>
                        <span className="p-12 flex items-center justify-center rounded-lg font-bold text-2xl bg-amber bg-amber-100 text-gray-600">SV</span>
                        <div className="p-1 ml-4 text-gray-500 text-sm"><small>Barkersfield, CA</small></div>
                        <p className="flex justify-end pr-2">Sunset Vailey</p>
                        <span className="p-1 ml-4"><strong>16.2 MW</strong></span>
                        </div>
                        <span className="border-t border-gray-200 flex justify-between">
                        <p className="text-green-800 p-1 ml-2"><small>91% performance</small></p>
                        <p className="text-gray-500 pr-3"><small>84 MWh today</small></p></span>
                        <div className="flex ml-2 pr-3 justify-between">
                        <Button className="bg-white text-black border-gray-200 p-2 ml-2 w-50 mb-2"><ChartAreaIcon/><small>View site</small></Button>
                        <Button className="bg-white text-black -translate-x-7 p-2 w-fit">...</Button>
                        </div>
                    </div>
                    <div className="border rounded-lg mt-2 transition duration-300 hover:-transition-y-1 hover:bg-gray-50 hover:shadow-2xl cursor-pointer">
                        <div>
                        <span className="p-12 flex items-center justify-center rounded-lg font-bold text-2xl bg-blue-200 text-gray-600">MS</span>
                        <div className="p-1 ml-4 text-gray-500 text-sm"><small>Mesa, AZ</small></div>
                        <p className="flex justify-end pr-2">Mesa Solar One</p>
                        <span className="p-1 ml-4"><strong>6.7 MW</strong></span>
                        </div>
                        <span className="border-t border-gray-200 flex justify-between">
                        <p className="text-green-800 p-1 ml-2"><small>99% performance</small></p>
                        <p className="text-gray-500 pr-3"><small>36 MWh today</small></p></span>
                        <div className="flex ml-2 pr-3 justify-between">
                        <Button className="bg-white text-black border-gray-200 p-2 ml-2 w-50 mb-2"><ChartAreaIcon/><small>View site</small></Button>
                        <Button className="bg-white text-black -translate-x-7 p-2 w-fit">...</Button>
                        </div>
                         </div>
                    <div className="border rounded-lg mt-2 duration-300 transition hover:-transition-y-1 hover:bg-gray-50 hover:shadow-2xl cursor-pointer">
                        <div className="border-lg border-gray-500">
                        <span className="p-12 flex items-center justify-center rounded-lg font-bold text-2xl bg-mauve-600 text-gray-800">LS</span>
                        <div className="p-1 ml-4 text-gray-500 text-sm"><small>Austin, TX</small></div>
                        <p className="flex justify-end pr-2">Lakeview Solar</p>
                        <span className="p-1 ml-4"><strong>9.1 MW</strong></span>
                        </div>
                        <span className="border-t border-gray-200 flex justify-between">
                        <p className="text-red-800 p-1 ml-2"><small>Offline</small></p>
                        <p className="text-gray-500 pr-3"><small>52 MWh today</small></p></span>
                        <div className="flex ml-2 pr-3 justify-between">
                        <Button className="bg-white text-black border-gray-200 p-2 ml-2 w-50 mb-2"><ChartAreaIcon/><small>View site</small></Button>
                        <Button className="bg-white text-black -translate-x-7 p-2 w-fit">...</Button>
                        </div>
                        </div>
                    <div className="border rounded-lg mt-2 transition duration-300 hover:-transition-y-1 hover:bg-gray-50 hover:shadow-2xl cursor-pointer">
                        <div>
                        <span className="p-12 flex items-center justify-center rounded-lg font-bold text-2xl bg-mist-300 text-gray-200">CP</span>
                        <div className="p-1 ml-4 text-gray-500 text-sm"><small>Moab, UT</small></div>
                        <p className="flex justify-end pr-2">Canyon Peak</p>
                        <span className="p-1 ml-4"><strong>11.4 MW</strong></span>
                        </div>
                        <span className="border-t border-gray-200 flex justify-between">
                        <p className="text-green-800 p-1 ml-2"><small>94% performance</small></p>
                        <p className="text-gray-500 pr-3"><small>61 MWh today</small></p></span>
                        <div className="flex ml-2 pr-3 justify-between">
                        <Button className="bg-white text-black border-gray-200 p-2 ml-2 w-50"><ChartAreaIcon/><small>View site</small></Button>
                        <Button className="bg-white text-black -translate-x-7 p-2 w-fit">...</Button>
                        </div>
                    </div>
                    </div>
            </div>
        </div>
        
    )
}
