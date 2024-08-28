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
import { TokenMetadataResponse } from '../../../types/Types';
import { GlobalStyleDialog } from '../../../utils/GlobalStyleScrollBar';

interface TokenInfoDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (tokenInfo: Partial<TokenMetadataResponse>) => void;
}

const TokenInfoDialog: React.FC<TokenInfoDialogProps> = ({ open, onClose, onSave }) => {
    const [tokenName, setTokenName] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [x, setX] = useState('');
    const [telegram, setTelegram] = useState('');
    const [contacts, setContacts] = useState<string>('');
    const [logo, setLogo] = useState('');
    const [banner, setBanner] = useState('');

    const handleSave = () => {
        const contactsArr = contacts.split(',');
        const tokenMetadata: Partial<TokenMetadataResponse> = {
            description,
            socials: {
                telegram,
                website,
                x,
            },
            logoUrl: logo,
            bannerUrl: banner,
            contacts: contactsArr,
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
                        label="Ticker"
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <TextField
                        label="Website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="X/Former Twitter"
                        value={x}
                        onChange={(e) => setX(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Telegram"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        fullWidth
                        margin="normal"
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
                        </UploadButton>
                    </UploadContainer>
                    <TextField
                        label="Contacts"
                        value={contacts}
                        onChange={(e) => setContacts(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        helperText="Separate contacts with commas, any form of comunication."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </DialogContainer>
        </Dialog>
    );
};

export default TokenInfoDialog;
