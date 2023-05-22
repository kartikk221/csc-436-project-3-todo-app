'use client';
import Link from 'next/link';
import { useState } from 'react';
import Loader from '../../Loader';
import { useRouter } from 'next/navigation';
import useUserProfile from '../../../hooks/userUserProfile';
import { supabase_create_new_list } from '../../../utils/lists';
import { cache } from '../../../hooks/useListListings';

export default function CreateList() {
    const router = useRouter();
    const [name, setName] = useState('');
    const { user, loading } = useUserProfile();
    const [inFlight, setInFlight] = useState(false);

    // Show loader while loading
    if (loading) return <Loader />;

    // If the user is not logged in redirect to the login page
    if (!user) {
        console.log('user', user);
        router.push('/login');
        return;
    }

    const onSubmit = async () => {
        // Ensure the user entered a valid name
        if (name.length < 3) return alert('Please enter a valid name');

        // Create a new list for the user
        setInFlight(true);
        const id = crypto.randomUUID();
        const { success, error } = await supabase_create_new_list(
            id,
            user.id,
            name,
            new Date().toISOString(),
            new Date().toISOString()
        );
        setInFlight(false);

        // Handle errors
        if (!success) return alert(error);

        // Clear the cache for no owner and the user's id aka. explore and manage pages
        cache.delete('');
        cache.delete(user.id);

        // Redirect to the list page
        router.push(`/user/${user.id}/list/${id}`);
    };

    const inputStyle = 'w-full rounded-lg text-black font-medium border border-gray p-4 pe-12 text-sm shadow-sm';
    return (
        <div className="mx-auto my-auto px-4 py-16 sm:px-6 lg:px-8 animate-fade-in-up">
            <div className="mx-auto max-w-lg text-center">
                <h1 className="text-2xl font-black sm:text-3xl">Create New To-Do List</h1>
                <p className="mt-4 text-white">
                    Enter a name for your new To-Do list below to get started with keeping track of new things!
                </p>
            </div>

            <div className="mx-auto mb-0 mt-8 max-w-md space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        value={name}
                        className={inputStyle}
                        placeholder="Enter a name"
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Want some inspiration?{' '}
                        <Link className="ml-1 font-bold text-[#6084f7]" href="/" prefetch={true}>
                            Explore
                        </Link>
                    </p>

                    <button
                        className={`group relative inline-block text-base font-semibold focus:outline-none focus:ring text-black transition-all`}
                        onClick={onSubmit}
                        style={{
                            opacity: inFlight ? 0.5 : 1,
                        }}
                    >
                        <span className="absolute inset-0 border border-[#6084f7] rounded-md"></span>
                        <span
                            className={`block border border-[#6084f7] bg-[#6084f7] rounded-md px-8 py-2 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1`}
                        >
                            {inFlight ? 'Processing' : 'Create List'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
