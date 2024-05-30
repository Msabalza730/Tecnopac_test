import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faEye, faUser, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';


function UserTable() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/users')
            .then(response => {
                if (response.data) {
                    console.log("Received data:", response.data); 
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
        setShowAddModal(true);
    };

    const handleAddUser = () => {
        const newUser = {
            username: username,
            user_role: userRole,
            status: 'active',
            social_profile: JSON.stringify([]),
            promote: false,
            rating: 0, 
            last_login: new Date().toISOString(), 
            photo: 'https://cdn-icons-png.flaticon.com/256/3135/3135823.png' 
        };

        axios.post('http://localhost:5000/api/users', newUser)
            .then(response => {
                setUsers([...users, response.data]);
                setShowAddModal(false);
            })
            .catch(error => {
                console.error('There was an error adding the user!', error);
                setError('There was an error adding the user');
            });
    };

    const editUser = (id) => {
        setSelectedUserId(id);
        setShowEditModal(true);
    };

    const handleEditUser = () => {
        const updatedUser = {
            username: username,
            user_role: userRole,
            status: 'active',
            social_profile: JSON.stringify([]),
            promote: false,
            rating: 0, 
            last_login: new Date().toISOString(), 
            photo: 'https://cdn-icons-png.flaticon.com/256/3135/3135823.png' 
        };

        axios.put(`http://localhost:5000/api/users/${selectedUserId}`, updatedUser)
            .then(response => {
                const updatedUsers = users.map(user => {
                    if (user.id === selectedUserId) {
                        return { ...user, ...response.data };
                    }
                    return user;
                });
                setUsers(updatedUsers);
                setShowEditModal(false);
            })
            .catch(error => {
                console.error('There was an error updating the user!', error);
                setError('There was an error updating the user');
            });
    };


    const deleteUser = (id) => {
        axios.delete(`http://localhost:5000/api/users/${id}`)
            .then(response => {
                console.log("User deleted:", response.data); 
                setUsers(users.filter(user => user.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the user!', error);
                setError('There was an error deleting the user');
            });
    };

    const togglePromote = (id) => {
        const updatedUsers = users.map(user => {
            if (user.id === id) {
                const updatedUser = { ...user, promote: !user.promote };
                axios.put(`http://localhost:5000/api/users/${id}`, updatedUser)
                    .then(response => {
                        console.log("User promote status updated:", response.data);
                    })
                    .catch(error => {
                        console.error('There was an error updating the promote status!', error);
                        setError('There was an error updating the promote status');
                    });
                return updatedUser;
            }
            return user;
        });
        setUsers(updatedUsers);
    };

    const renderSocialProfiles = (profiles) => {
        const getIconClass = (network) => {
            switch (network) {
                case 'twitter':
                    return 'fab fa-twitter';
                case 'facebook':
                    return 'fab fa-facebook';
                case 'instagram':
                    return 'fab fa-instagram';
                case 'linkedin':
                    return 'fab fa-linkedin';
                default:
                    return 'fas fa-globe';
            }
        };
    
        return profiles.map(profile => (
            <a href={profile.url} key={profile.network} target="_blank" rel="noopener noreferrer">
                <i className={getIconClass(profile.network)} style={{ fontSize: '20px', marginRight: '5px' }}></i>
            </a>
        ));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getRoleIcon = (role) => {
        switch (role.toLowerCase()) {
            case 'administrator':
            case 'admin':
                return <FontAwesomeIcon icon={faUserShield} style={{ marginRight: '5px' }} />;
            case 'viewer':
                return <FontAwesomeIcon icon={faEye} style={{ marginRight: '5px' }} />;
            case 'moderator':
                return <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />;
            default:
                return null;
        }
    };

    const getRatingIcon = (rating) => {
        if (rating > 4) {
            return <FontAwesomeIcon icon={faArrowUp} style={{ color: 'green', marginRight: '5px' }} />;
        } else {
            return <FontAwesomeIcon icon={faArrowDown} style={{ color: 'red', marginRight: '5px' }} />;
        }
    };

    return (
        <div className="container mt-5">
            {/* Add User Modal */}
            <div className="modal fade" id="addUserModal" tabIndex="-1" role="dialog" aria-labelledby="addUserModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addUserModalLabel">Add New User</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input type="text" className="form-control" id="username" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="userRole">User Role</label>
                                    <input type="text" className="form-control" id="userRole" placeholder="Enter user role" value={userRole} onChange={e => setUserRole(e.target.value)} />
                                </div>
                                {/* Add other input fields here */}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleAddUser}>Add User</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit User Modal */}
            <div className="modal fade" id="editUserModal" tabIndex="-1" role="dialog" aria-labelledby="editUserModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editUserModalLabel">Edit User</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="editUsername">Username</label>
                                    <input type="text" className="form-control" id="editUsername" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editUserRole">User Role</label>
                                    <input type="text" className="form-control" id="editUserRole" placeholder="Enter user role" value={userRole} onChange={e => setUserRole(e.target.value)} />
                                </div>
                                {/* Add other input fields here */}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleEditUser}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

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
                                <td>
                                    <img 
                                        src={user.photo || 'path/to/default.jpg'} 
                                        alt={user.username} 
                                        style={{ width: '30px', borderRadius: '50%', marginRight: '10px' }} 
                                    />
                                    {user.username}
                                </td>
                                <td>
                                    {getRoleIcon(user.user_role)}
                                    {user.user_role}
                                </td>
                                <td>
                                    <span 
                                        style={{
                                            display: 'inline-block',
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            backgroundColor: user.status === 'active' ? 'green' : 'red',
                                            marginRight: '5px'
                                        }}
                                    ></span>
                                    {user.status}
                                </td>
                                <td>{renderSocialProfiles(user.social_profile)}</td>
                                <td>
                                    <label className="switch">
                                        <input type="checkbox" checked={user.promote} onChange={() => togglePromote(user.id)} />
                                        <span className="slider round"></span>
                                    </label>
                                </td>
                                <td>
                                    {getRatingIcon(user.rating)}
                                    {user.rating}
                                </td>
                                <td>{formatDate(user.last_login)}</td>
                                <td>
                                    <button className="btn btn-sm btn-warning mr-2" onClick={() => handleEditUser(user.id)}>Edit</button>
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