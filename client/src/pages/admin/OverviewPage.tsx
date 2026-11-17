import { Loader2 } from "lucide-react";
import LiveStat from "../../components/common/overview/LiveStatsRow";
import { useCurrentUserQuery } from "@/hooks/useUserQureies";
import HouseControl from "@/components/common/overview/HouseControl";
import WeatherStats from "@/components/common/WeatherStats";

export const OverviewPage: React.FC = () => {

  const { data: user, isLoading } = useCurrentUserQuery();
  const households = user?.households ?? [];

  return (
    <div>
      <WeatherStats />
      <LiveStat />
      {isLoading ? (
        <div className="p-8 flex justify-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : households.length === 0 ? (
        <p className="p-5">No Households Found</p>
      ) : (
        households.map((household) => (
          <HouseControl id={household._id} key={household._id} />
        ))
      )}
    </div>
  );
}
