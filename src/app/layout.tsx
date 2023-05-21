import NavigationBar from './NavigationBar';
import './globals.css';
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

                {/* Content Main Wrapper */}
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                    {/* Navigation Bar */}
                    <NavigationBar />

                    {/* Application Components */}
                    {children}
                </main>
            </body>
        </html>
    );
}
