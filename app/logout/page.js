'use client';
import { useEffect } from 'react';
import Loader from '../Loader';
import { useRouter } from 'next/navigation';
import { supabase_logout_user } from '@/utils/authentication';

export default function Logout() {
    const router = useRouter();
    useEffect(() => {
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
