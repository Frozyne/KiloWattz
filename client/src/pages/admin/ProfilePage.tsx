import { UserIcon, Zap, ChevronDown, Mail, PhoneCall, Calendar, Pencil, Check, X, House, MapPin, IdCardIcon, ActivityIcon, GaugeIcon, PowerIcon  } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


interface Device {
  _id: string;
  name: string;
  isOn: boolean;
}

export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, }); 

export default function ProfilePage() {
  const useMock = import.meta.env.VITE_USE_MOCK === "true";
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [contact, setContact] = useState({
    name: "Praise Komolafe",
    email: "Komolafe018@gmail.com",
    phone: "+234 90176-400-59",
    dob: "1999-11-29"
  });
  const [draft, setDraft] = useState(contact);

  const startEdit = () => {
    setDraft(contact);
    setIsEditing(true);
  };

  const save = () => {
    if (!draft.name.trim()) return;
    setContact(draft);
    setIsEditing(false);
  };

  const cancel = () => setIsEditing(false);

  const formatDate = (iso: string) =>
  iso
    ? new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Not set";

   const { data: devices = [], isLoading, isError } = useQuery<Device[]>({
  queryKey: ["devices"],
  queryFn: async () => {
    if (useMock) {
      return [
        { _id: "1", name: "Air conditioner", isOn: true },
        { _id: "2", name: "Refrigerator", isOn: true },
      ];
    }
    return (await api.get("/devices")).data;
  },
});

  const setAll = useMutation({
  mutationFn: async (state: boolean) => {
    if (useMock) {
      queryClient.setQueryData<Device[]>(["devices"], (old = []) =>
        old.map((d) => ({ ...d, isOn: state }))
      );
      return;
    }
    return api.post("/devices/all", { isOn: state });
  },
  onSuccess: () => {
    if (!useMock) queryClient.invalidateQueries({ queryKey: ["devices"] });
  },
});

  const total = devices.length;
  const on = devices.filter((d) => d.isOn).length;
  const anyOn = on > 0;

  return (
    <main className="min-h-screen">
      <section className="flex items-center justify-between p-4 bg-background border rounded-lg mt-4 m-5">
        <div>
          <div className="flex items-center gap-1">
            <Zap
              className="size-13 bg-secondary border border-white rounded-xl p-1 mt-2 text-accent ml-2 font-bold"
              strokeWidth={0.6}
            />
            <span className="-translate-y-1 text-2xl text-secondary font-mono ml-1">
              Kilo<span>Wattz</span>
            </span>
            <p className="translate-y-5 flex -translate-x-30 py-1 text-primary text-sm">
              <small>RESIDENT PROFILE</small>
            </p>
          </div>
        </div>

        <div className="relative border rounded-full bg-secondary">
          <Button className="h-auto py-2" onClick={() => setOpen(!open)}>
            <UserIcon
              className="size-8 bg-zinc-900/40 border-zinc-800 rounded-lg p-1 font-extralight"
              strokeWidth={0.5}
            />
            <div className="flex flex-col items-start text-accent">
              <span>Komolafe Praise</span>
              <small className="text-accent">Resident</small>
            </div>
            <ChevronDown
              className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </Button>

          {open && (
            <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border bg-accent p-4 shadow-lg">
              <p><strong>Terminal:</strong> Terminal 2</p>
              <p><strong>Name:</strong> Solar</p>
              <p><strong>Connection status:</strong> Strong</p>
              <p><strong>Comsumed kWh:</strong> 100 kWh</p>
            </div>
          )}
        </div>
      </section>

     <div className="flex justify-start mt-15 p-3 border rounded-lg bg-accent m-5">
        <div className="flex flex-col">
          <small className="text-sm text-primary">GOOD AFTERNOON, PRAISE</small>
          <strong className="text-3xl tracking-widest">Your energy at a glance.</strong>
          <p className="text-sm text-primary">Select your profile in the upper-right corner to view resident and meter details</p>
        </div>
      </div>

<div className="grid grid-cols-2">
      <div className="border mx-5 rounded-lg p-3">
  <div className="flex items-center justify-between">
    <strong className="text-xl flex gap-1 text-secondary">
      <UserIcon /> Personal information
    </strong>

    {!isEditing ? (
      <button
        onClick={startEdit}
        className="flex items-center gap-1 rounded-lg border px-3 py-1 text-sm hover:bg-gray-100 bg-secondary text-accent"
      >
        <Pencil className="size-4" /> Edit
      </button>
    ) : (
      <div className="flex gap-2">
        <button
          onClick={cancel}
          className="flex items-center gap-1 rounded-lg border px-3 py-1 text-sm hover:bg-gray-100"
        >
          <X className="size-4" /> Cancel
        </button>
        <button
          onClick={save}
          className="flex items-center gap-1 rounded-lg bg-emerald-900 px-3 py-1 text-sm text-white hover:bg-emerald-800"
        >
          <Check className="size-4" /> Save
        </button>
      </div>
    )}
  </div>

  <div className="flex flex-col border-t mt-3">
  <small className="flex items-center text-gray-500 gap-3">
    <UserIcon className="border-gray-700 bg-gray-700/10 size-9 rounded-full p-1 text-gray-500 mt-2" /> Full name
  </small>
  {isEditing ? (
    <input
      type="text"
      value={draft.name}
      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
      className="ml-12 mb-2 rounded-lg border px-3 py-1 text-lg font-mono"
    />
  ) : (
    <p className="ml-12 text-lg font-mono -translate-y-2">{contact.name}</p>
  )}
</div>

  <div className="flex flex-col border-t mt-2">
    <small className="flex items-center text-gray-500 gap-3">
      <Mail className="border-gray-700 bg-gray-700/10 size-9 rounded-full p-2 text-gray-500 mt-2" /> Email address
    </small>
    {isEditing ? (
      <input
        type="email"
        value={draft.email}
        onChange={(e) => setDraft({ ...draft, email: e.target.value })}
        className="ml-12 mb-2 w-[calc(100%-3rem)] rounded-lg border px-3 py-1 text-lg font-mono"
      />
    ) : (
      <>
        <p className="ml-12 text-lg font-mono -translate-y-2">{contact.email}</p>
        <small className="translate-x-12 border-gray-500/5 bg-gray-700/10 w-fit rounded text-gray-500 text-sm lowercase">
          verified
        </small>
      </>
    )}
  </div>

  <div className="border-t mt-3">
    <small className="flex items-center text-gray-500 gap-3">
      <PhoneCall className="border-gray-700 bg-gray-700/10 size-9 rounded-full p-2 text-gray-500 mt-2" /> Phone number
    </small>
    {isEditing ? (
      <input
        type="tel"
        value={draft.phone}
        onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
        className="ml-12 mb-2 rounded-lg border px-3 py-1 text-lg font-mono"
      />
    ) : (
      <p className="ml-12 text-lg font-mono -translate-y-2">{contact.phone}</p>
    )}
  </div>

  <div className="border-t mt-3">
  <small className="flex items-center text-gray-500 gap-3">
    <Calendar className="border-gray-700 bg-gray-700/10 size-9 rounded-full p-2 text-gray-500 mt-2" /> Date of birth
  </small>
  {isEditing ? (
    <input
      type="date"
      value={draft.dob}
      max={new Date().toISOString().split("T")[0]}
      onChange={(e) => setDraft({ ...draft, dob: e.target.value })}
      className="ml-12 mb-2 rounded-lg border px-3 py-1 text-lg font-mono"
    />
  ) : (
    <p className="ml-12 text-lg font-mono -translate-y-2">{formatDate(contact.dob)}</p>
  )}
</div>
</div>
<div className="border mx-5 rounded-lg p-4">
  <div className="flex flex-col">
    <div className="flex items-center gap-1 text-xl font-bold"><House className="size-6 font-extralight"/>House-hold details
    </div>
    <div className="flex items-center border-t mt-2 gap-2">
      <MapPin className="mt-3 border-gray-300/20 bg-gray-400/10 text-gray-400 p-1 size-10 rounded-full"/>
     <span>
      <small className="text-gray-400 font-semibold">Address</small></span>
      <span className="translate-x-12 border-gray-500/10 bg-amber-400/15 text-gray-400 rounded-full text-sm p-1">
       <small>Active</small>
       </span>
       </div>
      <p className="ml-12 -translate-y-3 font-serif">Academy, Olomi, Oyo Ibadan.</p>
  </div>
  <div className="flex flex-col gap-2 border-t">
    <div className="flex items-center gap-2 mt-2">
    <GaugeIcon className="mt-3 border-gray-300/20 bg-gray-400/10 text-gray-400 p-1 size-10 rounded-full"/>
    <span> <small className="text-gray-400 font-semibold"> Meter Number</small></span>
    </div>
    <p className="ml-12 -translate-y-3 font-serif text-xl">04123456789</p>
  </div>
  <div className="flex flex-col border-t">
    <div className="flex items-center gap-2 mt-2">
    <ActivityIcon className="mt-3 border-gray-300/20 bg-gray-400/10 text-gray-400 p-1 size-10 rounded-full"/>
    <span> <small className="text-gray-400 font-semibold"> Meter Usage</small></span>
    </div>
    <p className="ml-12 -translate-y-3 font-serif text-xl">182.5 kWh</p>
  </div>
  <div className="flex flex-col border-t">
    <div className="flex items-center gap-2 mt-2">
    <Zap className="mt-3 border-gray-300/20 bg-gray-400/10 text-gray-400 p-1 size-10 rounded-full"/>
    <span> <small className="text-gray-400 font-semibold">Quota</small></span>
    </div>
    <p className="ml-12 -translate-y-3 font-serif text-xl">250 kWh</p>
  </div>
  <div className="flex flex-col border-t">
    <div className="flex items-center gap-2 mt-2">
     <IdCardIcon className="mt-3 border-gray-300/20 bg-gray-400/10 text-gray-400 p-1 size-10 rounded-full"/>
    <span> <small className="text-gray-400 font-semibold"> Phase</small></span>
    </div>
    <p className="ml-12 -translate-y-3 font-serif text-xl">Single Phase</p>
  </div>
</div>
</div>
 <div className="mx-5 rounded-2xl border bg-accent mt-2 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Button size="icon" variant="outline" aria-label="Power" className="bg-secondary text-accent translate-y-3">
              <PowerIcon size={20} />
            </Button>
            <small className="font-medium text-primary uppercase">Whole-home control</small>
          </div>
          <h1 className="text-2xl font-bold pl-11 -translate-y-3">All appliances</h1>
          <p className="text-sm text-secondary pl-11 -translate-y-2">
            {on} of {total} devices are on
          </p>
        </div>

        <Button
          variant={anyOn ? "destructive" : "default"}
          disabled={setAll.isPending || total === 0}
          onClick={() => setAll.mutate(!anyOn)}
        >
          <div className="flex items-center gap-2">
            <PowerIcon size={16} />
            {anyOn ? "Turn all off" : "Turn all on"}
          </div>
        </Button>
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm text-secondary border-t-2">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Connected to the Daylight Home Energy Hub
      </p>

      <p className="text-sm text-secondary pl-5">
  {isLoading
    ? "Loading devices..."
    : isError
    ? "Couldn't load devices."
    : `${on} of ${total} devices are on`}
</p>
    </div>
    </main>
  );
}
