import {useState, type SubmitEvent } from "react";
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
import { Zap, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard/overview'

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
    <main className="flex min-h-screen bg-background text-foreground justify-center ">
      
      {/* Login Form */}
      
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 sm:p-8 w-full">
            <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-zinc-100 shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <Zap className="h-8 w-8 text-emerald-400 animate-pulse" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">KiloWattz System Access</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Enter your credentials to access the grid telemetry dashboard
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit} autoComplete="on">
                    <CardContent className="space-y-4">
                        {errorMessage && (
                            <Alert variant="destructive" className="bg-rose-950/50 border-rose-800 text-rose-300">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}

                        {/* Email Input with Autocomplete */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-300">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                name="username"
                                type="email"
                                autoComplete="username"
                                placeholder="operator@kilowattz.io"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500"
                            />
                        </div>

                        {/* Password Input with Visibility Toggle & Autocomplete */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-zinc-300">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 focus:outline-none"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
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
                                'Sign In to Dashboard'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </main>
  );
}
