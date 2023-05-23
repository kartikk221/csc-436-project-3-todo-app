import { useState } from 'react';
import { debounce } from '../../../../../../utils/methods';
import { supabase_updated_list_item, supabase_delete_list_item } from '../../../../../../utils/lists';

const itemMovementUpdate = async (items, item, up) => {
    const itemIndex = items.findIndex(({ id }) => id === item.id);
    const neighbor = items[itemIndex + (up ? -1 : 1)];
    if (!neighbor) return alert(`Item cannot be moved any ${up ? 'higher' : 'lower'}`);

    // Swap the item's indices
    const updated_at = new Date().toISOString();
    const [{ success, error }, { success: neighbor_success, error: neighbor_error }] = await Promise.all([
        supabase_updated_list_item(
            item.id,
            item.owner,
            item.name,
            item.description,
            neighbor.index,
            item.completed,
            item.created_at,
            updated_at
        ),
        supabase_updated_list_item(
            neighbor.id,
            neighbor.owner,
            neighbor.name,
            neighbor.description,
            item.index,
            neighbor.completed,
            neighbor.created_at,
            updated_at
        ),
    ]);

    // Handle errors
    if (error || neighbor_error) {
        alert(`Failed to move list item: ${(error || neighbor_error).message}`);
        return false;
    }

    // Swap the items in the list
    const temp = item.index;
    item.index = neighbor.index;
    neighbor.index = temp;

    // Sort the items by index
    items.sort((a, b) => b.index - a.index);

    return true;
};

const itemDetailsUpdate = debounce(500, async (item, name, description, refresh) => {
    // Update the item's details
    const updated_at = new Date().toISOString();
    const { success, error } = await supabase_updated_list_item(
        item.id,
        item.owner,
        name,
        description,
        item.index,
        item.completed,
        item.created_at,
        updated_at
    );

    if (error) alert(`Failed to update list item: ${error.message}`);

    // Update the item's details
    item.name = name;
    item.description = description;
    item.updated_at = updated_at;

    // Refresh the list
    refresh();
});

const itemCompletionUpdate = debounce(300, async (item, completed) => {
    // Update the item's completion status
    const { error } = await supabase_updated_list_item(
        item.id,
        item.owner,
        item.name,
        item.description,
        item.index,
        completed,
        item.created_at,
        new Date().toISOString()
    );

    if (error) alert(`Failed to update list item: ${error.message}`);
});

