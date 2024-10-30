import { useState, useEffect } from 'react';
import { TextField, IconButton, Tooltip, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { deleteUserInfoField, getContactInfo, updateContactInfo } from '../../../DAL/BackendDAL';
import DeleteIcon from '@mui/icons-material/Delete';
// Regex patterns for validation
const twitterUrlPattern = /^(https?:\/\/)?(www\.)?x\.com\/[a-zA-Z0-9_]{1,15}$/;
const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const UserProfile = ({ walletAddress }) => {
    const [email, setEmail] = useState('');
    const [xHandle, setXHandle] = useState('');
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingX, setIsEditingX] = useState(false);
    const [formErrors, setFormErrors] = useState({ email: '', xHandle: '' });

    // Fetch initial data from backend
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getContactInfo();
                setEmail(data.email || '');
                setXHandle(data.x_url || '');
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, [walletAddress]);

    // Function to handle form error state
    const setErrorToField = (fieldName, message) => {
        setFormErrors((prev) => ({
            ...prev,
            [fieldName]: message,
        }));
    };

    // Handle Email Save with validation
    const handleEmailSave = async () => {
        if (!email || !emailPattern.test(email)) {
            setErrorToField('email', 'Please enter a valid email');
            return;
        }
        try {
            await updateContactInfo(email, xHandle);
            setIsEditingEmail(false); // Disable editing after save
        } catch (error) {
            console.error('Failed to save email:', error);
        }
    };

    // Handle X Save with validation
    const handleXSave = async () => {
        if (!xHandle || !twitterUrlPattern.test(xHandle)) {
            setErrorToField('xHandle', 'Please enter a valid X/Twitter URL (e.g., https://x.com/username)');
            return;
        }
        try {
            await updateContactInfo(email, xHandle);
            setIsEditingX(false); // Disable editing after save
        } catch (error) {
            console.error('Failed to save X handle:', error);
        }
    };
    const handleDelete = async (field) => {
        try {
            // Call the delete request for the specified field
            await deleteUserInfoField(field);

            // Update the UI based on the deleted field
            if (field === 'email') {
                setEmail('');
            } else if (field === 'xHandle') {
                setXHandle('');
            }

            console.log(`Deleted ${field}`);
        } catch (error) {
            console.error(`Failed to delete ${field}:`, error);
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={3} sx={{ width: '100%' }}>
            {/* Email Section */}
            <Box display="flex" alignItems="center">
                <TextField
                    sx={{ width: '100%' }}
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setFormErrors((prev) => ({ ...prev, email: '' })); // Clear email error on change
                    }}
                    disabled={!isEditingEmail}
                    placeholder="Enter your email"
                    error={!!formErrors.email}
                    helperText={formErrors.email || 'Email is  required for notifications on your listings'}
                    InputProps={{
                        endAdornment: (
                            <Tooltip
                                placement="left"
                                title="Your email will be used for live notifications of your sales on the platform (not mandatory)."
                            >
                                <InfoOutlinedIcon fontSize="small" />
                            </Tooltip>
                        ),
                    }}
                />
                <IconButton
                    sx={{ marginBottom: '1.5rem' }}
                    onClick={() => {
                        if (isEditingEmail) {
                            handleEmailSave();
                        } else {
                            setIsEditingEmail(true);
                        }
                    }}
                >
                    {isEditingEmail ? (
                        <SaveIcon sx={{ fontSize: '1.2rem' }} />
                    ) : (
                        <EditIcon sx={{ fontSize: '1.2rem' }} />
                    )}
                </IconButton>
                <IconButton sx={{ marginBottom: '1.5rem' }} onClick={() => handleDelete('email')}>
                    <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
            </Box>

            {/* X (Twitter) Section */}
            <Box display="flex" alignItems="center">
                <TextField
                    sx={{ width: '100%' }}
                    label="X (Twitter) URL"
                    variant="outlined"
                    fullWidth
                    value={xHandle}
                    onChange={(e) => {
                        setXHandle(e.target.value);
                        setFormErrors((prev) => ({ ...prev, xHandle: '' })); // Clear X handle error on change
                    }}
                    disabled={!isEditingX}
                    placeholder="Enter your X handle or URL"
                    error={!!formErrors.xHandle}
                    helperText={formErrors.xHandle || 'X handle is optional but useful for giveaways '}
                    InputProps={{
                        endAdornment: (
                            <Tooltip
                                placement="left"
                                title="Your X (Twitter) handle is optional but will be used for giveaways."
                            >
                                <InfoOutlinedIcon fontSize="small" />
                            </Tooltip>
                        ),
                    }}
                />
                <IconButton
                    sx={{ marginBottom: '1.5rem' }}
                    onClick={() => {
                        if (isEditingX) {
                            handleXSave();
                        } else {
                            setIsEditingX(true);
                        }
                    }}
                >
                    {isEditingX ? (
                        <SaveIcon sx={{ fontSize: '1.2rem' }} />
                    ) : (
                        <EditIcon sx={{ fontSize: '1.2rem' }} />
                    )}
                </IconButton>
                <IconButton sx={{ marginBottom: '1.5rem' }} onClick={() => handleDelete('xHandle')}>
                    <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default UserProfile;
