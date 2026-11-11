import { UserIcon, Zap, ChevronDown, Mail, PhoneCall, Calendar, Pencil, Check, X, House, MapPin, IdCardIcon, ActivityIcon, GaugeIcon, PowerIcon  } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import WeatherStats from "@/components/common/WeatherStats";
import { UserWidgetSection } from "@/components/common/UserWidgetSection";

export default function ProfilePage() {

  return (
    <main className="min-h-screen">
      <WeatherStats />
      <UserWidgetSection />
    </main>
  );
}
