import './globals.css';
import Image from 'next/image';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Welcome | To-Do-It',
    description: 'Built with Next.js, Tailwind CSS, and TypeScript for CSC 436 Project 3 by Kartik Kumar.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {/* Background gradient top left */}
                <div className="fixed inset-0 gradient-element before:absolute before:inset-0 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:inset-y-[-15%] after:left-[-25%] after:rotate-180 after:w-1/2 after:h-1/2 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#ff822d] after:dark:opacity-40 before:lg:h-[360px]"></div>

                {/* Background gradient bottom right */}
                <div className="fixed inset-0 gradient-element translate-x-20 translate-y-20 before:absolute before:inset-0 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:inset-y-[60%] after:right-0 after:w-1/2 after:h-1/2 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#ff822d] after:dark:opacity-30 before:lg:h-[360px]"></div>

                {/* Nav Bar and Content Main Wrapper */}
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                    <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                        <div className="fixed bottom-0 left-0 flex h-48 w-full flex-row items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                            <div className="flex-row">
                                <h1 className="text-3xl font-black">
                                    To-
                                    <strong
                                        style={{
                                            color: '#ff822d',
                                        }}
                                    >
                                        Do
                                    </strong>
                                    -It
                                </h1>
                                <p className="text-md font-medium">By Kartik Kumar</p>
                            </div>
                            <div>
                                <h1 className="text-5xl">📝</h1>
                            </div>
                        </div>
                        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                            Get started by editing&nbsp;
                            <code className="font-mono font-bold">src/app/page.tsx</code>
                        </p>
                    </div>

                    {/* Application Components */}
                    {children}
                </main>
            </body>
        </html>
    );
}
