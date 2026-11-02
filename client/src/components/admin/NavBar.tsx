import { Button } from "@base-ui/react";
import { Search } from "lucide-react";
import { UserIcon, MessageSquareDotIcon, BellDotIcon, Sun } from "lucide-react" 
import { useState } from "react";

export default function NavBar(){
  const [client, setClient] = useState("All")
    return(
        <nav className="bg-primary rounded-3xl flex items-center justify-around gap-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 ml-2">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-green-500 to-green-100 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sun className="h-6 w-6 text-zinc-950 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-green-700">
            Kilo<span className="text-green-100">Wattz</span>
          </span>
        </div>
        </div>
          <div className="relative w-full max-w-xs">
            <Search
            size={18}
             className="absolute left-3 top-1/2 -translate-y-1/2  text-green-100 pointer-events-none" />
            <input
            type="type"
            className="w-full py-2 border border-green-800 rounded-lg pl-10 pr-3 text-sm ouline-none focus:ring-2 focus:ring-gray-200 text-black"
            placeholder="Search..."/>
          </div>
          <div>
            <select value={client}
                        onChange={(e) => { setClient(e.target.value); }}
                        className="rounded-md border border-green-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 text-green-100">
                            <option value="All">Client Swicher: Individual</option>
                            <option value="North">North</option>
                            <option value="South">South</option>
                            <option value="East">East</option>
                            <option value="West">West</option>
                        </select>
          </div>
        <div className="flex items-center justify-end translate-y-1 gap-4 p-5 ml-25">
          <Button className=" text-green-100 border-green-700 font-thin text-sm rounded-2xl mt-1 p-1 animate-pulse">
            🔴 LIVE
          </Button>
          <Button className=" text-green-100 icon-button">
            <BellDotIcon/>
          </Button>
          <Button className="text-green-100"><MessageSquareDotIcon/></Button>
          <Button className=" text-green-100">
            <UserIcon/>
          </Button>
        </div>
      </nav>
    )
}
