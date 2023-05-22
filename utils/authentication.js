import supabase from './supabase';
import { SUPABASE_TABLES } from './tables';

export async function supabase_register_user(name, email, password) {
    // Check if user already exists
    const { data: register_data, error: register_error } = await supabase
        .from(SUPABASE_TABLES.USERS)
        .select('*')
        .eq('email', email)
        .limit(1);

    // Handle error from Supabase
    if (register_error) return { success: false, error: register_error.message };

    // Check if user already exists
    if (register_data.length > 0) return { success: false, error: 'User already exists' };

    // Sign up with Supabase
    const { data: auth_data, error: auth_error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            name,
        },
    });

    // Handle error from Supabase
    if (auth_error) return { success: false, error: auth_error };

    // Get user id from Supabase
    const user_id = auth_data?.user?.id;
    if (user_id) {
        // Insert user into database
        const { data: insert_data, error: insert_error } = await supabase
            .from(SUPABASE_TABLES.USERS)
            .insert([{ id: user_id, name, email }]);

        // Handle error from Supabase
        if (insert_error) return { success: false, error: insert_error.message };

        // Return success
        return { success: true, ...insert_data };
    } else {
        console.log('invalid.auth.response', auth_data);
        return { success: false, error: 'An unknown error occured' };
    }
}

export async function supabase_login_user(email, password) {
    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    // Handle error from Supabase
    if (error) return { success: false, error: error.message };

    // Determine if user exists
    if (data.user) {
        // Retrieve the profile data
        const { data: profile_data, error: profile_error } = await supabase
            .from(SUPABASE_TABLES.USERS)
            .select('*')
            .eq('id', data.user.id)
            .limit(1);

        // Handle error from Supabase
        if (profile_error) return { success: false, error: profile_error.message };

        // Return success
        return { success: true, user: profile_data[0] };
    }

    return {
        success: false,
        error: 'An unknown error occured',
    };
}

export async function supabase_get_user() {
    // Retrieve the supabase session
    const session = await supabase.auth.getSession();
    if (session?.data?.session?.user) {
        // Retrieve the user profile
        const user_id = session.data.session.user.id;
        const { data, error } = await supabase.from(SUPABASE_TABLES.USERS).select('*').eq('id', user_id).limit(1);

        // Handle error from Supabase
        if (error) return { success: false, error: error.message };

        // Return success
        return { success: true, user: data[0] };
    }

    return {
        success: false,
    };
}

export async function supabase_logout_user() {
    // Sign out with Supabase
    const { error } = await supabase.auth.signOut();

    // Handle error from Supabase
    if (error) return { success: false, error: error.message };

    // Return success
    return { success: true };
}
