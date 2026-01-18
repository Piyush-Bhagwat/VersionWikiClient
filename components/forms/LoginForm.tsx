"use client";
import React, { FormEvent, useContext, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { userContext } from "@/context/userContext";
import {
    Mail,
    Lock,
    LogIn,
    Loader,
    AlertCircle,
    StickyNote,
    User,
    Notebook,
} from "lucide-react";
import api from "@/utils/api";

interface LoginData {
    email: string;
    password: string;
}

interface SignupData {
    name: string;
    email: string;
    password: string;
}

const AuthForm: React.FC = () => {
    const context = useContext(userContext);
    const [isLogin, setIsLogin] = useState(true);
    const [loginData, setLoginData] = useState<LoginData>({
        email: "",
        password: "",
    });
    const [signupData, setSignupData] = useState<SignupData>({
        name: "",
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");

    async function onLoginSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const d: AxiosResponse = await api.post(
                "api/auth/login",
                loginData,
            );

            if (d.status === 200) {
                context?.setUser(d?.data.data);
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    "Login failed. Please check your credentials and try again.",
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function onSignupSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const d: AxiosResponse = await api.post(
                "api/auth/register",
                signupData,
            );

            if (d.status === 200) {
                context?.setUser(d.data);
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    "Registration failed. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    }

    function switchMode() {
        setIsLogin(!isLogin);
        setError("");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
                        <Notebook className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {isLogin ? "Welcome Back" : "Get Started"}
                    </h1>
                    <p className="text-gray-600">
                        {isLogin
                            ? "Sign in to continue to your notes"
                            : "Create an account to start taking notes"}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Toggle Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                                isLogin
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            Sign In
                            {isLogin && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                                !isLogin
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            Sign Up
                            {!isLogin && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                            )}
                        </button>
                    </div>

                    <div className="p-8">
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-5">
                                <AlertCircle
                                    className="text-red-600 shrink-0 mt-0.5"
                                    size={20}
                                />
                                <div className="flex-1">
                                    <p className="text-sm text-red-800 font-medium">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Login Form */}
                        {isLogin ? (
                            <form
                                className="space-y-5"
                                onSubmit={onLoginSubmit}
                            >
                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            size={20}
                                        />
                                        <input
                                            type="email"
                                            required
                                            disabled={isLoading}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="you@example.com"
                                            onChange={(e) =>
                                                setLoginData((p) => ({
                                                    ...p,
                                                    email: e.target.value,
                                                }))
                                            }
                                            value={loginData.email}
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Password
                                        </label>
                                        <a
                                            href="#"
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <Lock
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            size={20}
                                        />
                                        <input
                                            type="password"
                                            required
                                            disabled={isLoading}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="••••••••"
                                            onChange={(e) =>
                                                setLoginData((p) => ({
                                                    ...p,
                                                    password: e.target.value,
                                                }))
                                            }
                                            value={loginData.password}
                                        />
                                    </div>
                                </div>

                                {/* Remember Me Checkbox */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="ml-2 text-sm text-gray-700 cursor-pointer"
                                    >
                                        Remember me for 30 days
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader
                                                className="animate-spin"
                                                size={20}
                                            />
                                            <span>Signing in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <LogIn size={20} />
                                            <span>Sign In</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            /* Signup Form */
                            <form
                                className="space-y-5"
                                onSubmit={onSignupSubmit}
                            >
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            size={20}
                                        />
                                        <input
                                            type="text"
                                            required
                                            disabled={isLoading}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="John Doe"
                                            onChange={(e) =>
                                                setSignupData((p) => ({
                                                    ...p,
                                                    name: e.target.value,
                                                }))
                                            }
                                            value={signupData.name}
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            size={20}
                                        />
                                        <input
                                            type="email"
                                            required
                                            disabled={isLoading}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="you@example.com"
                                            onChange={(e) =>
                                                setSignupData((p) => ({
                                                    ...p,
                                                    email: e.target.value,
                                                }))
                                            }
                                            value={signupData.email}
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            size={20}
                                        />
                                        <input
                                            type="password"
                                            required
                                            disabled={isLoading}
                                            minLength={6}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="••••••••"
                                            onChange={(e) =>
                                                setSignupData((p) => ({
                                                    ...p,
                                                    password: e.target.value,
                                                }))
                                            }
                                            value={signupData.password}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Must be at least 6 characters
                                    </p>
                                </div>

                                {/* Terms Checkbox */}
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        required
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-0.5"
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="ml-2 text-sm text-gray-700 cursor-pointer"
                                    >
                                        I agree to the{" "}
                                        <a
                                            href="#"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a
                                            href="#"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader
                                                className="animate-spin"
                                                size={20}
                                            />
                                            <span>Creating account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <User size={20} />
                                            <span>Create Account</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    By continuing, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                        Privacy Policy
                    </a>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
