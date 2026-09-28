const form = document.querySelector('#login-form');
const message = document.querySelector('#message');
document.querySelector('#registration-notice').hidden = !new URLSearchParams(window.location.search).has('registered');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button');
    button.disabled = true;
    button.textContent = 'Logging in…';
    message.textContent = '';
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        window.location.assign('/welcome');
    } catch (error) {
        message.textContent = error.message || 'Login failed. Please try again.';
    } finally {
        button.disabled = false;
        button.textContent = 'Log in';
    }
});
