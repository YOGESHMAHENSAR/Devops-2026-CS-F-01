const form = document.querySelector('#registration-form');
const message = document.querySelector('#message');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button');
    button.disabled = true;
    button.textContent = 'Creating account...';
    message.textContent = '';
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        window.location.assign('/login?registered=1');
    } catch (error) {
        message.textContent = error.message || 'Registration failed. Please try again.';
    } finally {
        button.disabled = false;
        button.textContent = 'Create account';
    }
});