export default function ListItem({ items, item, index, refresh }) {
    const [editMode, setEditMode] = useState(false);
    const [itemId, setItemId] = useState(item.id);
    const [itemName, setItemName] = useState(item.name);
    const [itemCompleted, setItemCompleted] = useState(item.completed);
    const [itemDescription, setItemDescription] = useState(item.description);

    const [moveUpInFlight, setMoveUpInFlight] = useState(false);
    const [moveDownInFlight, setMoveDownInFlight] = useState(false);

    // Recalibrate the state if the item changes
    if (item.id !== itemId) {
        setItemId(item.id);
        setItemName(item.name);
        setItemCompleted(item.completed);
        setItemDescription(item.description);
    }

    const inputStyle = 'w-full rounded-lg text-black font-medium border border-gray p-4 pe-12 text-sm shadow-sm';
    return (
        <div
            className={`flex flex-row w-full ${
                index === 0 ? 'mt-0' : ''
            } mb-5 group rounded-lg border px-5 py-4 transition-colors border-neutral-700`}
        >
            <div className="flex flex-col flex-grow">
                {editMode ? (
                    <div className="flex flex-col mr-10">
                        <div className="relative">
                            <input
                                type="text"
                                value={itemName}
                                className={inputStyle}
                                placeholder="Enter a name"
                                onChange={(e) => {
                                    setItemName(e.target.value);
                                    if (e.target.value.length > 0)
                                        itemDetailsUpdate(item, e.target.value, itemDescription, refresh);
                                }}
                            />
                        </div>
                        <div className="relative mt-4">
                            <input
                                type="text"
                                value={itemDescription}
                                className={inputStyle}
                                placeholder="Enter a brief description"
                                onChange={(e) => {
                                    setItemDescription(e.target.value);
                                    if (e.target.value.length > 0)
                                        itemDetailsUpdate(item, itemName, e.target.value, refresh);
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className={`mb-2 text-2xl font-semibold text-[#6084f7]`}>{item.name}</h2>
                        <p className={`m-0 w-[73ch] text-md opacity-100 mb-2`}>{item.description}</p>

                        <label>
                            <input
                                type="checkbox"
                                className="accent-[#6084f7] mr-2"
                                checked={itemCompleted}
                                onChange={(e) => {
                                    setItemCompleted(e.target.checked);
                                    itemCompletionUpdate(item, e.target.checked);
                                }}
                            ></input>
                            <strong className="opacity-50">
                                {itemCompleted
                                    ? 'This item has been successfully completed.'
                                    : 'This item has not been completed yet.'}
                            </strong>
                        </label>
                    </>
                )}
            </div>

            <div className="flex flex-row">
                <div className="flex flex-col justify-evenly mr-2">
                    <button
                        className={`group relative inline-block text-base font-semibold focus:outline-none focus:ring text-black transition-all`}
                        onClick={() => setEditMode(!editMode)}
                    >
                        <span className="absolute inset-0 border border-[#6084f7] rounded-md"></span>
                        <span
                            className={`block border border-[#6084f7] bg-[#6084f7] rounded-md px-8 py-2 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1`}
                        >
                            {editMode ? 'Exit' : 'Edit'}
                        </span>
                    </button>

                    <button
                        className={`group relative inline-block text-base font-semibold focus:outline-none focus:ring text-black transition-all`}
                        onClick={async () => {
                            // Do not delete if the user is in edit mode
                            if (editMode) return;

                            // Prompt the user to confirm deletion
                            if (!window.confirm('Are you sure you want to delete this item?')) return;

                            // Delete the item
                            const { success, error } = await supabase_delete_list_item(item.id);

                            // Handle errors
                            if (error) return alert(`Failed to delete list item: ${error.message}`);

                            // Find the index of the item and splice it from the list
                            const itemIndex = items.findIndex(({ id }) => id === item.id);
                            items.splice(itemIndex, 1);

                            // Refresh the list
                            refresh();
                        }}
                        style={{
                            opacity: editMode ? 0.5 : 1,
                        }}
                    >
                        <span className="absolute inset-0 border border-[#6084f7] rounded-md"></span>
                        <span
                            className={`block border border-[#6084f7] bg-[#6084f7] rounded-md px-8 py-2 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1`}
                        >
                            Delete
                        </span>
                    </button>
                </div>
                <div className="flex flex-col justify-evenly">
                    <button
                        className={`transition-all group relative inline-block text-base font-semibold focus:outline-none focus:ring text-black transition-all`}
                        onClick={async () => {
                            // Lock the UI or return on edit mode
                            if (moveUpInFlight || editMode) return;
                            setMoveUpInFlight(true);

                            // Move the item up in the list
                            const success = await itemMovementUpdate(items, item, true);
                            if (success) refresh();

                            // Unlock the UI
                            setMoveUpInFlight(false);
                        }}
                        style={{
                            opacity: editMode ? 0.5 : 1,
                        }}
                    >
                        <span className="absolute inset-0 border border-[#6084f7] rounded-md"></span>
                        <span
                            className={`block border border-[#6084f7] bg-[#6084f7] rounded-md px-8 py-2 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1`}
                        >
                            ↑
                        </span>
                    </button>

                    <button
                        className={`transition-all group relative inline-block text-base font-semibold focus:outline-none focus:ring text-black transition-all`}
                        onClick={async () => {
                            // Lock the UI or return on edit mode
                            if (moveDownInFlight || editMode) return;
                            setMoveDownInFlight(true);

                            // Move the item up in the list
                            const success = await itemMovementUpdate(items, item, false);
                            if (success) refresh();

                            // Unlock the UI
                            setMoveDownInFlight(false);
                        }}
                        style={{
                            opacity: editMode ? 0.5 : 1,
                        }}
                    >
                        <span className="absolute inset-0 border border-[#6084f7] rounded-md"></span>
                        <span
                            className={`block border border-[#6084f7] bg-[#6084f7] rounded-md px-8 py-2 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1`}
                        >
                            ↓
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
