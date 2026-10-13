import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch(
                'http://localhost:3000/api/auth/forgot-password',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to send reset link.'
                );
            }

            setMessage(
                data.message ||
                'If your email is registered, a password reset link has been sent.'
            );
            setEmail('');
        } catch (err) {
            setError(
                err.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl sm:p-10">

                <Link
                    to="/"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
                >
                    <ArrowLeft size={18} />
                    Back to login
                </Link>

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Mail size={27} />
                </div>

                <h1 className="mb-2 text-2xl font-bold text-slate-900">
                    Forgot password?
                </h1>

                <p className="mb-8 text-sm leading-6 text-slate-500">
                    No worries! Enter your registered email address
                    and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Email address
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                                required
                                autoComplete="email"
                                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="flex items-start gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700">
                            <CheckCircle
                                size={18}
                                className="mt-0.5 shrink-0"
                            />
                            <p>{message}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Sending...' : 'Send reset link'}
                    </button>

                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Remember your password?{' '}
                    <Link
                        to="/"
                        className="font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
}