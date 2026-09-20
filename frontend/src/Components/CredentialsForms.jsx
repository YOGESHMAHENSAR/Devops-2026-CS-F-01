import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowLeft, ArrowRight, Mail, Lock, UserRound} from "lucide-react";
import GoogleAuthButton from "./GoogleAuthButton.jsx";
import { login, signup } from "../api/auth.js";

const loginSchema = Yup.object({
    email: Yup.string()
        .email("Enter valid Email")
        .required("Email is required field"),
    password: Yup.string().required("Password is required!"),
});

const signUpSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
        .email("Enter valid Email")
        .required("Email is required field"),
    password: Yup.string()
        .min(6, "Password must be of 6 character long!")
        .required("Password is required!"),
});

export default function CredentialsForms({
    role,
    onBack,
    onAuthSuccess,
}) {
    const [mode, setMode] = useState("login");
    const [serverError, SetServerError] = useState("");

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },
        validationSchema:
            mode === "login" ? loginSchema : signUpSchema,
        enableReinitialize: true,

        onSubmit: async (value, { setSubmitting }) => {
            SetServerError("");

            const payload = { ...value, role };

            const { ok, body } =
                mode === "login"
                    ? await login(payload)
                    : await signup(payload);

            setSubmitting(false);

            if (!ok) {
                SetServerError(
                    body.message ||
                    "Something went wrong, Please try again Later!"
                );
                return;
            }

            localStorage.setItem("token", body.token);
            localStorage.setItem(
                "user",
                JSON.stringify(body.user)
            );

            onAuthSuccess(body.user);
        },
    });

    const isLogin = mode === "login";
    const roleName =
        role === "jobseeker" ? "professional" : "recruiter";

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6 py-12">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center">

                <div className="w-full max-w-2xl">

                    <button
                        type="button"
                        onClick={onBack}
                        className="mb-6 flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                    >
                        <ArrowLeft size={18} />
                        Change role
                    </button>

                    <div className="rounded-3xl border border-white bg-white/80 p-8 shadow-xl backdrop-blur-md md:p-10">

                        <div className="mb-8">
                            <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
                                {isLogin
                                    ? "Welcome back"
                                    : "Join SeniorPro"}
                            </span>

                            <h1 className="mt-5 text-4xl font-bold text-slate-900">
                                {isLogin
                                    ? "Log in"
                                    : "Create account"}
                            </h1>

                            <p className="mt-2 text-base text-slate-500">
                                as {roleName}
                            </p>
                        </div>

                        <form
                            onSubmit={formik.handleSubmit}
                            noValidate
                            className="space-y-5"
                        >
                            {!isLogin && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Full name
                                    </label>

                                    <div className="relative">
                                        <UserRound
                                            size={19}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            name="name"
                                            type="text"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter your full name"
                                            className={`w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${formik.touched.name &&
                                                    formik.errors.name
                                                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                                                }`}
                                        />

                                    </div>

                                    {formik.touched.name &&
                                        formik.errors.name && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {formik.errors.name}
                                            </p>
                                        )}
                                </div>
                            )}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Email
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        name="email"
                                        type="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter your email"
                                        className={`w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${formik.touched.email &&
                                                formik.errors.email
                                                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                                : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                                            }`}
                                    />
                                </div>

                                {formik.touched.email &&
                                    formik.errors.email && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {formik.errors.email}
                                        </p>
                                    )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Password
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        name="password"
                                        type="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter your password"
                                        className={`w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${formik.touched.password &&
                                                formik.errors.password
                                                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                                : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                                            }`}
                                    />
                                </div>

                                {formik.touched.password &&
                                    formik.errors.password && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {formik.errors.password}
                                        </p>
                                    )}
                            </div>

                            {serverError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {serverError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {formik.isSubmitting
                                    ? "Please wait..."
                                    : isLogin
                                        ? "Log in"
                                        : "Sign up"}

                                {!formik.isSubmitting && (
                                    <ArrowRight size={19} />
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <span className="text-sm text-slate-500">
                                {isLogin
                                    ? "Don't have an account? "
                                    : "Already have an account? "}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setMode(
                                        isLogin
                                            ? "signup"
                                            : "login"
                                    )
                                }
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                {isLogin ? "Sign up" : "Log in"}
                            </button>
                        </div>

                        <div className="my-7 flex items-center gap-4">
                            <div className="h-px flex-1 bg-slate-200" />

                            <span className="text-sm font-medium text-slate-400">
                                or
                            </span>

                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <GoogleAuthButton
                            role={role}
                            onAuthSuccess={onAuthSuccess}
                            onError={SetServerError}
                        />
                    </div>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Secure access to your SeniorPro account
                    </p>

                </div>
            </div>
        </div>
    );
}