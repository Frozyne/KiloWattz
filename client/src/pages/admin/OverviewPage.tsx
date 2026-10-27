import Analytics from "../../components/admin/Analytics";
import NavBar from "../../components/admin/NavBar";
import WeatherCard from "../../components/admin/WeatherCard";
import AdminLiveStat from "../../components/admin/AdminLiveStatsRow";

export const OverviewPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-3">
      <NavBar />
      <AdminLiveStat />
      <Analytics />
      <WeatherCard />
    </div>
  );
}