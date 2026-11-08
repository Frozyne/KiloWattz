import NavBar from "../../components/admin/NavBar";
import AdminLiveStat from "../../components/admin/AdminLiveStatsRow";
import { Button } from "@/components/ui/button";
import { ArrowDownToLineIcon, PlusIcon } from "lucide-react";

export const OverviewPage: React.FC = () => {
  return (
    <div className="bg-secondary border-zinc-800/80 rounded-3xl mb-2">
      <NavBar />
      <div> 
        <div className="text-sm text-white mt-3 border-t-3 ml-2 p-3"><small>TUESDAY, JUNE 25. CLEAR SKIES</small>
          <p className="flex text-accent text-2xl">Solar Operations Overview</p>
          <small className="text-primary">Live generation and performance across your entire portfolio.</small>
          <div className="flex justify-end mt-2">
            <Button className="bg-white text-primary"><ArrowDownToLineIcon/>Export report</Button>
            <Button className="bg-primary text-secondary ml-2"><PlusIcon/>Add site</Button>
            </div>
        </div>
        </div>
      <AdminLiveStat />
    </div>
  );
}
