import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faEye, faUser, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import EditUserModal from './EditUserModal';
import Pagination from '@mui/material/Pagination';

function UserTable() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userPhoto, setUserPhoto] = useState('');
    const [status, setStatus] = useState('');
    const [rating, setRating] = useState('');
    const [socialProfile, setSocialProfile] = useState('');
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    useEffect(() => {
        axios.get('http://localhost:5000/api/users')
            .then(response => {
                if (response.data) {
                    setUsers(response.data);
                } else {
                    setError('No user data found');
                }
            })
            .catch(error => {
                setError('There was an error fetching the users');
            });
    }, []); 

    const addUser = () => {
        setUsername('');
        setUserRole('');
        setUserPhoto('');
        setStatus('active');
        setRating(0);
        setSocialProfile(JSON.stringify([]));
        setShowAddModal(true);
    };

    const handleAddUser = () => {
        const newUser = {
            username: username,
            user_role: userRole || 'viewer',
            status: status || 'active',
            social_profile: socialProfile || JSON.stringify([]),
            promote: false,
            rating: rating || 0,
            last_login: new Date().toISOString(),
            photo: userPhoto || 'https://cdn-icons-png.flaticon.com/256/3135/3135823.png'
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
        const user = users.find(user => user.id === id);
        if (user) {
            setSelectedUserId(id);
            setUsername(user.username);
            setUserRole(user.user_role);
            setUserPhoto(user.photo);
            setStatus(user.status);
            setRating(user.rating);
            setSocialProfile(user.social_profile);
            setSelectedUser(user);
            setShowEditModal(true);
        }
    };

    const handleEditUser = () => {
        const updatedUser = {
            username: username,
            user_role: userRole || 'viewer',
            status: status || 'active',
            social_profile: socialProfile || JSON.stringify([]),
            promote: false,
            rating: rating || 0,
            last_login: new Date().toISOString(),
            photo: userPhoto || 'https://cdn-icons-png.flaticon.com/256/3135/3135823.png'
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
                setUsers(prevUsers => prevUsers.map(user => user.id === selectedUserId ? updatedUser : user));

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
        if (!Array.isArray(profiles)) {
            return null; 
        }
    
        return profiles.map((profile, index) => (
            <a href={profile.url} key={index} target="_blank" rel="noopener noreferrer" className={`${profile.network} social`} style={{ fontSize: '10px', marginRight: '10px' }}>
                {profile.network === 'facebook' && <FontAwesomeIcon icon={faFacebook} size="2x" />}
                {profile.network === 'twitter' && <FontAwesomeIcon icon={faTwitter} size="2x" />}
                {profile.network === 'instagram' && <FontAwesomeIcon icon={faInstagram} size="2x" />}
            </a>
        ));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getRoleIcon = (role) => {
        if (!role) return null;
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
            <div className="modal fade show" style={{ display: showAddModal ? 'block' : 'none' }} id="addUserModal" tabIndex="-1" role="dialog" aria-labelledby="addUserModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addUserModalLabel">Add New User</h5>
                            <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} aria-label="Close">
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
                                <div className="form-group">
                                    <label htmlFor="userPhoto">Photo URL</label>
                                    <input type="text" className="form-control" id="userPhoto" placeholder="Enter photo URL" value={userPhoto} onChange={e => setUserPhoto(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                    <select className="form-control" id="status" value={status} onChange={e => setStatus(e.target.value)}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="rating">Rating</label>
                                    <input type="number" className="form-control" id="rating" placeholder="Enter rating" value={rating} onChange={e => setRating(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="socialProfile">Social Profile (JSON format)</label>
                                    <textarea className="form-control" id="socialProfile" placeholder="Enter social profile" value={socialProfile} onChange={e => setSocialProfile(e.target.value)} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleAddUser}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit User Modal */}
            <div className="modal fade show" style={{ display: showEditModal ? 'block' : 'none' }} id="editUserModal" tabIndex="-1" role="dialog" aria-labelledby="editUserModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editUserModalLabel">Edit User</h5>
                            <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Close">
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
                                <div className="form-group">
                                    <label htmlFor="editUserPhoto">Photo URL</label>
                                    <input type="text" className="form-control" id="editUserPhoto" placeholder="Enter photo URL" value={userPhoto} onChange={e => setUserPhoto(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editUserStatus">Status</label>
                                    <select className="form-control" id="editUserStatus" value={status} onChange={e => setStatus(e.target.value)}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editUserRating">Rating</label>
                                    <input type="number" className="form-control" id="editUserRating" placeholder="Enter rating" value={rating} onChange={e => setRating(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editUserSocialProfile">Social Profile (JSON format)</label>
                                    <textarea className="form-control" id="editUserSocialProfile" placeholder="Enter social profile" value={socialProfile} onChange={e => setSocialProfile(e.target.value)} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleEditUser}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span>All Users: <strong>{users.length}</strong> Projects: <strong>884</strong></span>
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
            <table className="table table-bordered table-no-vertical-borders">
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
                                    src={user.photo || 'https://cdn-icons-png.flaticon.com/256/3135/3135823.png'} 
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
                            <td>
                                {renderSocialProfiles(user.social_profile || [])}
                            </td>
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
                                <button className="btn btn-sm btn-warning mr-2" onClick={() => editUser(user.id)}>Edit</button>
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
        <Pagination
                count={Math.ceil(users.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
                shape="rounded"
                style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
        />
    </div>
    );
}

export default UserTable;