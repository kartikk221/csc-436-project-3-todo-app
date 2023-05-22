'use client';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex animate-fade-in-up flex-grow items-center justify-center text-center lg:mb-0 lg:text-left">
            <Link
                href="/list/create"
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            >
                <h2 className={`mb-3 text-2xl font-semibold`}>
                    No Lists Yet{' '}
                    <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                        -&gt;
                    </span>
                </h2>
                <p className={`m-0 max-w-[60ch] text-sm opacity-50`}>
                    No lists have been created yet. Be the first to create a list and share it with others!
                </p>
            </Link>
        </div>
    );
}
