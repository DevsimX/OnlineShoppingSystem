"use client";

import { useRegister } from "@/hooks/useRegister";

type RegisterFormProps = {
  onSuccess?: (username: string) => void;
};

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const {
    registerData,
    setRegisterData,
    registerErrors,
    hasInteracted,
    setHasInteracted,
    isLoading,
    isValidEmail,
    isValidPhone,
    passwordsMatch,
    isStrongPassword,
    passwordRequirements,
    getPasswordStrengthLabel,
    getPasswordStrengthColor,
    handleRegister,
  } = useRegister(onSuccess);

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="register-username" className="block text-sm font-semibold mb-1 px-4">
          Username <span className="text-red-600">*</span>
        </label>
          <input
            id="register-username"
            type="text"
            placeholder="Input your username"
            required
            value={registerData.username}
            onChange={(e) => {
              setRegisterData({ ...registerData, username: e.target.value });
              setHasInteracted({ ...hasInteracted, username: true });
            }}
            onBlur={() => setHasInteracted({ ...hasInteracted, username: true })}
            className={`w-full bg-white rounded-full border-2 px-4 py-2 shadow-3d focus:ring-0 focus:outline-none ${
              registerErrors.username
                ? "border-red-500"
                : "border-[var(--pop-neutral-black)]"
            }`}
          />
          {registerErrors.username && (
            <p className="text-sm text-red-600 px-4 mt-1">{registerErrors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="register-email" className="block text-sm font-semibold mb-1 px-4">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="register-email"
            type="email"
            placeholder="Enter a valid email address"
            required
            value={registerData.email}
            onChange={(e) => {
              setRegisterData({ ...registerData, email: e.target.value });
              setHasInteracted({ ...hasInteracted, email: true });
            }}
            onBlur={() => setHasInteracted({ ...hasInteracted, email: true })}
            className={`w-full bg-white rounded-full border-2 px-4 py-2 shadow-3d focus:ring-0 focus:outline-none ${
              registerErrors.email || (hasInteracted.email && !isValidEmail)
                ? "border-red-500"
                : "border-[var(--pop-neutral-black)]"
            }`}
          />
          {registerErrors.email && (
            <p className="text-sm text-red-600 px-4 mt-1">{registerErrors.email}</p>
          )}
          {hasInteracted.email && registerData.email && !isValidEmail && !registerErrors.email && (
            <p className="text-sm text-red-600 px-4 mt-1">Please enter a valid email address</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="register-firstname" className="block text-sm font-semibold mb-1 px-2">
              First Name <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <input
              id="register-firstname"
              type="text"
              placeholder="First Name"
              value={registerData.first_name}
              onChange={(e) =>
                setRegisterData({ ...registerData, first_name: e.target.value })
              }
              className="w-full bg-white rounded-full border-2 border-[var(--pop-neutral-black)] px-4 py-2 shadow-3d focus:ring-0 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="register-lastname" className="block text-sm font-semibold mb-1 px-2">
              Last Name <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <input
              id="register-lastname"
              type="text"
              placeholder="Last Name"
              value={registerData.last_name}
              onChange={(e) =>
                setRegisterData({ ...registerData, last_name: e.target.value })
              }
              className="w-full bg-white rounded-full border-2 border-[var(--pop-neutral-black)] px-4 py-2 shadow-3d focus:ring-0 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-phone" className="block text-sm font-semibold mb-1 px-4">
            Phone Number <span className="text-red-600">*</span>
          </label>
          <input
            id="register-phone"
            type="tel"
            placeholder="+61412345678 or 0412345678"
            required
            value={registerData.phone}
            onChange={(e) => {
              setRegisterData({ ...registerData, phone: e.target.value });
              setHasInteracted({ ...hasInteracted, phone: true });
            }}
            onBlur={() => setHasInteracted({ ...hasInteracted, phone: true })}
            className={`w-full bg-white rounded-full border-2 px-4 py-2 shadow-3d focus:ring-0 focus:outline-none ${
              registerErrors.phone || (hasInteracted.phone && registerData.phone && !isValidPhone)
                ? "border-red-500"
                : "border-[var(--pop-neutral-black)]"
            }`}
          />
          {registerErrors.phone && (
            <p className="text-sm text-red-600 px-4 mt-1">{registerErrors.phone}</p>
          )}
          {hasInteracted.phone && registerData.phone && !isValidPhone && !registerErrors.phone && (
            <p className="text-sm text-red-600 px-4 mt-1">
              Phone number must be in Australian format (+61XXXXXXXXX or 0XXXXXXXXX)
            </p>
          )}
        </div>

        <div>
          <label htmlFor="register-password" className="block text-sm font-semibold mb-1 px-4">
            Password <span className="text-red-600">*</span>
          </label>
          <input
            id="register-password"
            type="password"
            placeholder="Create a strong password"
            required
            value={registerData.password}
            onChange={(e) => {
              setRegisterData({ ...registerData, password: e.target.value });
              setHasInteracted({ ...hasInteracted, password: true });
            }}
            onBlur={() => setHasInteracted({ ...hasInteracted, password: true })}
            className={`w-full bg-white rounded-full border-2 px-4 py-2 shadow-3d focus:ring-0 focus:outline-none ${
              registerErrors.password || (hasInteracted.password && registerData.password && !isStrongPassword)
                ? "border-red-500"
                : "border-[var(--pop-neutral-black)]"
            }`}
          />
          {registerErrors.password && (
            <p className="text-sm text-red-600 px-4 mt-1">{registerErrors.password}</p>
          )}
          
          {/* Password Strength Indicator - Only show if password is not fully valid */}
          {registerData.password && !isStrongPassword && (
            <div className="px-4 mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Password Strength:</span>
                <span className={`text-sm font-semibold ${
                  getPasswordStrengthColor() === "red" ? "text-red-600" :
                  getPasswordStrengthColor() === "yellow" ? "text-yellow-600" :
                  getPasswordStrengthColor() === "blue" ? "text-blue-600" :
                  "text-green-600"
                }`}>
                  {getPasswordStrengthLabel()}
                </span>
              </div>
              
              {/* Password Requirements */}
              <div className="text-xs space-y-1">
                <div className={`flex items-center gap-2 ${
                  passwordRequirements.minLength ? "text-green-600" : "text-gray-500"
                }`}>
                  {passwordRequirements.minLength ? "✓" : "○"} At least 8 characters
                </div>
                <div className={`flex items-center gap-2 ${
                  passwordRequirements.hasUppercase ? "text-green-600" : "text-gray-500"
                }`}>
                  {passwordRequirements.hasUppercase ? "✓" : "○"} One uppercase letter
                </div>
                <div className={`flex items-center gap-2 ${
                  passwordRequirements.hasLowercase ? "text-green-600" : "text-gray-500"
                }`}>
                  {passwordRequirements.hasLowercase ? "✓" : "○"} One lowercase letter
                </div>
                <div className={`flex items-center gap-2 ${
                  passwordRequirements.hasNumber ? "text-green-600" : "text-gray-500"
                }`}>
                  {passwordRequirements.hasNumber ? "✓" : "○"} One number
                </div>
                <div className={`flex items-center gap-2 ${
                  passwordRequirements.hasSpecialChar ? "text-green-600" : "text-gray-500"
                }`}>
                  {passwordRequirements.hasSpecialChar ? "✓" : "○"} One special character (!@#$%^&*...)
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="register-password-confirm" className="block text-sm font-semibold mb-1 px-4">
            Confirm Password <span className="text-red-600">*</span>
          </label>
          <input
            id="register-password-confirm"
            type="password"
            placeholder="Re-enter your password"
            required
            value={registerData.password_confirm}
            onChange={(e) => {
              setRegisterData({ ...registerData, password_confirm: e.target.value });
              setHasInteracted({ ...hasInteracted, password_confirm: true });
            }}
            onBlur={() => setHasInteracted({ ...hasInteracted, password_confirm: true })}
            className={`w-full bg-white rounded-full border-2 px-4 py-2 shadow-3d focus:ring-0 focus:outline-none ${
              registerErrors.password_confirm || (hasInteracted.password_confirm && !passwordsMatch)
                ? "border-red-500"
                : "border-[var(--pop-neutral-black)]"
            }`}
          />
          {registerErrors.password_confirm && (
            <p className="text-sm text-red-600 px-4 mt-1">
              {registerErrors.password_confirm}
            </p>
          )}
          {hasInteracted.password_confirm && registerData.password_confirm && !passwordsMatch && !registerErrors.password_confirm && (
            <p className="text-sm text-red-600 px-4 mt-1">Passwords do not match</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center uppercase tracking-wide font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-[var(--pop-red-accent)] text-white hover:bg-[var(--pop-teal-mid)] border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full w-full"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
}
