import Analytics from "../../components/admin/Analytics";
import NavBar from "../../components/admin/NavBar";
import WeatherCard from "../../components/admin/WeatherCard";
import AdminLiveStat from "../../components/admin/AdminLiveStatsRow";
import { Button } from "@/components/ui/button";
import { ArrowDownToLineIcon, PlusIcon } from "lucide-react";

export const OverviewPage: React.FC = () => {
  return (
    <div>
      <NavBar />
      <div> 
        <div className="text-sm text-teal-900 mt-3"><small>TUESDAY, JUNE 25. CLEAR SKIES</small>
          <p className="flex text-black text-2xl">Solar Operations Overview</p>
          <small className="text-gray-600">Live generation and performance across your entire portfolio.</small>
          <div className="flex justify-end">
            <Button className="bg-white text-black"><ArrowDownToLineIcon/>Export report</Button>
            <Button className="bg-green-900 text-white ml-2"><PlusIcon/>Add site</Button>
            </div>
        </div>
        </div>
      <AdminLiveStat />
      <Analytics />
      <WeatherCard />
    </div>
  );
}