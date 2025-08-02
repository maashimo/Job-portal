import React, {useState, useEffect} from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import './EditProfileForm.css';

const EditProfileForm = ({ onclose, onSave}) => {
    const [userData, setUserData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userRole = user?.role;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/auth/me');
                setUserData(response.data);
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                setError('Failed to load user data');
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            profile: {
                ...prevData.profile,
                [name]: value
            }
        }));
    };

    const handleClose = () => {
        if (userRole === 'recruiter') {
            navigate('/recruiter/dashboard');
        } else if (userRole === 'job_seeker') {
            navigate('/job_seeker/dashboard');
        } else {
            navigate('/');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const response = await api.put('/auth/update-profile', userData);
            alert('Profile updated successfully!');
            if (onSave) onSave(response.data);
            if (onclose) onclose();
            else {
                if (userRole === 'recruiter') {
                    navigate('/recruiter/dashboard');
                } else {
                    navigate('/job_seeker/dashboard');
                }
            }
        } catch (err) {
            console.error('Failed to update profile:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to update profile');
            }
        } finally {
            setSaving(false);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    };
    return (
        <form onSubmit={handleSubmit} className="edit-profile-form">
            <h3>Edit Profile</h3>
            {error && <div className="error-message">{error}</div>}

            <label>Name:</label>
            <input name="name" value={userData.name} onChange={handleChange} required />
            
            <label>Email:</label>
            <input name="email" type="email" value={userData.email} onChange={handleChange} required />
            
            { userData.role === 'recruiter' && (
                <>
                    <label>Company:</label>
                    <input name="company" value={userData.company || ''} onChange={handleChange} />
                </>
            )}

            { userData.role === 'job_seeker' && (
                <>
                    <label>Skills (comma separated):</label>
                    <input name="skills" value={userData.skills?.join(', ') || ''} onChange={(e) => handleChange({ target: { name: 'skills', value: e.target.value.split(',').map(skill => skill.trim()) } })} />
                    <label>Bio</label>
                    <textarea name="bio" value={userData.profile?.bio || ''} onChange={handleProfileChange} />
                    <label>Experience</label>
                    <textarea name="experience" value={userData.profile?.experience || ''} onChange={handleProfileChange} />
                    <label>Education</label>
                    <textarea name="education" value={userData.profile?.education || ''} onChange={handleProfileChange} />
                </>
            )}

            <div className="form-actions">
                <button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={handleClose} className="cancel-btn">Cancel</button>
            </div>
        </form>
    );
};

export default EditProfileForm;