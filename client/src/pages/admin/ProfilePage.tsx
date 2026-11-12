import WeatherStats from "@/components/common/WeatherStats";
import { UserWidgetSection } from "@/components/common/profile/UserWidgetSection";

export default function ProfilePage() {

  return (
    <main className="min-h-screen">
      <WeatherStats />
      <UserWidgetSection />
    </main>
  );
}
