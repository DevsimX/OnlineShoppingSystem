"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { login, setToken, setRefreshToken, type LoginData } from "@/lib/api/auth";

type LoginFormProps = {
  onSuccess?: () => void;
  prefilledUsername?: string;
};

export default function LoginForm({ onSuccess, prefilledUsername = "" }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>({
    username: prefilledUsername,
    password: "",
  });
  const [loginError, setLoginError] = useState<string>("");
  
  // Update username when prefilledUsername changes
  useEffect(() => {
    if (prefilledUsername) {
      setLoginData({ username: prefilledUsername, password: "" });
    }
  }, [prefilledUsername]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      const response = await login(loginData);
      setToken(response.token);
      setRefreshToken(response.refresh_token);
      toast.success("Login successful!");
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to protected page or home
        window.location.href = "/dashboard";
      }
    } catch (error) {
      const apiError = error as { error?: string; username?: string[]; password?: string[] };
      const errorMessage = apiError.error || apiError.username?.[0] || apiError.password?.[0] || "Login failed";
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="login-username" className="block text-sm font-semibold mb-1 px-4">
            Username <span className="text-red-600">*</span>
          </label>
          <input
            id="login-username"
            type="text"
            placeholder="Enter your username"
            required
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
            className="w-full bg-white rounded-full border-2 border-[var(--pop-neutral-black)] px-4 py-2 shadow-3d focus:ring-0 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-semibold mb-1 px-4">
            Password <span className="text-red-600">*</span>
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            required
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            className="w-full bg-white rounded-full border-2 border-[var(--pop-neutral-black)] px-4 py-2 shadow-3d focus:ring-0 focus:outline-none"
          />
        </div>
        {loginError && <p className="text-sm text-red-600 px-4">{loginError}</p>}
      </div>

      <div className="space-y-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center uppercase tracking-wide font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-[var(--pop-red-accent)] text-white hover:bg-[var(--pop-teal-mid)] border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full w-full"
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </div>
    </form>
  );
}
