'use client';
import Link from 'next/link';
import Loader from '../../../../Loader';
import { useRouter, useParams } from 'next/navigation';
import useUserProfile from '../../../../../hooks/userUserProfile';
import useListExpanded from '../../../../../hooks/useListExpanded';

export default function ViewList() {
    const router = useRouter();
    const { user_id, list_id } = useParams();
    const { user, error: user_error, loading: user_loading } = useUserProfile();
    const { list, error: list_error, loading: list_loading } = useListExpanded(list_id);

    // Display loader while loading
    if (user_loading || list_loading) return <Loader />;

    // Show error if there is one
    if (user_error || list_error)
        return <h1 className="text-red-500 my-auto text-2xl font-bold">{user_error || list_error}</h1>;

    // Render the page
    const items = list?.items || [];
    const is_me = user?.id === user_id;

    // Redirect to the edit page if this is the user's list
    if (is_me) {
        router.push(`/user/${list.owner}/list/${list.id}/edit`);
        return <Loader />;
    }

    // Render the page
    return (
        <div className="flex mt-12 animate-fade-in-up flex-col flex-grow items-center justify-center text-center lg:mb-0 lg:text-left">
            <div className="mx-auto mb-10 max-w-2xl text-center">
                <h1 className="text-2xl font-black sm:text-3xl">{list.name}</h1>
                <p className="mt-4 text-white">
                    This List was created {is_me ? 'by you' : ''} at{' '}
                    <strong>{new Date(list.created_at).toLocaleString()}</strong> and last updated{' '}
                    {is_me ? 'by you' : ''} at <strong>{new Date(list.updated_at).toLocaleString()}</strong>.
                </p>

                <p className="text-md text-gray-500 mt-4">
                    {is_me ? 'Want to make changes to this list?' : 'Want to see more lists like this?'}{' '}
                    <Link
                        prefetch={true}
                        className="ml-1 font-bold text-[#6084f7]"
                        href={is_me ? `/user/${list.owner}/list/${list.id}/edit` : `/user/${list.owner}`}
                    >
                        {is_me ? 'Edit This List' : 'View More'}
                    </Link>
                </p>
            </div>

            {items?.length ? (
                items.map((item, index) => (
                    <div
                        key={index}
                        className={`mb-5 group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 border-neutral-700 hover:dark:bg-neutral-800/30`}
                    >
                        <h2 className={`mb-2 text-2xl font-semibold text-[#6084f7]`}>{item.name}</h2>
                        <p className={`m-0 mb-2 max-w-[60ch] text-lg opacity-100`}>
                            {item.description || 'No description provided.'}
                        </p>
                        <p className={`m-0 max-w-[60ch] text-sm opacity-50`}>
                            This item was created at <strong>{new Date(item.created_at).toLocaleString()}</strong> and
                            updated at <strong>{new Date(item.updated_at).toLocaleString()}</strong>.
                        </p>
                    </div>
                ))
            ) : (
                <Link
                    prefetch={true}
                    href={is_me ? `/user/${list.owner}/list/${list.id}/edit` : '/'}
                    className="group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 border-neutral-700 hover:dark:bg-neutral-800/30"
                >
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        {is_me ? 'Create Your First To-Do Item' : 'No To-Do Items Yet'}{' '}
                        <span
                            className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                            style={{
                                color: is_me ? '#6084f7' : 'white',
                            }}
                        >
                            -&gt;
                        </span>
                    </h2>
                    <p className={`m-0 max-w-[60ch] text-sm opacity-50`}>
                        {is_me
                            ? 'Create your first item to get started and stay productive with your list through the day!'
                            : 'This list has no to-do items yet. Explore other lists to get inspired and stay productive through the day!'}
                    </p>
                </Link>
            )}
        </div>
    );
}
