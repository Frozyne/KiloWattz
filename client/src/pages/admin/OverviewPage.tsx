import { useState, useEffect } from "react";
import LiveStat from "../../components/admin/LiveStatsRow";
import { useCurrentUserQuery } from "@/hooks/useUserQureies";
import HouseControl from "@/components/common/HouseControl";
import type { IHousehold } from "@/lib/types";
import WeatherStats from "@/components/common/WeatherStats";

export const OverviewPage: React.FC = () => {

  const {data: user} = useCurrentUserQuery()
  const [households, setHouseholds] = useState<IHousehold[]>([])
  const data: IHousehold[] = user?.households!

  useEffect(() => {
    const timer = setInterval(() => {
      setHouseholds(data)
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div>
      <WeatherStats />
      <LiveStat />
      { 
        households?.length === 0 ? 
        (<p className="p-5">No Households Found</p>) :
        (households?.map((household) => {
          return <HouseControl id={household._id} key={household._id}/>
        })
        )
      }
    </div>
  );
}
