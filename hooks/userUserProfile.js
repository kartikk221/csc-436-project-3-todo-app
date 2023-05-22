import supabase from '../utils/supabase';
import { supabase_get_user } from '../utils/authentication';
import { useRef, useState, useEffect, useCallback } from 'react';

let cache = null;

export default function useUserProfile() {
    const isMounted = useRef(false);
    const [user, setUser] = useState(undefined);
    const [error, setError] = useState(undefined);

    const get_user = useCallback(async () => {
        // Resolve from cache if possible
        if (cache) return setUser(cache);

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
        cache = user.user;
        setUser(user.user);
    }, []);

    const refresh_user = useCallback(async () => {
        setUser(undefined);
        setError(undefined);
        cache = null;
        get_user();
    }, [setUser, setError, get_user]);

    useEffect(() => {
        // Ensure this hook is only ran once
        if (!isMounted.current) {
            isMounted.current = true;

            // Bind a subscription to auth changes
            let last_event = null;
            const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
                // Get user each time the auth state changes
                if (event !== last_event && ['SIGNED_IN', 'SIGNED_OUT'].includes(event)) {
                    last_event = event;
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
    }, [get_user, refresh_user]);

    return {
        user,
        error,
        refresh: refresh_user,
        loading: user === undefined,
    };
}
