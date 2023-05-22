import supabase from '@/utils/supabase';
import { supabase_get_user } from '@/utils/authentication';
import { useRef, useState, useEffect, useCallback } from 'react';

export default function useUserProfile() {
    const isMounted = useRef(false);
    const [user, setUser] = useState(undefined);
    const [error, setError] = useState(undefined);

    const get_user = useCallback(async () => {
        // Get user from supabase
        const user = await supabase_get_user();

        // Handle error from supabase
        if (!user.success) {
            setUser(null);
            return setError(user.error);
        }

        // Handle no data being received aka. user is not logged in
        if (!user.user) return setUser(null);

        // Set user
        setUser(user.user);
    }, []);

    const refresh_user = useCallback(async () => {
        setUser(undefined);
        setError(undefined);
        get_user();
    }, [setUser, setError, get_user]);

    useEffect(() => {
        // Ensure this hook is only ran once
        if (!isMounted.current) {
            isMounted.current = true;

            // Bind a subscription to auth changes
            const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
                // Get user each time the auth state changes
                if (['SIGNED_IN', 'SIGNED_OUT'].includes(event)) {
                    refresh_user();
                }
            });

            // Get user for the first time
            get_user();

            // Return the cleanup function
            return () => {
                // Unsubscribe from auth changes
                subscription?.unsubscribe();
            };
        }
    }, [refresh_user]);

    return {
        user,
        error,
        refresh: refresh_user,
        loading: user === undefined,
    };
}
