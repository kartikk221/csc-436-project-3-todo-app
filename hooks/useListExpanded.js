import { supabase_get_list_expanded } from '../utils/lists';
import { useRef, useState, useEffect, useCallback } from 'react';

export const cache = new Map();

export default function useListExpanded(id = '') {
    const isMounted = useRef(false);
    const [list, setList] = useState(undefined);
    const [error, setError] = useState(undefined);

    const refresh_list = useCallback(
        async (_id = '') => {
            const __id = _id || id || '';

            // Resolve from cache if possible
            if (cache.has(__id)) return setList(cache.get(__id));

            // Get listings from supabase
            const { success, data } = await supabase_get_list_expanded(__id);

            // Handle error from supabase
            if (!success) return setError(data);

            // Ensure the list exists
            if (!data) return setList(null);

            // Set listings
            cache.set(__id, data);
            setList(data);
        },
        [id]
    );

    useEffect(() => {
        // Ensure this hook is only ran once
        if (!isMounted.current) {
            isMounted.current = true;
            refresh_list(id);
        }
    }, [id, refresh_list]);

    return {
        list,
        error,
        refresh: refresh_list,
        loading: list === undefined,
    };
}
