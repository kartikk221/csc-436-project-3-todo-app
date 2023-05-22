'use client';
import Loader from '../Loader';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase_logout_user } from '../../utils/authentication';

export const revalidate = 0;

export default function Logout() {
    const router = useRouter();
    useEffect(() => {
        // Redirect to the home page if the user is not logged in
        supabase_logout_user().then(({ success, error }) => {
            if (success) {
                // Redirect user to the login page
                router.push('/login');
            } else {
                // TODO: Display error message
                alert(error);

                // Send the user back to the previous page
                router.back();
            }
        });
    }, [router]);

    return <Loader />;
}
