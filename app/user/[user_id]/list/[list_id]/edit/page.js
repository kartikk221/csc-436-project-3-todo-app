'use client';
import Link from 'next/link';
import ListItem from './ListItem';
import Loader from '../../../../../Loader';
import { useCallback, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { debounce } from '../../../../../../utils/methods';
import useUserProfile from '../../../../../../hooks/userUserProfile';
import useListExpanded from '../../../../../../hooks/useListExpanded';
import { cache } from '../../../../../../hooks/useListListings';
import {
    supabase_create_new_list_item,
    supabase_delete_list,
    supabase_update_list,
} from '../../../../../../utils/lists';

const onListNameChange = debounce(500, async (list, setListName, refreshPage, original_name, target_name) => {
    if (!target_name) return;

    // Update the list name
    const { success, error } = await supabase_update_list(
        list.id,
        target_name,
        list.created_at,
        new Date().toISOString()
    );

    // Handle error from supabase
    if (error) alert(error);

    // Update the list name
    if (success) {
        list.name = target_name;
        list.updated_at = new Date().toISOString();
        refreshPage();
    } else {
        setListName(original_name);
    }
});

export default function ListEdit() {
    const router = useRouter();
    const { user_id, list_id } = useParams();
    const [frame, setFrame] = useState(0);
    const [listName, setListName] = useState(undefined);
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [deleteInFlight, setDeleteInFlight] = useState(false);
    const [itemCreateInFlight, setItemCreateInFlight] = useState(false);
    const { user, error: user_error, loading: user_loading } = useUserProfile();
    const { list, error: list_error, loading: list_loading } = useListExpanded(list_id);

    const refreshPage = () => setFrame((frame) => frame + 1);

    // Display loader while loading
    if (user_loading || list_loading || deleteInFlight) return <Loader />;

    // Show error if there is one
    if (user_error || list_error)
        return <h1 className="text-red-500 my-auto text-2xl font-bold">{user_error || list_error}</h1>;

    // If this list is not owned by the user redirect them to view page for this list
    if (user?.id !== list?.owner && !deleteInFlight) {
        router.push(`/user/${list.owner}/list/${list.id}`);
        return <Loader />;
    }

    const onCreateItem = async () => {
        // Ensure a valid name has been entered
        if (itemName.length < 1) return alert('Please enter a valid name');

        // Ensure a valid description has been entered
        if (itemDescription.length < 1) return alert('Please enter a valid description');

        // Find the highest index of all items in this list
        const id = crypto.randomUUID();
        const highest_index = Math.max(0, ...list.items.map((item) => item.index));

        // Create a new item in the database
        setItemCreateInFlight(true);
        const created_at = new Date().toISOString();
        const [{ success: item_success, error: item_error }, { success: list_success, error: list_error }] =
            await Promise.all([
                supabase_create_new_list_item(
                    id,
                    list.id,
                    itemName,
                    itemDescription,
                    highest_index + 1,
                    false,
                    created_at,
                    created_at
                ),
                supabase_update_list(list.id, list.name, list.created_at, created_at),
            ]);
        setItemCreateInFlight(false);

        // Handle error from supabase
        if (item_error || list_error) return alert(item_error || list_error);

        // Update the list
        if (item_success && list_success) {
            // Intialize an object for the item
            const item = {
                id,
                owner: list.id,
                name: itemName,
                description: itemDescription,
                index: highest_index + 1,
                completed: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            // Add the item to the list
            list.items.unshift(item);

            // Update the list name
            list.updated_at = created_at;

            // Clear the item name and description
            setItemName('');
            setItemDescription('');

            // Refresh the page
            refreshPage();
        } else {
            alert('Failed to create new item and update list');
        }
    };

    // Render the page
    const items = list?.items || [];
    const is_me = user?.id === user_id;
    const inputStyle = 'w-full rounded-lg text-black font-medium border border-gray p-4 pe-12 text-sm shadow-sm';
    return (
        <div
            frame={frame}
            className="flex mt-12 animate-fade-in-up flex-col flex-grow items-center justify-center text-center lg:mb-0 lg:text-left"
        >
            <div className="mx-auto mb-20 max-w-2xl text-center">
                <h1 className="text-2xl font-black sm:text-3xl">
                    Edit <strong className="text-[#6084f7]">To-Do</strong> List
                </h1>

                <div className="relative my-4">
                    <input
                        type="text"
                        className={inputStyle}
                        value={listName === undefined ? list.name : listName}
                        placeholder="Enter To-Do List Name"
                        onChange={(e) => {
                            setListName(e.target.value);
                            onListNameChange(list, setListName, refreshPage, list.name, e.target.value);
                        }}
                    />

                    <button
                        className="text-md mt-3 text-gray-500"
                        onClick={async () => {
                            // Ask the user if they are sure they want to delete this list
                            if (!confirm('Are you sure you want to delete this list?')) return;

                            // Delete the list
                            setDeleteInFlight(true);
                            const { success, error } = await supabase_delete_list(list);

                            // Handle error from supabase
                            if (error) return alert(error);

                            // Clear the cache for no owner and the user's id aka. explore and manage pages
                            cache.delete('');
                            cache.delete(user.id);

                            // Redirect to the user's manage page
                            router.push(`/user/${user.id}`);
                        }}
                    >
                        No longer need this list?{' '}
                        <Link className="ml-1 font-bold text-[#6084f7]" href="/" prefetch={true}>
                            Delete This List
                        </Link>
                    </button>
                </div>

                <p className="mb-4 mt-2 text-white">
                    This List was created {is_me ? 'by you' : ''} at{' '}
                    <strong>{new Date(list.created_at).toLocaleString()}</strong> and last updated{' '}
                    {is_me ? 'by you' : ''} at <strong>{new Date(list.updated_at).toLocaleString()}</strong>.
                </p>

                <h1 className="text-2xl mt-10 font-black sm:text-3xl">
                    Edit <strong className="text-[#6084f7]">To-Do</strong> Items
                </h1>

                <div className="mx-auto mb-0 mt-8 space-y-4">
                    <div className="relative mt-4">
                        <input
                            type="text"
                            value={itemName}
                            className={inputStyle}
                            placeholder="Enter a name"
                            onChange={(e) => setItemName(e.target.value)}
                        />
                    </div>
                    <div className="relative mt-4">
                        <input
                            type="text"
                            value={itemDescription}
                            className={inputStyle}
                            placeholder="Enter a brief description"
                            onChange={(e) => setItemDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Want some ideas from other lists?{' '}
                            <Link className="ml-1 font-bold text-[#6084f7]" href="/" prefetch={true}>
                                Explore
                            </Link>
                        </p>

                        <button
                            onClick={onCreateItem}
                            className={`group relative inline-block text-base font-semibold focus:outline-none focus:ring text-black transition-all`}
                            style={{
                                opacity: itemCreateInFlight ? 0.5 : 1,
                            }}
                        >
                            <span className="absolute inset-0 border border-[#6084f7] rounded-md"></span>
                            <span
                                className={`block border border-[#6084f7] bg-[#6084f7] rounded-md px-8 py-2 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1`}
                            >
                                {itemCreateInFlight ? 'Processing' : 'Create Item'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {items?.length ? (
                items.map((item, index) => (
                    <ListItem key={index} index={index} item={item} items={list.items} refresh={refreshPage} />
                ))
            ) : (
                <Link
                    prefetch={true}
                    href={is_me ? `/user/${list.owner}/list/${list.id}/edit` : '/'}
                    className="group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 border-neutral-700 hover:dark:bg-neutral-800/30"
                >
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        {is_me ? 'Create Your First To-Do Item' : 'No To-Do Items Yet'}{' '}
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
