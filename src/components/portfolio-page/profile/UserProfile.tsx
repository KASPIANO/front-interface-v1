import { useState, useEffect } from 'react';
import { TextField, IconButton, Tooltip, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Regex patterns for validation
const twitterUrlPattern = /^(https?:\/\/)?(www\.)?x\.com\/[a-zA-Z0-9_]{1,15}$/;
const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const UserProfile = () => {
    const [email, setEmail] = useState('');
    const [xHandle, setXHandle] = useState('');
    const [isEditingEmail, setIsEditingEmail] = useState(false); // Initially not editing
    const [isEditingX, setIsEditingX] = useState(false); // Initially not editing
    const [formErrors, setFormErrors] = useState({ email: '', xHandle: '' });

    // Fetch initial data from backend
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/getUserData');
                const data = await response.json();
                setEmail(data.email || '');
                setXHandle(data.xHandle || '');
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, []);

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
            // Send backend request to save email
            console.log('Saving email:', email);
            await fetch('/api/saveEmail', { method: 'POST', body: JSON.stringify({ email }) });
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
            // Send backend request to save X handle
            console.log('Saving X handle:', xHandle);
            await fetch('/api/saveX', { method: 'POST', body: JSON.stringify({ xHandle }) });
            setIsEditingX(false); // Disable editing after save
        } catch (error) {
            console.error('Failed to save X handle:', error);
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={3} sx={{ width: '100%' }}>
            {/* Email Section */}
            <Box display="flex" alignItems="center">
                <TextField
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
                    helperText={formErrors.email || 'Email is required for confirmations'}
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                onClick={() => {
                                    if (isEditingEmail) {
                                        handleEmailSave();
                                    } else {
                                        setIsEditingEmail(true);
                                    }
                                }}
                            >
                                {isEditingEmail ? <SaveIcon /> : <EditIcon />}
                            </IconButton>
                        ),
                    }}
                />
                <Tooltip title="This email will be used to send live notifications of your sales on the platform.">
                    <IconButton>
                        <InfoOutlinedIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* X (Twitter) Section */}
            <Box display="flex" alignItems="center">
                <TextField
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
                    helperText={formErrors.xHandle || 'Enter your X/Twitter handle or URL'}
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                onClick={() => {
                                    if (isEditingX) {
                                        handleXSave();
                                    } else {
                                        setIsEditingX(true);
                                    }
                                }}
                            >
                                {isEditingX ? <SaveIcon /> : <EditIcon />}
                            </IconButton>
                        ),
                    }}
                />
            </Box>
        </Box>
    );
};

export default UserProfile;
