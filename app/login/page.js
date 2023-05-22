'use client';

export default async function Login() {
    const inputStyle = 'w-full rounded-lg text-black font-medium border border-gray p-4 pe-12 text-sm shadow-sm';
    return (
        <div className="mx-auto my-auto px-4 py-16 sm:px-6 lg:px-8 animate-fade-in-up">
            <div className="mx-auto max-w-lg text-center">
                <h1 className="text-2xl font-black sm:text-3xl">Login</h1>
                <p className="mt-4 text-white">Login with your account to get started with To-Do-It.</p>
            </div>

            <div className="mx-auto mb-0 mt-8 max-w-md space-y-4">
                <div className="relative">
                    <input type="email" className={inputStyle} placeholder="Enter your email address" />
                </div>

                <div className="relative">
                    <input type="password" className={inputStyle} placeholder="Enter your password" />
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        No account?{' '}
                        <a className="ml-1 font-bold text-[#6084f7]" href="/register">
                            Register
                        </a>
                    </p>

                    <button
                        className={`group relative inline-block text-base font-semibold focus:outline-none focus:ring transition-all text-black`}
                    >
                        <span className="absolute inset-0 border border-[#6084f7] rounded-md"></span>
                        <span
                            className={`block border border-[#6084f7] bg-[#6084f7] rounded-md px-8 py-2 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1`}
                        >
                            Login
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}