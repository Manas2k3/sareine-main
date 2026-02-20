"use client";

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './SignIn.module.css';
import { useRouteTransition } from '@/components/motion/RouteTransitionProvider';

export default function SignIn() {
    const { user, signInWithGoogle, signInWithEmail } = useAuth();
    const { navigate } = useRouteTransition();
    const searchParams = useSearchParams();
    const redirectParam = searchParams.get('redirect');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const errorId = 'signin-error';

    useEffect(() => {
        if (user) {
            if (redirectParam === 'notify') {
                navigate('/?notify=true');
            } else {
                navigate('/');
            }
        }
    }, [user, navigate, redirectParam]);

    const toFriendlyError = (err: unknown) => {
        if (err instanceof Error) return err.message.replace('Firebase: ', '');
        return 'Unable to sign in right now. Please try again.';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmail(email, password);
        } catch (err: unknown) {
            setError(toFriendlyError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.bgPattern} />

            <div className={styles.card}>
                <div className={styles.header}>
                    <span className={styles.authTag}>Member Access</span>
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>Sign in to manage your orders and continue your Sareine experience.</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="signin-email" className={styles.label}>Email Address</label>
                        <input
                            id="signin-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="signin-password" className={styles.label}>Password</label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="signin-password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                className={styles.eyeBtn}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div id={errorId} className={styles.error} role="alert" aria-live="polite">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitBtn}
                        aria-describedby={error ? errorId : undefined}
                    >
                        {loading ? 'Please wait...' : 'Sign In'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>or</span>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    className={styles.googleBtn}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>

                <div className={styles.footer}>
                    New to Sareine?
                    <Link href={redirectParam ? `/signup?redirect=${redirectParam}` : "/signup"} className={styles.link}>Create an account</Link>
                </div>
            </div>
        </div>
    );
}
