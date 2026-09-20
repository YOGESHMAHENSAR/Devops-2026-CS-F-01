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
            "Looking to hire experienced working professionals for your organisation",
        icon: BriefcaseBusiness,
    },
];

export default function RoleSelect({ onSelect }) {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100">

            <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">

                <div className="text-center">

                    <span className="inline-block rounded-full border border-blue-200 bg-white px-5 py-2 text-sm font-medium text-blue-600 shadow-sm">
                        Welcome to SeniorPro
                    </span>

                    <h1 className="mt-7 text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
                        Connect.
                        <span className="text-blue-600"> Contribute.</span>
                        <br />
                        Grow.
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                        A platform connecting experienced professionals with
                        organisations looking for expertise, knowledge and
                        experience.
                    </p>

                    <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-blue-600">
                        Tell us who you are
                    </p>
                </div>

                <div className="mx-auto mt-10 grid w-full max-w-5xl gap-6 md:grid-cols-2">

                    {ROLES.map((role) => {
                        const Icon = role.icon;

                        return (
                            <button
                                key={role.key}
                                type="button"
                                onClick={() => onSelect(role.key)}
                                className="group text-left"
                            >
                                <div className="relative h-full overflow-hidden rounded-3xl border border-white bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl">

                                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-50 transition duration-500 group-hover:scale-125" />

                                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 transition group-hover:bg-blue-700">
                                        <Icon size={30} strokeWidth={1.8} />
                                    </div>

                                    <h2 className="relative mt-6 text-2xl font-bold text-slate-900">
                                        {role.title}
                                    </h2>

                                    <p className="relative mt-3 min-h-[56px] text-base leading-7 text-slate-500">
                                        {role.description}
                                    </p>

                                    <div className="relative mt-6 flex items-center font-semibold text-blue-600">
                                        Continue
                                        <ArrowRight
                                            size={19}
                                            className="ml-2 transition group-hover:ml-4"
                                        />
                                    </div>

                                </div>
                            </button>
                        );
                    })}

                </div>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Built around experience, expertise and meaningful
                    opportunities.
                </p>

            </div>
        </div>
    );
}