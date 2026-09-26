import React from "react";
import { UserRound, BriefcaseBusiness, ArrowRight } from "lucide-react";

const ROLES = [
    {
        key: "jobseeker",
        title: "Working Professional",
        description:
            "Looking for consultancy, mentorship, advisory or part-time work",
        icon: UserRound,
    },
    {
        key: "recruiter",
        title: "Recruiter",
        description:
            "Looking to hire experienced working professionals.",
        icon: BriefcaseBusiness,
    },
];

export default function RoleSelect({ onSelect }) {
    return (
        <div className="fixed inset-0 z-50 h-screen w-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">

            <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-6">

                <div className="text-center">

                    <span className="inline-block rounded-full border border-blue-200 bg-white px-4 py-1.5 text-xs font-medium text-blue-600 shadow-sm">
                        Welcome to SeniorPro
                    </span>

                    <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                        Connect.
                        <span className="text-blue-600"> Contribute.</span>
                        <br />
                        Grow.
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                        A platform connecting experienced professionals with
                        organisations looking for expertise, knowledge and
                        experience.
                    </p>

                    <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-blue-600">
                        Tell us who you are
                    </p>
                </div>

                <div className="mx-auto mt-6 grid w-full max-w-5xl gap-5 md:grid-cols-2">

                    {ROLES.map((role) => {
                        const Icon = role.icon;

                        return (
                            <button
                                key={role.key}
                                type="button"
                                onClick={() => onSelect(role.key)}
                                className="group text-left"
                            >
                                <div className="relative h-[230px] overflow-hidden rounded-3xl border border-white bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">

                                    <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-50 transition duration-500 group-hover:scale-125" />

                                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 transition group-hover:bg-blue-700">
                                        <Icon size={27} strokeWidth={1.8} />
                                    </div>

                                    <h2 className="relative mt-4 text-xl font-bold text-slate-900">
                                        {role.title}
                                    </h2>

                                    <p className="relative mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                                        {role.description}
                                    </p>

                                    <div className="absolute bottom-5 left-6 flex items-center font-semibold text-blue-600">
                                        Continue
                                        <ArrowRight
                                            size={18}
                                            className="ml-2 transition group-hover:translate-x-1"
                                        />
                                    </div>

                                </div>
                            </button>
                        );
                    })}

                </div>

                <p className="mt-4 text-center text-xs text-slate-500">
                    Built around experience, expertise and meaningful
                    opportunities.
                </p>

            </div>
        </div>
    );
}