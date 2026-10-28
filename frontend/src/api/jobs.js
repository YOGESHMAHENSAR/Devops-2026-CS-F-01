const JOBS_API = `${import.meta.env.VITE_API_URL}/jobs`;

async function request(path, method = "GET") {
    const token = localStorage.getItem("token");
    if (!token) {
        return {
            ok: false,
            body: { success: false, message: "Please log in to access job postings." }
        };
    }

    const response = await fetch(`${JOBS_API}${path}`, {
        method,
        headers: { Authorization: `Bearer ${token}` }
    });
    const body = await response.json();
    return { ok: response.ok, body };
}

export function searchJobs(filters) {
    const query = new URLSearchParams(
        Object.entries(filters).filter(([, value]) => Boolean(value))
    );
    return request(`/?${query.toString()}`);
}

export function applyToJob(jobId) {
    return request(`/${encodeURIComponent(jobId)}/applications`, "POST");
}

export function getMyApplications() {
    return request("/applications/mine");
}
