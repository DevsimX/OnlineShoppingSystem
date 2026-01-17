"use client";

import { useLogin } from "@/hooks/useLogin";

type LoginFormProps = {
  onSuccess?: () => void;
  prefilledUsername?: string;
};

export default function LoginForm({ onSuccess, prefilledUsername = "" }: LoginFormProps) {
  const { loginData, setLoginData, loginError, isLoading, handleLogin } = useLogin(
    prefilledUsername,
    onSuccess
  );

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
