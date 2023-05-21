'use client';
import Link from 'next/link';
import { useState } from 'react';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Define the navigation bar routes for center display
const navigation_center_routes = [
    {
        id: 'explore',
        name: 'Explore',
        path: '/',
    },
    {
        id: 'create',
        name: 'Create',
        path: '/list/create',
    },
    {
        id: 'manage',
        name: 'Manage',
        path: '/user/someone/list',
    },
] as const;

// Define the navigation bar routes for right display
const navigation_right_routes = [
    {
        id: 'login',
        name: 'Login',
        path: '/login',
    },
    {
        id: 'register',
        name: 'Register',
        path: '/register',
    },
] as const;

// Define the type for the navigation bar routes
type all_route_ids = (typeof navigation_center_routes)[number]['id'] | (typeof navigation_right_routes)[number]['id'];

export default function NavigationBar() {
    const [activeRoute, setActiveRoute] = useState<all_route_ids>('explore');

    // Get the routes for the center and right display
    const center_routes = navigation_center_routes;
    const right_routes = navigation_right_routes;

    return (
        <div
            className={
                'z-10 w-full max-w-7xl items-center justify-between font-mono text-sm lg:flex ' + inter.className
            }
        >
            {/* Logo Section */}
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
                    <p className="text-md font-medium">Productivity Supercharged!</p>
                </div>
            </div>

            {/* Nav Bar */}
            <div className="flex">
                {center_routes.map(({ id, name, path }) => (
                    <Link key={id} href={path}>
                        <h1
                            className={`text-lg mx-5 transition-colors ${
                                activeRoute === id ? 'text-[#ff822d] font-black' : 'font-medium hover:text-[#ff822d]'
                            }`}
                        >
                            {name}
                        </h1>
                    </Link>
                ))}
            </div>
            <div className="flex">
                {right_routes.map(({ id, name, path }, index) => {
                    const first = index === 0;
                    return (
                        <Link
                            href={path}
                            key={id}
                            className={`group relative inline-block text-base font-semibold focus:outline-none focus:ring mx-2 transition-all ${
                                first ? 'text-[#ff822d] hover:text-black' : 'text-black'
                            }`}
                        >
                            <span className="absolute inset-0 border border-[#e67529] rounded-md"></span>
                            <span
                                className={`block border border-[#e67529] ${
                                    first ? '' : 'bg-[#ff822d]'
                                } rounded-md px-8 py-2 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1 ${
                                    first ? 'group-hover:bg-[#ff822d]' : ''
                                }`}
                            >
                                {name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
