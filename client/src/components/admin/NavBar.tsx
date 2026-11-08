import { Button } from "@base-ui/react";
import { Search } from "lucide-react";
import { Link } from "react-router";
import { UserIcon, MessageSquareDotIcon, BellDotIcon, Sun } from "lucide-react" 

export default function NavBar(){
    return(
        <nav className="bg-white rounded-3xl flex items-center justify-around gap-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 ml-2">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sun className="h-6 w-6 text-zinc-950 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-secondary">
            Kilo<span className="text-secondary">Wattz</span>
          </span>
        </div>
        </div>
          <div className="relative w-full max-w-xs">
            <Search
            size={18}
             className="absolute left-3 top-1/2 -translate-y-1/2  text-secondary pointer-events-none" />
            <input
            type="type"
            className="w-full py-2 border border-secondary rounded-lg pl-10 pr-3 text-sm ouline-none focus:ring-2 focus:ring-gray-200 text-primary"
            placeholder="Search..."/>
          </div>
        <div className="flex items-center justify-around translate-y-1 gap-4 p-5 ml-25">
          <Button className=" text-secondary icon-button">
            <BellDotIcon/>
          </Button>
          <Button className="text-secondary"><MessageSquareDotIcon/></Button>
          
          <Button render={<Link to="/profile"/> } nativeButton={false}className=" text-secondary">
            <UserIcon/>
          </Button>
        </div>
      </nav>
    )
}
