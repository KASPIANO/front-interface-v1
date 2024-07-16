// import React, { useState, useEffect } from 'react';
// import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
// import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
// import {
//     CloseButton,
//     ModalContent,
//     ModalHeader,
//     ModalOverlay,
//     ModalTitle,
//     SearchContainer,
//     SearchInput,
//     TokenItem,
//     TokenList,
//     TokenSymbol,
//     TokenText,
//     TokenTextContainer,
// } from './TokenSelectModal.s';
// import { Token } from '../../../types/Types';

// interface TokenSelectModalProps {
//     onClose: () => void;
//     onSelect: (token: Token) => void;
// }

// const TokenSelectModal: React.FC<TokenSelectModalProps> = ({ onClose, onSelect }) => {
//     const [tokens, setTokens] = useState<Token[]>([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [page, setPage] = useState(1);
//     const [hasMore, setHasMore] = useState(true);

//     // useEffect(() => {
//     //     const fetchTokens = async () => {
//     //         let fetchedTokens: Token[] = [];
//     //         let currentPage = 1;
//     //         let moreTokens = true;

//     //         while (moreTokens) {
//     //             try {
//     //                 const response = await fetch(
//     //                     `https://tn11api.kasplex.org/v1/krc20/tokenlist?page=${currentPage}`,
//     //                 );
//     //                 const data = await response.json();
//     //                 if (data.result) {
//     //                     if (data.result.length === 0) {
//     //                         moreTokens = false;
//     //                         setHasMore(false);
//     //                     } else {
//     //                         fetchedTokens = [...fetchedTokens, ...data.result];
//     //                         currentPage++;
//     //                     }
//     //                 } else {
//     //                     moreTokens = false;
//     //                     setHasMore(false);
//     //                 }
//     //             } catch (error) {
//     //                 console.error('Error fetching token list:', error);
//     //                 moreTokens = false;
//     //                 setHasMore(false);
//     //             }
//     //         }

//     //         setTokens(fetchedTokens);
//     //     };

//     //     fetchTokens();
//     // }, []);

//     const filteredTokens = tokens.filter((token) => token.tick.toLowerCase().includes(searchQuery.toLowerCase()));

//     return (
//         <ModalOverlay>
//             <ModalContent>
//                 <ModalHeader>
//                     <ModalTitle>Select a token</ModalTitle>
//                     <CloseButton onClick={onClose}>
//                         <CloseRoundedIcon />
//                     </CloseButton>
//                 </ModalHeader>
//                 <SearchContainer>
//                     <SearchRoundedIcon style={{ color: 'white', marginRight: '8px' }} />
//                     <SearchInput
//                         type="text"
//                         placeholder="Search by KRC-20 ticker"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                 </SearchContainer>
//                 <TokenList>
//                     {filteredTokens.map((token) => (
//                         <TokenItem key={token.tick} onClick={() => onSelect(token)}>
//                             <TokenTextContainer>
//                                 <TokenText>{token.tick}</TokenText>
//                                 <TokenSymbol>{token.name}</TokenSymbol>
//                             </TokenTextContainer>
//                         </TokenItem>
//                     ))}
//                 </TokenList>
//             </ModalContent>
//         </ModalOverlay>
//     );
// };

// export default TokenSelectModal;
