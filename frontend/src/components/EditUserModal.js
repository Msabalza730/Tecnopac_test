import React, { useState } from 'react';

const EditUserModal = ({ user, onSave, onCancel, onAddUser, onEditUser }) => {
    const [formData, setFormData] = useState({ ...user });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        onSave(formData);
    };

    const handleAdd = () => {
        onAddUser();
    };

    const handleEdit = () => {
        onEditUser();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit User</h2>
                <label>
                    Username:
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                </label>
                <label>
                    User Role:
                    <input type="text" name="user_role" value={formData.user_role} onChange={handleChange} />
                </label>
                <label>
                    Status:
                    <input type="text" name="status" value={formData.status} onChange={handleChange} />
                </label>
                <label>
                    Rating:
                    <input type="number" name="rating" value={formData.rating} onChange={handleChange} />
                </label>
                <label>
                    Social Profile:
                    <input type="text" name="social_profile" value={formData.social_profile} onChange={handleChange} />
                </label>
                <button onClick={handleSave}>Save</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

const UserTable = ({ users, togglePromote, editUser, deleteUser, formatDate }) => {
    const [editingUser, setEditingUser] = useState(null);

    
    const handleSaveUser = (updatedUser) => {
        setEditingUser(null);
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    return (
        <div>
            <table className="table table-bordered">
                <thead>
                    {/* Encabezados de la tabla */}
                </thead>
                <tbody>
                    {/* Filas de la tabla */}
                </tbody>
            </table>
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onSave={handleSaveUser}
                    onCancel={handleCancelEdit}
                />
            )}
        </div>
    );
};

export default EditUserModal;
