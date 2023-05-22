'use client';
import Link from 'next/link';
import Loader from '../../../Loader';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import useUserProfile from '../../../../hooks/userUserProfile';
import useListListings from '../../../../hooks/useListListings';

export default function UserList() {
    const router = useRouter();
    let { user_id } = useParams();
    if (decodeURIComponent(user_id) === ':user') user_id = '';
    const { user, error: user_error, loading: user_loading } = useUserProfile();
    const { listings, error: listings_error, loading: listings_loading } = useListListings(user_id);

    // If there is no user, redirect to login page
    if (!user_id) {
        router.push('/login');
        return null;
    }

    // Show loader while loading
    if (user_loading || listings_loading) return <Loader />;

    // Show error if there is one
    if (user_error || listings_error)
        return <h1 className="text-red-500 my-auto text-2xl font-bold">{user_error || listings_error}</h1>;

    // If there is no user, redirect to login page
    if (!user) {
        router.push('/login');
        return null;
    }

    // Render the list of listings
    const is_me = user?.id === user_id;
    return (
        <div className="flex animate-fade-in-up flex-col flex-grow items-center justify-center text-center lg:mb-0 lg:text-left">
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
                                    color: '#6084f7',
                                }}
                            >
                                -&gt;
                            </span>
                        </h2>
                        <p className={`m-0 max-w-[60ch] text-sm opacity-50`}>
                            This list was created {user?.id === listing.owner ? `by you` : ``} at{' '}
                            <strong>{new Date(listing.created_at).toLocaleString()}</strong> and updated at{' '}
                            <strong>{new Date(listing.updated_at).toLocaleString()}</strong>.
                        </p>
                    </Link>
                ))
            ) : (
                <Link
                    href={is_me ? '/list/create' : ''}
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 border-neutral-700 hover:dark:bg-neutral-800/30"
                >
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        No Lists Yet{' '}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            -&gt;
                        </span>
                    </h2>
                    <p className={`m-0 max-w-[60ch] text-sm opacity-50`}>
                        {is_me
                            ? 'You have not created any lists yet. Create your first list to get started.'
                            : 'This user has not created any lists yet. Check back later!'}
                    </p>
                </Link>
            )}
        </div>
    );
}
