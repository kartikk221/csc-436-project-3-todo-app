import supabase from './supabase';
import { SUPABASE_TABLES } from './tables';

export async function supabase_get_lists(owner) {
    // Select all lists from the database
    const [
        { data: select_data, error: select_error },
        {
            data: [_owner],
            error: owner_error,
        },
    ] = await Promise.all([
        owner
            ? supabase.from(SUPABASE_TABLES.LISTS).select('*').eq('owner', owner)
            : supabase.from(SUPABASE_TABLES.LISTS).select('*'),
        owner
            ? supabase.from(SUPABASE_TABLES.USERS).select('*').eq('id', owner)
            : {
                  data: [],
                  error: null,
              },
    ]);

    // Handle errors
    if (select_error || owner_error) return { success: false, error: (select_error || owner_error).message };

    // Inject owner data into lists
    if (Array.isArray(select_data) && _owner) select_data.forEach((list) => (list.owner_details = _owner));

    // Return the list data
    return { success: true, data: select_data };
}

export async function supabase_get_list_expanded(id) {
    // Select the list from the database
    const [
        {
            data: [list],
            error: list_error,
        },
        { data: items, error: items_error },
    ] = await Promise.all([
        supabase.from(SUPABASE_TABLES.LISTS).select('*').eq('id', id).limit(1),
        supabase.from(SUPABASE_TABLES.LIST_ITEMS).select('*').eq('owner', id),
    ]);

    // Handle errors
    if (list_error || items_error) return { success: false, error: (list_error || items_error).message };

    // Ensure list exists
    if (!list) return { success: true, data: null };

    // Sort the items in descreasing index order
    items.sort((a, b) => b.index - a.index);

    // Return the list data
    return {
        success: true,
        data: {
            ...list,
            items,
        },
    };
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

export async function supabase_create_new_list_item(
    id,
    owner,
    name,
    description,
    index,
    completed,
    created_at,
    updated_at
) {
    // Create a new list item in the database
    const { data: insert_data, error: insert_error } = await supabase
        .from(SUPABASE_TABLES.LIST_ITEMS)
        .insert([{ id, owner, name, description, index, completed, created_at, updated_at }]);

    // Handle errors
    if (insert_error) return { success: false, error: insert_error.message };

    // Return the list item data
    return { success: true, data: insert_data };
}

export async function supabase_updated_list_item(
    id,
    owner,
    name,
    description,
    index,
    completed,
    created_at,
    updated_at
) {
    // Update the list item in the database
    const { data: update_data, error: update_error } = await supabase
        .from(SUPABASE_TABLES.LIST_ITEMS)
        .update({ name, description, index, completed, created_at, updated_at })
        .match({ id, owner });

    // Handle errors
    if (update_error) return { success: false, error: update_error.message };

    // Return the list item data
    return { success: true, data: update_data };
}

export async function supabase_delete_list_item(id) {
    // Delete the list item from the database
    const { data: delete_data, error: delete_error } = await supabase
        .from(SUPABASE_TABLES.LIST_ITEMS)
        .delete()
        .match({ id });

    // Handle errors
    if (delete_error) return { success: false, error: delete_error.message };

    // Return the list item data
    return { success: true, data: delete_data };
}

export async function supabase_delete_list(list) {
    // Get all the ids of the list items
    const item_ids = list.items.map((item) => item.id);

    // Delete all the list items along with the list
    const [
        { data: delete_items_data, error: delete_items_error },
        { data: delete_list_data, error: delete_list_error },
    ] = await Promise.all([
        item_ids.length
            ? supabase.from(SUPABASE_TABLES.LIST_ITEMS).delete().in('id', item_ids)
            : {
                  data: [],
                  error: null,
              },
        supabase.from(SUPABASE_TABLES.LISTS).delete().match({ id: list.id }),
    ]);

    // Handle errors
    if (delete_items_error || delete_list_error)
        return { success: false, error: (delete_items_error || delete_list_error).message };

    // Return the list item data
    return { success: true, data: { delete_items_data, delete_list_data } };
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
