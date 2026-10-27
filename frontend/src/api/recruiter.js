const RECRUITER_API = `${import.meta.env.VITE_API_URL}/recruiter`;

async function request(path, method, payload) {
    const token = localStorage.getItem("token");
    if (!token) {
        return {
            ok: false,
            body: { success: false, message: "Please log in to manage your recruiter profile." }
        };
    }

    const response = await fetch(`${RECRUITER_API}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(payload ? { "Content-Type": "application/json" } : {})
        },
        ...(payload ? { body: JSON.stringify(payload) } : {})
    });

    const body = await response.json();
    return { ok: response.ok, body };
}

export function getRecruiterProfile() {
    return request("/profile", "GET");
}

export function saveRecruiterProfile(payload) {
    return request("/profile", "POST", payload);
}

export function getRecruiterJobs() {
    return request("/jobs", "GET");
}

export function createJobPosting(payload) {
    return request("/jobs", "POST", payload);
}

export function getJobApplicants(jobId) {
    return request(`/jobs/${encodeURIComponent(jobId)}/applications`, "GET");
}
