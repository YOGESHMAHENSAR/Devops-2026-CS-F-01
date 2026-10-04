const message = document.querySelector('#message');
async function loadProfile() {
    try {
        const response = await fetch('/api/me');
        if (response.status === 401) return window.location.replace('/login');
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        const { student } = result;
        document.querySelector('#welcome-heading').textContent = `Welcome, ${student.username}!`;
        for (const field of ['email', 'phone', 'branch']) document.querySelector(`#student-${field}`).textContent = student[field];
        document.querySelector('#profile').hidden = false;
        message.textContent = '';
    } catch (error) {
        message.textContent = error.message || 'Unable to load your profile. Please refresh.';
    }
}

document.querySelector('#logout').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    try {
        const response = await fetch('/api/logout', { method: 'POST' });
        if (!response.ok) throw new Error('Unable to log out. Please try again.');
        window.location.replace('/login');
    } catch (error) {
        message.textContent = error.message;
        button.disabled = false;
    }
});
loadProfile();
