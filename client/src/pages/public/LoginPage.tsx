import {useState, type SubmitEvent } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate, useLocation } from 'react-router'
import { useAuthStore } from '../../storage/useAuthStorage'
import { authService } from '../../services/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Zap, Loader2, AlertCircle } from 'lucide-react'

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      _id: string;
      email: string;
      role?: string;
    };
  };
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/overview'

  const handleSubmit = async (
    event: SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {

      const { user, token } = await authService.login({ email, password })

      setAuth(user, token)

      await navigate(from, { replace: true })

    } catch (error: any) {
      setErrorMessage(
        error.message ||
        "Failed to authenticate. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      {/* Left Panel */}
      <section className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary-foreground/10 p-3">
            <Zap className="size-7" />
          </div>

          <span className="text-2xl font-bold tracking-tight">
            KiloWattz
          </span>
        </div>

        <div className="relative z-10 max-w-lg">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] opacity-80">
            Smarter energy. Stronger communities.
          </p>

          <h1 className="text-5xl font-bold leading-tight text-emerald-300">
            Powering a brighter, more sustainable future.
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 opacity-80 text-green-100">
            Monitor energy usage, track your electricity quota, and stay
            connected to your community&apos;s energy system. KiloWattz empowers
            residents to make informed decisions about their energy consumption,
            contributing to a greener and more efficient future.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-5">
              <Zap className="mb-3 size-6" />

              <p className="font-semibold text-emerald-300">Live Monitoring</p>

              <p className="mt-1 text-sm opacity-75 text-green-100">
                Stay informed with insights into your energy consumption,
                battery levels, and solar generation. Make informed decisions
                to optimize your energy usage and reduce costs.
              </p>
            </div>

            <div className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-5">
              <Lock className="mb-3 size-6" />

              <p className="font-semibold text-emerald-300">Resident Access</p>

              <p className="mt-1 text-sm opacity-75 text-green-100">
                Access your electricity quota, monitor your energy usage, and
                stay connected to your community&apos;s energy system through
                a secure, user-friendly platform.
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm opacity-70 text-primary">
          &copy; {new Date().getFullYear()} KiloWattz. All rights reserved.
        </p>

        <div className="pointer-events-none absolute -bottom-32 -right-24 size-96 rounded-full border border-primary-foreground/10" />

        <div className="pointer-events-none absolute -bottom-20 -right-12 size-72 rounded-full border border-primary-foreground/10" />
      </section>

      {/* Login Form */}
      <section className="flex w-full items-center justify-center px-6 py-12 sm:px-10 lg:w-130 lg:flex-none xl:w-145px">
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <Zap className="h-8 w-8 text-emerald-400 animate-pulse" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">KiloWattz System Access</CardTitle>
                    <CardDescription className="text-slate-400">
                        Enter your credentials to access the grid telemetry dashboard
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {errorMessage && (
                            <Alert variant="destructive" className="bg-rose-950/50 border-rose-800 text-rose-300">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="operator@kilowattz.io"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-emerald-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-slate-300">
                                    Password
                                </Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-emerald-500"
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="pt-2">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                'Sign In to Command Center'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
      </section>
    </main>
  );
}
