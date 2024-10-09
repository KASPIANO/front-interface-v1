import React, { useState } from 'react';
import {
    CloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalTitle,
    SearchInput,
    TokenImage,
    TokenItem,
    TokenList,
} from './TokenSearchModal.s';
import { isEmptyString } from '../../../utils/Utils';
import { DEFAULT_TOKEN_LOGO_URL } from '../../../utils/Constants';

interface Token {
    symbol: string;
    name: string;
    logoURI: string;
}

interface TokenSearchModalProps {
    tokens: Token[];
    onClose: () => void;
    onSelect: (token: Token) => void;
}

const TokenSearchModal: React.FC<TokenSearchModalProps> = ({ tokens, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTokens = tokens.filter((token) => token.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <ModalOverlay>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Select a Token</ModalTitle>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </ModalHeader>
                <SearchInput
                    type="text"
                    placeholder="Search token"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <TokenList>
                    {filteredTokens.map((token) => (
                        <TokenItem key={token.symbol} onClick={() => onSelect(token)}>
                            <TokenImage
                                src={isEmptyString(token.logoURI) ? DEFAULT_TOKEN_LOGO_URL : token.logoURI}
                                alt={token.name}
                            />
                            {token.name}
                        </TokenItem>
                    ))}
                </TokenList>
            </ModalContent>
        </ModalOverlay>
    );
};

export default TokenSearchModal;
