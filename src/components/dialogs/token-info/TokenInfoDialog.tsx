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
import { BackendTokenMetadata } from '../../../types/Types';
import { GlobalStyleDialog } from '../../../utils/GlobalStyleScrollBar';

interface TokenInfoDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (tokenInfo: Partial<BackendTokenMetadata>) => void;
}

const TokenInfoDialog: React.FC<TokenInfoDialogProps> = ({ open, onClose, onSave }) => {
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [x, setX] = useState('');
    const [telegram, setTelegram] = useState('');
    const [contacts, setContacts] = useState<string>('');
    const [logo, setLogo] = useState('');
    const [banner, setBanner] = useState('');
    const [discord, setDiscord] = useState('');
    const [medium, setMedium] = useState('');
    const [github, setGithub] = useState('');
    const [audit, setAudit] = useState('');
    const [whitepaper, setWhitepaper] = useState('');
    const [foundersHandles, setFoundersHandles] = useState('');

    const [descriptionError, setDescriptionError] = useState('');
    const [xError, setXError] = useState('');

    const handleDescriptionChange = (value: string) => {
        if (value.length > 200) {
            setDescriptionError('Description should not exceed 200 characters.');
        } else {
            setDescriptionError('');
        }
        setDescription(value);
    };

    const handleSave = () => {
        const contactsArr = contacts.split(',');
        const twitterUrlPattern = /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,15}$/;

        // Check if the Twitter (x) URL is valid
        if (x && !twitterUrlPattern.test(x)) {
            setXError(
                'Please enter a valid Twitter URL (e.g., https://twitter.com/username, twitter.com/username)',
            );
            return;
        }
        const tokenMetadata: Partial<BackendTokenMetadata> = {
            description,
            socials: {
                telegram,
                website,
                x,
                discord,
                medium,
                github,
                audit,
                whitepaper,
            },
            logoUrl: logo,
            bannerUrl: banner,
            contacts: contactsArr,
            founders: foundersHandles.split(','),
        };

        onSave(tokenMetadata);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
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
                        multiline
                        rows={4}
                        error={!!descriptionError}
                        helperText={descriptionError}
                    />
                    <TextField
                        label="Website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="X (Twitter)"
                        value={x}
                        onChange={(e) => setX(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!xError}
                        helperText={xError}
                    />
                    <TextField
                        label="Telegram"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Discord"
                        value={discord}
                        onChange={(e) => setDiscord(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Medium"
                        value={medium}
                        onChange={(e) => setMedium(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="GitHub"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Audit Report"
                        value={audit}
                        onChange={(e) => setAudit(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Whitepaper"
                        value={whitepaper}
                        onChange={(e) => setWhitepaper(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Founders X Handles"
                        value={foundersHandles}
                        onChange={(e) => setFoundersHandles(e.target.value)}
                        fullWidth
                        margin="normal"
                        helperText="Separate multiple handles with a comma (e.g., @founder1, @founder2)"
                    />
                    <TextField
                        label="Contacts"
                        value={contacts}
                        onChange={(e) => setContacts(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={2}
                        helperText="Separate contacts with commas, any form of communication."
                    />
                    <UploadContainer>
                        {logo ? (
                            <ImagePreview src={logo} alt="Token Logo" />
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
                                    setLogo(URL.createObjectURL(inputElement.files[0]));
                                }}
                            />
                            <Button variant="text" color="primary" component="span">
                                Choose File or Drag
                            </Button>
                        </UploadButton>
                        <Button
                            sx={{ width: '1vw', height: '2vw' }}
                            onClick={() => {
                                setLogo('');
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
                            <ImagePreview src={banner} alt="Token Banner" />
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
                                    setBanner(URL.createObjectURL(inputElement.files[0]));
                                }}
                            />
                            <Button variant="text" color="primary" component="span">
                                Choose File or Drag
                            </Button>
                        </UploadButton>
                        <Button
                            sx={{ width: '1vw', height: '2vw' }}
                            onClick={() => {
                                setBanner('');
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
                        Save & Pay
                    </Button>
                </DialogActions>
            </DialogContainer>
        </Dialog>
    );
};
export default TokenInfoDialog;
