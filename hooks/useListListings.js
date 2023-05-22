import { supabase_get_lists } from '../utils/lists';
import { useRef, useState, useEffect, useCallback } from 'react';

export const cache = new Map();

export default function useListListings(owner = '') {
    const isMounted = useRef(false);
    const [listings, setListings] = useState(undefined);
    const [error, setError] = useState(undefined);

    const refresh_listings = useCallback(
        async (_owner = '') => {
            const __owner = _owner || owner || '';

            // Resolve from cache if possible
            if (cache.has(__owner)) return setListings(cache.get(__owner));

            // Get listings from supabase
            const { success, data = [] } = await supabase_get_lists(__owner);

            // Handle error from supabase
            if (!success) return setError(data);

            // Set listings
            if (data.length) cache.set(__owner, data);

            // Sort the listings by decreasing updated_at
            data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

            // Handle no data being received aka. user is not logged in
            setListings(data);
        },
        [owner]
    );

    useEffect(() => {
        // Ensure this hook is only ran once
        if (!isMounted.current) {
            isMounted.current = true;
            refresh_listings(owner);
        }
    }, [owner, refresh_listings]);

    return {
        listings,
        error,
        refresh: refresh_listings,
        loading: listings === undefined,
    };
}
