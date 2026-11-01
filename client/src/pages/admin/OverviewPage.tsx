import Analytics from "../../components/admin/Analytics";
import NavBar from "../../components/admin/NavBar";
import WeatherCard from "../../components/admin/WeatherCard";
import AdminLiveStat from "../../components/admin/AdminLiveStatsRow";
import { Button } from "@/components/ui/button";
import { ArrowDownToLineIcon, PlusIcon } from "lucide-react";

export const OverviewPage: React.FC = () => {
  return (
    <div className="bg-primary border-zinc-800/80 rounded-lg">
      <NavBar />
      <div> 
        <div className="text-sm text-blue-200 mt-3 border-t-2 ml-2 p-3"><small>TUESDAY, JUNE 25. CLEAR SKIES</small>
          <p className="flex text-white text-2xl">Solar Operations Overview</p>
          <small className="text-blue-100">Live generation and performance across your entire portfolio.</small>
          <div className="flex justify-end mt-2">
            <Button className="bg-blue-200 text-blue-100"><ArrowDownToLineIcon/>Export report</Button>
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