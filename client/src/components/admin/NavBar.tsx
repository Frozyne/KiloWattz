import { Button } from "@base-ui/react";
import { Search } from "lucide-react";
import { UserIcon, MessageSquareDotIcon, BellDotIcon, Sun } from "lucide-react" 
import { useState } from "react";

export default function NavBar(){
  const [client, setClient] = useState("All")
    return(
        <nav className="bg-olive-500 rounded-3xl flex items-center justify-around">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sun className="h-6 w-6 text-zinc-950 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Kilo<span className="text-amber-400">Wattz</span>
          </span>
        </div>
        </div>
          <div className="relative w-full max-w-xs">
            <Search
            size={18}
             className="absolute left-3 top-1/2 -translate-y-1/2  text-gray-200 pointer-events-none" />
            <input
            type="type"
            className="w-full py-2 border rounded-lg pl-10 pr-3 text-sm ouline-none focus:ring-2 focus:ring-gray-200 text-gray-200"
            placeholder="Search..."/>
          </div>
          <div>
            <select value={client}
                        onChange={(e) => { setClient(e.target.value); }}
                        className="rounded-md border border-gray-400 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 text-gray-200">
                            <option value="All">Client Swicher: Individual</option>
                            <option value="North">North</option>
                            <option value="South">South</option>
                            <option value="East">East</option>
                            <option value="West">West</option>
                        </select>
          </div>
        <div className="flex items-center justify-end translate-y-1 gap-4 p-5 ml-25">
          <Button className="bg-white text-black border-2 font-thin text-sm rounded-2xl mt-1 p-1 animate-pulse">
            🔴 LIVE
          </Button>
          <Button className=" text-white icon-button">
            <BellDotIcon/>
          </Button>
          <Button className="text-white font-medium"><MessageSquareDotIcon/></Button>
          <Button className=" text-white">
            <UserIcon/>
          </Button>
        </div>
      </nav>
    )
}
