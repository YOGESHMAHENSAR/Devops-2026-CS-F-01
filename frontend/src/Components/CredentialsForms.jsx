import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowLeft, ArrowRight, Mail, Lock, UserRound, Eye, EyeOff } from "lucide-react";
import GoogleAuthButton from "./GoogleAuthButton.jsx";
import { login, signup } from "../api/auth.js";

const loginSchema = Yup.object({
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required"),
});

const signUpSchema = Yup.object({
    name: Yup.string()
        .required("Name is required"),
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export default function CredentialsForms({
    role,
    onBack,
    onAuthSuccess,
    onForgotPassword,
}) {
    const [mode, setMode] = useState("login");
    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const isLogin = mode === "login";

    const roleName =
        role === "jobseeker"
            ? "Professional"
            : "Recruiter";

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },

        validationSchema: isLogin
            ? loginSchema
            : signUpSchema,

        enableReinitialize: true,

        onSubmit: async (values, { setSubmitting }) => {
            setServerError("");

            try {
                const payload = {
                    ...values,
                    role,
                };

                const { ok, body } = isLogin
                    ? await login(payload)
                    : await signup(payload);

                if (!ok) {
                    setServerError(
                        body?.message ||
                        "Something went wrong. Please try again."
                    );

                    setSubmitting(false);
                    return;
                }

                localStorage.setItem(
                    "token",
                    body.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(body.user)
                );

                setSubmitting(false);
                onAuthSuccess(body.user);
            } catch (error) {
                console.error(error);

                setServerError(
                    "Unable to connect to the server. Please try again."
                );

                setSubmitting(false);
            }
        },
    });

    const toggleMode = () => {
        setServerError("");
        setShowPassword(false);
        formik.resetForm();

        setMode(
            isLogin
                ? "signup"
                : "login"
        );
    };

    const fieldClass = (hasError) =>
        `flex h-[50px] w-full items-center rounded-lg border px-4 transition-all duration-200 ${hasError
            ? "border-red-400 bg-red-50"
            : "border-slate-200 bg-white hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10"
        }`;

    const inputClass =
        "w-full bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400 [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a]";

    return (
        <div className="min-h-screen w-full bg-white lg:h-screen lg:overflow-hidden">

            <main className="grid min-h-screen w-full grid-cols-1 lg:h-full lg:min-h-0 lg:grid-cols-2">

                {/* Left Branding Panel */}
                <section className="relative flex min-h-[300px] flex-col overflow-hidden bg-[#0f172e] px-7 py-6 text-white sm:px-12 lg:h-full lg:min-h-0 lg:px-12 lg:py-7 xl:px-16">

                    {/* Background Decoration */}
                    <div className="pointer-events-none absolute -left-36 top-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

                    <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

                    {/* Back Button */}
                    <div className="relative z-10 flex shrink-0 items-center">
                        <button
                            type="button"
                            onClick={() => onBack?.()}
                            aria-label="Go back"
                            className="group inline-flex items-center gap-3 rounded-md py-2 text-[15px] font-medium text-white/90 transition-colors hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        >
                            <ArrowLeft
                                size={19}
                                className="transition-transform duration-200 group-hover:-translate-x-1"
                            />

                            Back
                        </button>
                    </div>

                    {/* Branding Content */}
                    <div className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center py-8 text-center">

                        {/* Logo */}
                        <div className="mb-5 flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-lg shadow-black/10">

                            <UserRound
                                size={32}
                                strokeWidth={1.7}
                                className="text-blue-400"
                            />

                        </div>

                        {/* Brand Name */}
                        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            Senior<span className="text-blue-400">Pro</span>
                        </h2>

                        <div className="mt-4 h-1 w-12 rounded-full bg-blue-500" />

                        {/* Description */}
                        <p className="mt-7 max-w-lg text-center text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                            {role === "jobseeker"
                                ? "Connect with opportunities, showcase your experience, and take the next step in your professional journey."
                                : "Discover exceptional talent, connect with professionals, and find the right people for your organization."}
                        </p>

                        {/* Role Badge */}
                        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />

                            {roleName} account
                        </div>

                    </div>

                    {/* Copyright */}
                    <footer className="relative z-10 shrink-0 pb-1 pt-3 text-center text-sm text-slate-400">
                        © 2026 SeniorPro. All rights reserved.
                    </footer>

                </section>

                {/* Right Login Panel */}
                <section className="flex min-h-[600px] items-center justify-center bg-white px-6 py-8 sm:px-10 lg:h-full lg:min-h-0 lg:overflow-hidden lg:px-10 lg:py-5 xl:px-16">

                    <div className="w-full max-w-[440px]">

                        {/* Form Heading */}
                        <div className="mb-6 text-center">

                            <h1 className="text-[28px] font-bold leading-tight tracking-[-0.04em] text-[#0f172e] sm:text-[30px]">
                                {isLogin
                                    ? "Sign in to your account"
                                    : "Create your account"}
                            </h1>

                            <p className="mt-2 text-[15px] leading-6 text-slate-500">
                                {isLogin
                                    ? "Enter your credentials to access SeniorPro."
                                    : "Get started and connect with new opportunities."}
                            </p>

                        </div>

                        {/* Authentication Form */}
                        <form
                            onSubmit={formik.handleSubmit}
                            className="space-y-4"
                            noValidate
                        >

                            {/* Full Name */}
                            {!isLogin && (
                                <div>

                                    <label
                                        htmlFor="name"
                                        className="mb-1.5 block text-left text-[15px] font-medium text-[#0f172e]"
                                    >
                                        Full name
                                    </label>

                                    <div
                                        className={fieldClass(
                                            formik.touched.name &&
                                            formik.errors.name
                                        )}
                                    >

                                        <UserRound
                                            size={19}
                                            className="shrink-0 text-slate-400"
                                        />

                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            placeholder="Enter your full name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            autoComplete="name"
                                            className={inputClass}
                                        />

                                    </div>

                                    {formik.touched.name &&
                                        formik.errors.name && (
                                            <p className="mt-1 text-left text-xs font-medium text-red-500">
                                                {formik.errors.name}
                                            </p>
                                        )}

                                </div>
                            )}

                            {/* Email */}
                            <div>

                                <label
                                    htmlFor="email"
                                    className="mb-1.5 block text-left text-[15px] font-medium text-[#0f172e]"
                                >
                                    Email
                                </label>

                                <div
                                    className={fieldClass(
                                        formik.touched.email &&
                                        formik.errors.email
                                    )}
                                >

                                    <Mail
                                        size={19}
                                        className="shrink-0 text-slate-400"
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        autoComplete="email"
                                        className={inputClass}
                                    />

                                </div>

                                {formik.touched.email &&
                                    formik.errors.email && (
                                        <p className="mt-1 text-left text-xs font-medium text-red-500">
                                            {formik.errors.email}
                                        </p>
                                    )}

                            </div>

                            {/* Password */}
                            <div>

                                <div className="mb-1.5 flex items-center justify-between gap-3">

                                    <label
                                        htmlFor="password"
                                        className="block text-left text-[15px] font-medium text-[#0f172e]"
                                    >
                                        Password
                                    </label>

                                    {isLogin && (
                                        <button
                                            type="button"
                                            onClick={onForgotPassword}
                                            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline"
                                        >
                                            Forgot password?
                                        </button>
                                    )}

                                </div>

                                <div
                                    className={fieldClass(
                                        formik.touched.password &&
                                        formik.errors.password
                                    )}
                                >

                                    <Lock
                                        size={19}
                                        className="shrink-0 text-slate-400"
                                    />

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        autoComplete={
                                            isLogin
                                                ? "current-password"
                                                : "new-password"
                                        }
                                        className={inputClass}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="flex shrink-0 items-center justify-center text-slate-400 transition-colors hover:text-slate-700"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>

                                </div>

                                {formik.touched.password &&
                                    formik.errors.password && (
                                        <p className="mt-1 text-left text-xs font-medium text-red-500">
                                            {formik.errors.password}
                                        </p>
                                    )}

                            </div>

                            {/* Server Error */}
                            {serverError && (
                                <div
                                    role="alert"
                                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-left text-sm font-medium text-red-600"
                                >
                                    {serverError}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="group mt-1 flex h-[50px] w-full items-center justify-center rounded-lg bg-[#0f172e] text-[15px] font-semibold text-white transition-all duration-200 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/15 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {formik.isSubmitting
                                    ? "Please wait..."
                                    : isLogin
                                        ? "Sign in"
                                        : "Create account"}

                                {!formik.isSubmitting && (
                                    <ArrowRight
                                        size={18}
                                        className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                )}
                            </button>

                        </form>

                        {/* Login / Signup Toggle */}
                        <div className="mt-5 text-center text-[14px] text-slate-500">

                            {isLogin
                                ? "Don't have an account?"
                                : "Already have an account?"}

                            <button
                                type="button"
                                onClick={toggleMode}
                                className="ml-1 font-medium text-blue-600 underline decoration-transparent underline-offset-4 transition-all hover:decoration-blue-600"
                            >
                                {isLogin
                                    ? "Sign up"
                                    : "Sign in"}
                            </button>

                        </div>

                        {/* Divider */}
                        <div className="my-4 flex items-center gap-4">

                            <div className="h-px flex-1 bg-slate-200" />

                            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                or
                            </span>

                            <div className="h-px flex-1 bg-slate-200" />

                        </div>

                        {/* Google Authentication */}
                        <GoogleAuthButton
                            role={role}
                            onAuthSuccess={onAuthSuccess}
                        />

                        {/* Terms and Privacy */}
                        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
                            By continuing, you agree to SeniorPro's{" "}

                            <span className="cursor-pointer text-slate-600 hover:underline">
                                Terms
                            </span>

                            {" "}and{" "}

                            <span className="cursor-pointer text-slate-600 hover:underline">
                                Privacy Policy
                            </span>.
                        </p>

                    </div>

                </section>

            </main>

        </div>
    );
}