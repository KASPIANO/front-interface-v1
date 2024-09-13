import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Input,
    Typography,
} from '@mui/material';
import { DialogContainer } from './TokenDialogInfo.s';
import { UploadContainer, ImagePreview, UploadButton } from '../../../pages/deploy-page/DeployPage.s';
import { TokenKRC20DeployMetadata } from '../../../types/Types';
import { GlobalStyleDialog } from '../../../utils/GlobalStyleScrollBar';
import { isEmptyString } from '../../../utils/Utils';

interface TokenInfoDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (tokenMetadata: TokenKRC20DeployMetadata) => void;
}

const TokenInfoDialog: React.FC<TokenInfoDialogProps> = (props) => {
    const { open, onClose, onSave } = props;
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [x, setX] = useState('');
    const [telegram, setTelegram] = useState('');
    const [contacts, setContacts] = useState<string>('');
    const [logo, setLogo] = useState<File | null>(null);
    const [banner, setBanner] = useState<File | null>(null);
    const [discord, setDiscord] = useState('');
    const [medium, setMedium] = useState('');
    const [github, setGithub] = useState('');
    const [audit, setAudit] = useState('');
    const [whitepaper, setWhitepaper] = useState('');
    const [foundersHandles, setFoundersHandles] = useState('');

    const [descriptionError, setDescriptionError] = useState('');
    const [xError, setXError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [email, setEmail] = useState('');

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        if (value.length > 200) {
            setDescription(value.slice(0, 200));
            setDescriptionError('Description should not exceed 200 characters.');
        } else {
            setDescriptionError('');
        }
    };

    const checkIfEmailExists = (email: string): boolean => {
        if (!email) {
            return false;
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        return emailPattern.test(email);
    };

    const handleSave = () => {
        const twitterUrlPattern = /^(https?:\/\/)?(www\.)?x\.com\/[a-zA-Z0-9_]{1,15}$/;
        // Check if the Twitter (x) URL is valid
        if (!x || !twitterUrlPattern.test(x)) {
            setXError('Please enter a valid X/Twitter URL (e.g., https://x.com/username, x.com/username)');
            return;
        }
        if (!checkIfEmailExists(email)) {
            setEmailError('At least one valid email is required.');
            return;
        }
        setEmailError('');
        setXError('');
        const tokenMetadata: TokenKRC20DeployMetadata = {
            description,
            website,
            x,
            discord,
            telegram,
            logo,
            banner,
            whitepaper,
            medium,
            github,
            audit,
            email,
            contacts: isEmptyString(contacts) ? [] : contacts.split(',').map((contact) => contact.trim()),
            founders: isEmptyString(foundersHandles)
                ? []
                : foundersHandles.split(',').map((handle) => handle.trim()),
        };

        onSave(tokenMetadata);
        handleOnClose();
    };

    const handleOnClose = () => {
        setDescription('');
        setWebsite('');
        setX('');
        setTelegram('');
        setContacts('');
        setLogo(null);
        setBanner(null);
        setDiscord('');
        setMedium('');
        setGithub('');
        setAudit('');
        setWhitepaper('');
        setFoundersHandles('');
        setDescriptionError('');
        setXError('');
        setEmail('');
        onClose();
    };

    const validateImageSize = (file: File | null, maxSizeMB: number) => {
        if (file) {
            const fileSizeMB = file.size / (1024 * 1024);
            return fileSizeMB <= maxSizeMB;
        }
        return true;
    };

    const setLogoHandler = (file: File | null) => {
        if (validateImageSize(file, 50)) {
            setLogo(file);
        }
    };

    // Handler for setting banner with validation
    const setBannerHandler = (file: File | null) => {
        if (validateImageSize(file, 50)) {
            setBanner(file);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    maxWidth: '70vw',
                },
            }}
        >
            <GlobalStyleDialog />
            <DialogContainer>
                <DialogTitle>Add Token Information</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => handleDescriptionChange(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline // Enables multiline input
                        minRows={1} // Minimum number of rows when the input is not filled
                        maxRows={6}
                        error={!!descriptionError}
                        helperText={descriptionError}
                        placeholder="Enter a brief description of the token"
                    />
                    <TextField
                        label="Website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        fullWidth
                        margin="normal"
                        placeholder="Enter the token\'s website URL"
                    />
                    <TextField
                        label="X (Twitter)"
                        value={x}
                        onChange={(e) => setX(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!xError}
                        helperText={xError}
                        placeholder="Enter the token\'s X/Twitter URL"
                    />
                    <TextField
                        label="Telegram"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        fullWidth
                        margin="normal"
                        placeholder="Enter the token\'s Telegram handle (e.g., @telegram_handle)"
                    />

                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        placeholder="Enter Email"
                        helperText={emailError ? emailError : 'Email is required to send the listing confirmation'}
                        error={!!emailError}
                    />
                    <TextField
                        label="Discord"
                        value={discord}
                        onChange={(e) => setDiscord(e.target.value)}
                        fullWidth
                        margin="normal"
                        placeholder="Enter the token\'s Discord handle (e.g., discord.gg/invite)"
                    />
                    <TextField
                        label="Medium"
                        value={medium}
                        onChange={(e) => setMedium(e.target.value)}
                        fullWidth
                        margin="normal"
                        placeholder="Enter the token\'s Medium handle (e.g., medium.com/@username)"
                    />
                    <TextField
                        label="GitHub Repository"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        fullWidth
                        margin="normal"
                        placeholder="Enter the token\'s GitHub Repository URL"
                    />
                    <TextField
                        label="Audit Report"
                        value={audit}
                        onChange={(e) => setAudit(e.target.value)}
                        fullWidth
                        margin="normal"
                        placeholder="Enter the token\'s Audit Report URL"
                    />
                    <TextField
                        label="Whitepaper"
                        value={whitepaper}
                        onChange={(e) => setWhitepaper(e.target.value)}
                        fullWidth
                        margin="normal"
                        placeholder="Enter the token\'s Whitepaper URL"
                    />
                    <TextField
                        label="Contact"
                        value={contacts}
                        onChange={(e) => setContacts(e.target.value)}
                        fullWidth
                        multiline // Enables multiline input
                        minRows={1} // Minimum number of rows when the input is not filled
                        maxRows={6}
                        margin="normal"
                        placeholder="Contact information"
                        helperText="Example: email@example.com ,@twitter_handle,@telegram_handle (separate with commas)"
                    />
                    <TextField
                        label="Founders X Handles"
                        value={foundersHandles}
                        onChange={(e) => setFoundersHandles(e.target.value)}
                        fullWidth
                        multiline // Enables multiline input
                        minRows={1} // Minimum number of rows when the input is not filled
                        maxRows={6}
                        margin="normal"
                        helperText="Separate multiple handles with a comma (e.g., @founder1, @founder2)"
                        placeholder="Founder handles"
                    />

                    <UploadContainer>
                        {logo ? (
                            <ImagePreview src={URL.createObjectURL(logo)} alt="Token Logo" />
                        ) : (
                            <Typography>Upload Token's Logo</Typography>
                        )}
                        <UploadButton htmlFor="logo-upload">
                            <Input
                                inputProps={{ accept: 'image/*' }}
                                sx={{ display: 'none' }}
                                id="logo-upload"
                                type="file"
                                onChange={(event) => {
                                    const inputElement = event.target as HTMLInputElement;
                                    setLogoHandler(inputElement.files[0]);
                                }}
                            />
                            <Button variant="text" color="primary" component="span">
                                Choose File or Drag
                            </Button>
                        </UploadButton>
                        <Typography variant="caption" color="text.secondary">
                            Recommended size: 400x400 pixels. Max file size: 50MB.
                        </Typography>
                        <Button
                            sx={{ width: '1vw', height: '2vw' }}
                            onClick={() => {
                                setLogo(null);
                            }}
                            disabled={!logo}
                            color="primary"
                            variant="contained"
                        >
                            Clear
                        </Button>
                    </UploadContainer>

                    <UploadContainer>
                        {banner ? (
                            <ImagePreview src={URL.createObjectURL(banner)} alt="Token Banner" />
                        ) : (
                            <Typography>Upload Token's Banner</Typography>
                        )}
                        <UploadButton htmlFor="banner-upload">
                            <Input
                                sx={{ display: 'none' }}
                                inputProps={{ accept: 'image/*' }}
                                id="banner-upload"
                                type="file"
                                onChange={(event) => {
                                    const inputElement = event.target as HTMLInputElement;
                                    setBannerHandler(inputElement.files[0]);
                                }}
                            />
                            <Button variant="text" color="primary" component="span">
                                Choose File or Drag
                            </Button>
                        </UploadButton>
                        <Typography variant="caption" color="text.secondary">
                            Recommended size: 1500x500 pixels. Max file size: 50MB.
                        </Typography>
                        <Button
                            sx={{ width: '1vw', height: '2vw' }}
                            onClick={() => {
                                setBanner(null);
                            }}
                            disabled={!banner}
                            color="primary"
                            variant="contained"
                        >
                            Clear
                        </Button>
                    </UploadContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary" variant="contained">
                        Review
                    </Button>
                </DialogActions>
            </DialogContainer>
        </Dialog>
    );
};
export default TokenInfoDialog;
