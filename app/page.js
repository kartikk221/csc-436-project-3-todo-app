'use client';
import Link from 'next/link';
import Loader from './Loader';
import useUserProfile from '../hooks/userUserProfile';
import useListListings from '../hooks/useListListings';

export default function Home() {
    const { user, error: user_error, loading: user_loading } = useUserProfile();
    const { listings = [], error: listings_error, loading: listings_loading } = useListListings();

    // Show loader while loading
    if (user_loading || listings_loading) return <Loader />;

    // Show error if there is one
    if (user_error || listings_error)
        return <h1 className="text-red-500 my-auto text-2xl font-bold">{user_error || listings_error}</h1>;

    // Render the list of listings
    return (
        <div className="flex animate-fade-in-up flex-col flex-grow items-center justify-center text-center lg:mb-0 lg:text-left">
            <div className="mx-auto mt-20 max-w-lg text-center">
                <h1 className="text-2xl font-black sm:text-3xl">Explore</h1>
                <p className="mt-4 text-white">See what others are doing to be inspired for your own lists!</p>
            </div>

            {listings?.length ? (
                listings.map((listing, index) => (
                    <Link
                        key={index}
                        href={`/user/${listing.owner}/list/${listing.id}`}
                        className={`${
                            index === 0 ? 'mt-10' : ''
                        } mb-5 group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 border-neutral-700 hover:dark:bg-neutral-800/30`}
                    >
                        <h2 className={`mb-3 text-2xl font-semibold`}>
                            {listing.name}{' '}
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                                style={{
                                    color: user?.id === listing.owner ? '#6084f7' : 'white',
                                }}
                            >
                                -&gt;
                            </span>
                        </h2>
                        <p className={`m-0 max-w-[60ch] text-sm opacity-50`}>
                            This list was created {user?.id === listing.owner ? `by you` : ``} at{' '}
                            <strong>{new Date(listing.created_at).toLocaleString()}</strong> and last updated{' '}
                            {user?.id === listing.owner ? `by you` : ``} at{' '}
                            <strong>{new Date(listing.updated_at).toLocaleString()}</strong>.
                        </p>
                    </Link>
                ))
            ) : (
                <Link
                    href="/list/create"
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 border-neutral-700 hover:dark:bg-neutral-800/30"
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
            )}
        </div>
    );
}
