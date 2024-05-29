import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserTable() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/users')
            .then(response => {
                if (response.data) {
                    console.log("Received data:", response.data); // Log the received data
                    setUsers(response.data);
                } else {
                    setError('No user data found');
                }
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
                setError('There was an error fetching the users');
            });
    }, []);

    const addUser = () => {
        const newUser = {
            username: 'NewUser',
            user_role: 'UserRole',
            status: 'active',
            social_profile: JSON.stringify([]), // Ensure this is a JSON string
            promote: false,
            rating: 0,
            last_login: new Date().toISOString()
        };

        axios.post('http://localhost:5000/api/users', newUser)
            .then(response => {
                console.log("User added:", response.data); // Log the added user data
                setUsers([...users, { ...newUser, id: response.data.id }]);
            })
            .catch(error => {
                console.error('There was an error adding the user!', error);
                setError('There was an error adding the user');
            });
    };

    const updateUser = (id) => {
        const updatedUser = {
            username: 'UpdatedUser',
            user_role: 'UpdatedRole',
            status: 'inactive',
            social_profile: JSON.stringify([]), // Ensure this is a JSON string
            promote: true,
            rating: 5,
            last_login: new Date().toISOString()
        };

        axios.put(`http://localhost:5000/api/users/${id}`, updatedUser)
            .then(response => {
                console.log("User updated:", response.data); // Log the updated user data
                const updatedUsers = users.map(user => {
                    if (user.id === id) {
                        return { ...user, ...updatedUser };
                    }
                    return user;
                });
                setUsers(updatedUsers);
            })
            .catch(error => {
                console.error('There was an error updating the user!', error);
                setError('There was an error updating the user');
            });
    };

    const deleteUser = (id) => {
        axios.delete(`http://localhost:5000/api/users/${id}`)
            .then(response => {
                console.log("User deleted:", response.data); // Log the deleted user data
                setUsers(users.filter(user => user.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the user!', error);
                setError('There was an error deleting the user');
            });
    };

    const renderSocialProfiles = (profiles) => {
        if (!profiles || profiles === "[]") {
            return "No profiles"; // Return a default message if no profiles are available
        }
        try {
            const parsedProfiles = JSON.parse(profiles);
            return parsedProfiles.map(profile => (
                <a href={profile.url} key={profile.network} target="_blank" rel="noopener noreferrer">
                    <img src={`icons/${profile.network}.png`} alt={profile.network} style={{ width: '20px', marginRight: '5px' }} />
                </a>
            ));
        } catch (e) {
            console.error('Error parsing social profiles', e);
            return null;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };


    return (
        <div className="container mt-5">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span>All Users: {users.length}</span>
                <span>Projects: 884</span>
                <button className="btn btn-light">⚙️ Table Settings</button>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-primary mb-3" onClick={addUser}>+ Add New User</button>
                <div className="btn-group mb-3">
                    <button className="btn btn-light">Suspend All</button>
                    <button className="btn btn-light">Archive All</button>
                    <button className="btn btn-light">Delete All</button>
                </div>
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th></th>
                        <th>USER</th>
                        <th>USER ROLE</th>
                        <th>STATUS</th>
                        <th>SOCIAL PROFILE</th>
                        <th>PROMOTE</th>
                        <th>RATING</th>
                        <th>LAST LOGIN</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map(user => (
                            <tr key={user.id}>
                                <td><input type="checkbox" /></td>
                                <td>{user.username} <img src={user.photo} alt={user.username} style={{ width: '30px', borderRadius: '50%', marginLeft: '10px' }} /></td>
                                <td>{user.user_role}</td>
                                <td>{user.status}</td>
                                <td>{renderSocialProfiles(user.social_profile)}</td>
                                <td><button className="btn btn-link">{user.promote ? 'Yes' : 'No'}</button></td>
                                <td>{user.rating}</td>
                                <td>{formatDate(user.last_login)}</td>
                                <td>
                                    <button className="btn btn-sm btn-warning mr-2" onClick={() => updateUser(user.id)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => deleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center">No users available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default UserTable;