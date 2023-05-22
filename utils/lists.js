import supabase from './supabase';
import { SUPABASE_TABLES } from './tables';

export async function supabase_get_lists(owner) {
    // Select all lists from the database
    const { data: select_data, error: select_error } = await (owner
        ? supabase.from(SUPABASE_TABLES.LISTS).select('*').eq('owner', owner)
        : supabase.from(SUPABASE_TABLES.LISTS).select('*'));

    // Handle errors
    if (select_error) return { success: false, error: select_error.message };

    // Return the list data
    return { success: true, data: select_data };
}

export async function supabase_create_new_list(id, owner, name, created_at, updated_at) {
    // Create a new list in the database
    const { data: insert_data, error: insert_error } = await supabase
        .from(SUPABASE_TABLES.LISTS)
        .insert([{ id, owner, name, created_at, updated_at }]);

    // Handle errors
    if (insert_error) return { success: false, error: insert_error.message };

    // Return the list data
    return { success: true, data: insert_data };
}

export async function supabase_update_list(id, name, created_at, updated_at) {
    // Update the list in the database
    const { data: update_data, error: update_error } = await supabase
        .from(SUPABASE_TABLES.LISTS)
        .update({ name, created_at, updated_at })
        .match({ id });

    // Handle errors
    if (update_error) return { success: false, error: update_error.message };

    // Return the list data
    return { success: true, data: update_data };
}
