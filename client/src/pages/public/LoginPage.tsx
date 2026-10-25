
import { useState, type FormEvent } from "react";
import { Zap, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { apiRequest } from "../../lib/api";

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      const result = await apiRequest<LoginResponse>("auth/sign-in", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!result.success) {
        throw new Error(result.message || "Login failed.");
      }

      // Redirect after successful login
      window.location.href = "/resident/dashboard";
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

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

          <h1 className="text-5xl font-bold leading-tight">
            Powering a brighter, more sustainable future.
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 opacity-80">
            Monitor energy usage, track your electricity quota, and stay
            connected to your community&apos;s energy system. KiloWattz empowers
            residents to make informed decisions about their energy consumption,
            contributing to a greener and more efficient future.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-5">
              <Zap className="mb-3 size-6" />

              <p className="font-semibold">Live Monitoring</p>

              <p className="mt-1 text-sm opacity-75">
                Stay informed with insights into your energy consumption,
                battery levels, and solar generation. Make informed decisions
                to optimize your energy usage and reduce costs.
              </p>
            </div>

            <div className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-5">
              <Lock className="mb-3 size-6" />

              <p className="font-semibold">Resident Access</p>

              <p className="mt-1 text-sm opacity-75">
                Access your electricity quota, monitor your energy usage, and
                stay connected to your community&apos;s energy system through
                a secure, user-friendly platform.
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm opacity-70">
          &copy; {new Date().getFullYear()} KiloWattz. All rights reserved.
        </p>

        <div className="pointer-events-none absolute -bottom-32 -right-24 size-96 rounded-full border border-primary-foreground/10" />

        <div className="pointer-events-none absolute -bottom-20 -right-12 size-72 rounded-full border border-primary-foreground/10" />
      </section>

      {/* Login Form */}
      <section className="flex w-full items-center justify-center px-6 py-12 sm:px-10 lg:w-[520px] lg:flex-none xl:w-[580px]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="rounded-xl bg-primary p-3 text-primary-foreground">
              <Zap className="size-6" />
            </div>

            <span className="text-2xl font-bold">KiloWattz</span>
          </div>

          {/* Heading */}
          <div>
            <p className="text-sm font-semibold text-primary">
              RESIDENT PORTAL
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back
            </h2>

            <p className="mt-3 text-muted-foreground">
              Sign in to access your energy dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-xl border bg-background px-4 focus-within:ring-2 focus-within:ring-ring">
                <Mail className="size-5 shrink-0 text-muted-foreground" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:underline"
                  onClick={() =>
                    alert("Password recovery will be added later.")
                  }
                >
                  Forgot password?
                </button>
              </div>

              <div className="flex items-center gap-3 rounded-xl border bg-background px-4 focus-within:ring-2 focus-within:ring-ring">
                <Lock className="size-5 shrink-0 text-muted-foreground" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  onClick={() => setShowPassword((current) => !current)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="size-4 rounded border-input accent-primary"
              />

              <label
                htmlFor="remember"
                className="text-sm font-medium text-foreground"
              >
                Remember me
              </label>
            </div>

            {/* Login Error */}
            {errorMessage && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Support */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Need help accessing your account?{" "}
            <a
              href="mailto:support@kilowattz.example"
              className="font-semibold text-primary hover:underline"
            >
              Contact Support
            </a>
          </p>

          <p className="mt-10 text-center text-xs text-muted-foreground">
            Secure access to your community energy.
          </p>
        </div>
      </section>
    </main>
  );
}
