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

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100">

            <main className="relative min-h-screen w-full px-6 py-4">

                {/* Background Decoration */}
                <div className="pointer-events-none absolute left-0 top-32 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

                <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />

                <div className="relative mx-auto w-full max-w-3xl">

                    <button
                        type="button"
                        onClick={onBack}
                        className="group mb-4 flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                    >
                        <ArrowLeft
                            size={17}
                            className="transition-transform duration-200 group-hover:-translate-x-1"
                        />

                        Change role
                    </button>

                    <div className="rounded-3xl border border-slate-200/70 bg-white p-7 shadow-[0_20px_60px_rgba(37,99,235,0.12)] sm:p-9">

                        <div className="mb-7 text-center">

                            <div className="mb-4 flex items-center justify-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-600" />

                                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                                    {roleName}
                                </span>
                            </div>

                            <h1 className="text-[42px] font-bold leading-tight tracking-[-0.03em] text-slate-950">
                                {isLogin
                                    ? "Welcome back."
                                    : "Create your account."}
                            </h1>

                            <p className="mt-2 text-[15px] leading-6 text-slate-500">
                                {isLogin
                                    ? "Sign in to continue to your SeniorPro account."
                                    : "Create your account and start connecting with opportunities."}
                            </p>

                        </div>

                        <form
                            onSubmit={formik.handleSubmit}
                            className="mx-auto max-w-2xl space-y-5"
                        >

                            {!isLogin && (
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-left text-sm font-semibold text-slate-700"
                                    >
                                        Full name
                                    </label>

                                    <div
                                        className={`flex h-[52px] w-full items-center rounded-xl border px-4 transition-all duration-200 ${
                                            formik.touched.name &&
                                            formik.errors.name
                                                ? "border-red-400 bg-red-50"
                                                : "border-slate-200 bg-slate-50 hover:border-slate-300 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10"
                                        }`}
                                    >
                                        <UserRound
                                            size={18}
                                            className="mr-3 shrink-0 text-slate-400"
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
                                            className="
                                                w-full
                                                bg-transparent
                                                text-[15px]
                                                text-slate-900
                                                outline-none
                                                placeholder:text-slate-400
                                                [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#f8fafc_inset]
                                                [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a]
                                            "
                                        />
                                    </div>

                                    {formik.touched.name &&
                                        formik.errors.name && (
                                            <p className="mt-1.5 text-left text-xs font-medium text-red-500">
                                                {formik.errors.name}
                                            </p>
                                        )}
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-left text-sm font-semibold text-slate-700"
                                >
                                    Email address
                                </label>

                                <div
                                    className={`flex h-[52px] w-full items-center rounded-xl border px-4 transition-all duration-200 ${
                                        formik.touched.email &&
                                        formik.errors.email
                                            ? "border-red-400 bg-red-50"
                                            : "border-slate-200 bg-slate-50 hover:border-slate-300 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10"
                                    }`}
                                >
                                    <Mail
                                        size={18}
                                        className="mr-3 shrink-0 text-slate-400"
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        autoComplete="email"
                                        className="
                                            w-full
                                            bg-transparent
                                            text-[15px]
                                            text-slate-900
                                            outline-none
                                            placeholder:text-slate-400
                                            [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#f8fafc_inset]
                                            [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a]
                                        "
                                    />
                                </div>

                                {formik.touched.email &&
                                    formik.errors.email && (
                                        <p className="mt-1.5 text-left text-xs font-medium text-red-500">
                                            {formik.errors.email}
                                        </p>
                                    )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-left text-sm font-semibold text-slate-700"
                                >
                                    Password
                                </label>

                                <div
                                    className={`flex h-[52px] w-full items-center rounded-xl border px-4 transition-all duration-200 ${
                                        formik.touched.password &&
                                        formik.errors.password
                                            ? "border-red-400 bg-red-50"
                                            : "border-slate-200 bg-slate-50 hover:border-slate-300 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10"
                                    }`}
                                >
                                    <Lock
                                        size={18}
                                        className="mr-3 shrink-0 text-slate-400"
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
                                        className="
                                            w-full
                                            bg-transparent
                                            text-[15px]
                                            text-slate-900
                                            outline-none
                                            placeholder:text-slate-400
                                            [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#f8fafc_inset]
                                            [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a]
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="ml-2 flex shrink-0 items-center justify-center text-slate-400 transition-colors hover:text-slate-700"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>

                                {formik.touched.password &&
                                    formik.errors.password && (
                                        <p className="mt-1.5 text-left text-xs font-medium text-red-500">
                                            {formik.errors.password}
                                        </p>
                                    )}
                            </div>

                            {serverError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-600">
                                    {serverError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="group mt-2 flex h-[52px] w-full items-center justify-center rounded-xl bg-slate-950 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/15 disabled:cursor-not-allowed disabled:opacity-60"
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

                        <div className="mt-5 text-center text-sm text-slate-500">
                            {isLogin
                                ? "Don't have an account?"
                                : "Already have an account?"}

                            <button
                                type="button"
                                onClick={toggleMode}
                                className="ml-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                {isLogin
                                    ? "Create one"
                                    : "Sign in"}
                            </button>
                        </div>

                        <div className="my-5 flex items-center gap-4">
                            <div className="h-px flex-1 bg-slate-200" />

                            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                                or
                            </span>

                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <GoogleAuthButton
                            role={role}
                            onAuthSuccess={onAuthSuccess}
                        />

                        <p className="mt-7 text-center text-xs leading-5 text-slate-400">
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
                </div>
            </main>
        </div>
    );
}