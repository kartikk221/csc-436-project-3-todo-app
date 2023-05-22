'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase_register_user } from '@/utils/authentication';

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
        const { success, error } = await supabase_register_user(name, email, password);
        if (success) {
            // Alert the user
            alert(`Welcome to To-Do-It, ${name}!\n\nYour account has been created successfully.`);

            // Redirect to the login page
            router.push('/login');
        } else {
            alert(error);
        }
    };

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
                        <a className="ml-1 font-bold text-[#6084f7]" href="/login">
                            Login
                        </a>
                    </p>

                    <button
                        className={`group relative inline-block text-base font-semibold focus:outline-none focus:ring transition-all text-black`}
                        onClick={onSubmit}
                    >
                        <span className="absolute inset-0 border border-[#6084f7] rounded-md"></span>
                        <span
                            className={`block border border-[#6084f7] bg-[#6084f7] rounded-md px-8 py-2 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1`}
                        >
                            Register
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
