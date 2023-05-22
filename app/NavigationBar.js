'use client';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import useUserProfile from '../hooks/userUserProfile';

const inter = Inter({ subsets: ['latin'] });

export const revalidate = 0;

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
        path: '/user/:user/list',
    },
];

// Define the navigation bar routes for right display when not logged in
const navigation_right_routes_not_logged_in = [
    {
        id: 'login',
        name: 'Login',
        path: '/login',
        arrow: true,
    },
    {
        id: 'register',
        name: 'Register',
        path: '/register',
    },
];

const navigation_right_routes_logged_in = [
    {
        id: 'favorites',
        name: 'Favorites',
        path: '/user/:user/list',
    },
    {
        id: 'logout',
        name: 'Logout',
        path: '/logout',
        arrow: true,
    },
];

function inject_route_paths(routes, user) {
    return !user?.id
        ? routes
        : routes.map((route) => ({
              ...route,
              path: route.path.split(':user').join(user.id),
          }));
}

export default function NavigationBar() {
    // Use the user profile and pathname hooks for state
    const { user, loading } = useUserProfile();
    const pathname = usePathname();

    // Get the routes for the center and right display
    const center_routes = inject_route_paths(navigation_center_routes, user);
    const right_routes = inject_route_paths(
        user ? navigation_right_routes_logged_in : navigation_right_routes_not_logged_in,
        user
    );

    return (
        <div
            className={
                'relative flex justify-between w-full max-w-7xl items-center transition-all z-10 font-mono text-sm lg:flex ' +
                inter.className
            }
            style={{
                opacity: loading ? 0 : 1,
            }}
        >
            {/* Left Nav Bar */}
            <Link
                href="/"
                className="fixed bottom-0 left-0 flex-none h-48 w-full flex-col justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none"
            >
                <h1 className="flex text-3xl font-black">
                    To-
                    <strong className="text-[#6084f7]">Do</strong>
                    -It
                </h1>
                <div className="flex-row transition-all">
                    <p className="flex text-md font-medium">{user ? `Welcome Back, ` : 'Productivity Supercharged!'}</p>
                    {user ? <p className="text-[#6084f7] font-bold text-lg">{user?.name}!</p> : undefined}
                </div>
            </Link>

            {/* Middle Nav Bar */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
                <div className="flex">
                    {center_routes.map(({ id, name, path }) => {
                        const active = pathname === path;
                        return (
                            <Link key={id} href={path} prefetch={true}>
                                <h1
                                    className={`text-lg mx-5 transition-colors ${
                                        active ? `text-[#6084f7] font-black` : 'font-medium hover:text-[#6084f7]'
                                    }`}
                                >
                                    {name}
                                </h1>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Right Nav Bar */}
            <div
                className={`flex flex-none transition-all`}
                style={{
                    opacity: loading ? 0 : 1,
                }}
            >
                {right_routes.map(({ id, name, path, arrow }, index) => {
                    const first = index === 0;
                    return (
                        <Link
                            href={path}
                            key={id}
                            prefetch={true}
                            className={`group relative inline-block text-base font-semibold focus:!outline-none focus:ring mx-2 transition-all ${
                                first ? 'text-[#6084f7] hover:text-black' : 'text-black'
                            }`}
                        >
                            <span className="absolute inset-0 border border-[#6084f7] rounded-md"></span>
                            <span
                                className={`flex block border border-[#6084f7] ${
                                    first ? '' : 'bg-[#6084f7]'
                                } rounded-md ${
                                    arrow ? 'pl-8 pr-5' : 'px-8'
                                } py-2 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1 ${
                                    first ? 'group-hover:bg-[#6084f7]' : ''
                                }`}
                            >
                                {name}
                                {arrow ? (
                                    <svg
                                        className="h-5 w-5 rtl:rotate-180"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        style={{
                                            marginTop: 'auto',
                                            marginBottom: 'auto',
                                            marginLeft: '0.5rem',
                                        }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                ) : undefined}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
