'use client';
import Link from 'next/link';
import Loader from '../Loader';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserProfile from '../../hooks/userUserProfile';
import { supabase_register_user } from '../../utils/authentication';

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const { user, loading } = useUserProfile();
    const [password, setPassword] = useState('');
    const [inFlight, setInFlight] = useState(false);

    const onSubmit = async () => {
        // Ensure a valid name is entered
        if (name.length < 3) return alert('Please enter a valid name');

        // Ensure a valid email is entered
        const [email_name = '', email_domain = ''] = email.split('@');
        const email_domain_parts = email_domain.split('.');
        if (email_name.length < 3 || email_domain_parts.length < 2) return alert('Please enter a valid email address');

        // Ensure a valid password is entered
        if (password.length < 8) return alert('Please enter a valid and strong password');

        // Register a supabase user account
        setInFlight(true);
        const { success, error } = await supabase_register_user(name, email, password);
        setInFlight(false);
        if (success) {
            // Redirect to the login page
            router.push('/');
        } else {
            alert(error);
        }
    };

    // Use loading state to show a loader while the user profile is loading
    if (loading) return <Loader />;

    // Redirect to home page if the user is already logged in
    if (user) {
        router.push('/');
        return null;
    }

    const inputStyle = 'w-full rounded-lg text-black font-medium border border-gray p-4 pe-12 text-sm shadow-sm';
    return (
        <div className="mx-auto my-auto px-4 py-16 sm:px-6 lg:px-8 animate-fade-in-up">
            <div className="mx-auto max-w-lg text-center">
                <h1 className="text-2xl font-black sm:text-3xl">Register</h1>
                <p className="mt-4 text-white">Register with a new account to get started with To-Do-It.</p>
            </div>

            <div className="mx-auto mb-0 mt-8 max-w-md space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        value={name}
                        className={inputStyle}
                        placeholder="Enter your name"
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>

                <div className="relative">
                    <input
                        type="email"
                        value={email}
                        className={inputStyle}
                        placeholder="Enter your email address"
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div className="relative">
                    <input
                        type="password"
                        value={password}
                        className={inputStyle}
                        placeholder="Enter your password"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link className="ml-1 font-bold text-[#6084f7]" href="/login" prefetch={true}>
                            Login
                        </Link>
                    </p>

                    <button
                        className={`group relative inline-block text-base font-semibold focus:outline-none focus:ring transition-all text-black`}
                        onClick={onSubmit}
                        style={{
                            opacity: inFlight ? 0.5 : 1,
                        }}
                    >
                        <span className="absolute inset-0 border border-[#6084f7] rounded-md"></span>
                        <span
                            className={`block border border-[#6084f7] bg-[#6084f7] rounded-md px-8 py-2 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1`}
                        >
                            {inFlight ? 'Processing' : 'Register'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
