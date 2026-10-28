import { Button } from "@base-ui/react";
import { Bell, Activity, } from "lucide-react" 

export default function NavBar(){
    return(
        <nav className="bg-white rounded-3xl">
        <div className="flex items-center justify-end mb-5 gap-4 p-5">
          <Button className="bg-white text-black border-2 font-thin text-sm rounded-2xl mt-1 p-1">
            🔴 LIVE
          </Button>
          <span className="sync-text text-sm font-extralight">Updated 8 sec ago</span>
          <Button className="bg-white text-black icon-button">
            <Bell/>
          </Button>
          <Button className="bg-white text-black">
            <Activity/>
          </Button>
        </div>
      </nav>
    )
}