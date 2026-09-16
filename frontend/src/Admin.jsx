import { Link, Routes, Route } from "react-router-dom";
import { IconBriefcase } from "@tabler/icons-react";
import { Bell } from "lucide-react";

function Header() {
  return (
    <div className="flex items-center justify-between px-10 py-4 border-b">
      <div className="flex items-center space-x-2">
        <IconBriefcase size={24} color="blue" />
        <p className="text-xl text-black font-bold">SeniorPro</p>
        <span className="text-gray-500 ml-3">admin</span>
      </div>

      <nav className="space-x-8">
        <Link to="/admin/dashbpard">Dashboard</Link>
        <Link to="/admin/verification">Verification queue</Link>
        <Link to="/admin/opportunities">Opportunities</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/reports">Reports</Link>
      </nav>

      <div className="flex items-center gap-5">
        <div className="relative">
          <Bell size={22} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
        </div>

        <div className="w-10 h-10 rounded-full bg-blue-950 text-white flex items-center justify-center font-semibold">
          AD
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="w-64 min-h-screen border-r p-5">
      <div className="space-y-2">
        <Link
          to="/admin/dashboard"
          className="block px-5 py-3 rounded-lg bg-blue-950 text-white"
        >
          Dashboard
        </Link>

        <Link
          to="/admin/verification"
          className="block px-5 py-3 rounded-lg text-gray-600"
        >
          Verification queue
        </Link>

        <Link
          to="/admin/opportunities"
          className="block px-5 py-3 rounded-lg text-gray-600"
        >
          Opportunities
        </Link>

        <Link
          to="/admin/users"
          className="block px-5 py-3 rounded-lg text-gray-600"
        >
          Users
        </Link>

        <Link
          to="/admin/reports"
          className="block px-5 py-3 rounded-lg text-gray-600"
        >
          Reports & complaints
        </Link>

        <Link
          to="/admin/analytics"
          className="block px-5 py-3 rounded-lg text-gray-600"
        >
          Analytics
        </Link>
      </div>

      <div className="mt-8">
        <p className="text-xs tracking-widest text-gray-400 px-5 mb-2">
          SYSTEM
        </p>

        <Link
          to="/admin/settings"
          className="block px-5 py-3 text-gray-600"
        >
          Settings
        </Link>
      </div>
    </div>
  );
}

function Dashboard() {
  const stats = [
    {
      title: "Total users",
      value: "12,438",
      message: "+184 today",
      color: "text-green-500",
    },
    {
      title: "Pending verification",
      value: "22",
      message: "Needs attention",
      color: "text-orange-500",
    },
    {
      title: "Active opportunities",
      value: "328",
      message: "+24 this week",
      color: "text-green-500",
    },
    {
      title: "Reports",
      value: "15",
      message: "Requires review",
      color: "text-red-500",
    },
  ];

  const activities = [
    {
      text: "New professional registration",
      time: "10 min ago",
    },
    {
      text: "Company verification submitted",
      time: "32 min ago",
    },
    {
      text: "New opportunity posted",
      time: "1 hr ago",
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-blue-950">
        Admin Dashboard
      </h1>

      <p className="text-gray-500 text-lg mt-2">
        Welcome back, Admin.
      </p>

      <div className="grid grid-cols-4 gap-5 mt-10">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="border border-gray-200 rounded-xl p-6"
          >
            <p className="text-gray-500">
              {stat.title}
            </p>

            <h2 className="text-4xl font-bold mt-2 text-blue-950">
              {stat.value}
            </h2>

            <p className={`mt-2 ${stat.color}`}>
              {stat.message}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-blue-950">
            Recent activity
          </h2>

          <div className="mt-5">
            {activities.map((activity, index) => (
              <div
                key={activity.text}
                className={`flex justify-between py-4 ${
                  index !== activities.length - 1
                    ? "border-b"
                    : ""
                }`}
              >
                <p className="text-gray-600">
                  {activity.text}
                </p>

                <span className="text-gray-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-blue-950">
            Quick actions
          </h2>

          <div className="flex flex-col gap-3 mt-5">
            <Link
              to="/admin/verification"
              className="border border-gray-300 rounded-lg px-5 py-3 text-blue-950 hover:bg-gray-50"
            >
              Review verification requests
            </Link>

            <Link
              to="/admin/opportunities"
              className="border border-gray-300 rounded-lg px-5 py-3 text-blue-950 hover:bg-gray-50"
            >
              Manage opportunities
            </Link>

            <Link
              to="/admin/reports"
              className="border border-gray-300 rounded-lg px-5 py-3 text-blue-950 hover:bg-gray-50"
            >
              Check reports & complaints
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Verification() {
  const users = [
    {
      initials: "RK",
      name: "Rajesh Kumar",
      info: "28 yrs experience · Operations & strategy",
      documents: ["ID proof", "Resume", "Certificates"],
      status: "Pending",
      button1: "Review",
      button2: "Approve",
    },
    {
      initials: "NF",
      name: "Northbridge Financial",
      type: "Company",
      info: "Fintech · Registered 2 days ago",
      documents: ["Registration cert.", "GST document"],
      status: "Pending",
      button1: "Review",
      button2: "Approve",
    },
    {
      initials: "AS",
      name: "Anita Sharma",
      info: "22 yrs experience · Corporate finance",
      documents: ["ID proof", "Certificate missing"],
      status: "Incomplete",
      button1: "Message",
      button2: "Reject",
    },
  ];

  return (
    <div className="mt-10 space-y-4">
      {users.map((user) => (
        <div
          key={user.name}
          className="flex items-center justify-between border border-gray-200 rounded-2xl px-8 py-6"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold text-blue-950">
              {user.initials}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-blue-950">
                  {user.name}
                </h3>

                {user.type && (
                  <span className="bg-slate-100 px-4 py-1 rounded-full text-sm font-semibold text-blue-950">
                    {user.type}
                  </span>
                )}
              </div>

              <p className="text-gray-500 text-lg">
                {user.info}
              </p>

              <div className="flex gap-3 mt-2">
                {user.documents.map((document) => (
                  <span
                    key={document}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      document === "Certificate missing"
                        ? "bg-red-50 text-red-500"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {document}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-5 py-2 rounded-full font-medium ${
                user.status === "Incomplete"
                  ? "bg-red-50 text-red-600"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              {user.status}
            </span>

            <button className="border border-gray-300 px-5 py-2.5 rounded-lg font-semibold text-blue-950">
              {user.button1}
            </button>

            <button
              className={`px-5 py-2.5 rounded-lg font-semibold ${
                user.button2 === "Approve"
                  ? "bg-blue-950 text-white"
                  : "border border-gray-300 text-blue-950"
              }`}
            >
              {user.button2}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Opportunities() {
  return <h1>Opportunities</h1>;
}

function Users() {
  return <h1>Users</h1>;
}

function Reports() {
  return <h1>Reports & complaints</h1>;
}

function Admin() {
  return (
    <div className="min-h-screen text-blue-950">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-10">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="verification" element={<Verification />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="users" element={<Users />} />
            <Route path="reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Admin;