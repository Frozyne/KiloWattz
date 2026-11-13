import { useState, useEffect } from "react";
import LiveStat from "../../components/admin/LiveStatsRow";
import { useAuthStore } from "@/storage/useAuthStorage";
import { useUserByIdQuery } from "@/hooks/useUserQureies";
import HouseControl from "@/components/common/HouseControl";
import type { IHousehold } from "@/lib/types";
import WeatherStats from "@/components/common/WeatherStats";

export const OverviewPage: React.FC = () => {

  const id = useAuthStore().user?.id
  const {data: user} = useUserByIdQuery(id!)
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
        households?.length === 0 || !households ? 
        (<p className="p-5">No Households Found</p>) :
        (households?.map((household) => {
          return <HouseControl id={household._id} key={household._id}/>
        })
        )
      }
    </div>
  );
}
