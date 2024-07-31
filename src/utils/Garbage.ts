// let kasware;
// let walletAddress;

// function validateTokenName(input) {
//     input.value = input.value.replace(/[^a-zA-Z]/g, '');
//     const statusElement = document.getElementById('tokenStatus');
//     const reviewButton = document.getElementById('reviewButton');

//     if (input.value.length < 4 || input.value.length > 6) {
//         statusElement.innerText = 'Ticker must be between 4 to 6 characters.';
//         statusElement.className = 'status error';
//         reviewButton.disabled = true;
//     } else {
//         statusElement.innerText = '';
//         statusElement.className = 'status';
//         reviewButton.disabled = false;
//     }

//     checkDeployConditions();
// }

// async function connectWallet() {
//     const connectButton = document.getElementById('connectButton');
//     connectButton.disabled = true;
//     try {
//         let accounts = await window.kasware.requestAccounts();
//         walletAddress = accounts[0];
//         console.log('Wallet connected:', walletAddress);
//         const messageElement = document.getElementById('message');
//         messageElement.innerText = 'Wallet connected: ' + walletAddress;
//         kasware = window.kasware;

//         // Change the button text to "Wallet Connected"
//         connectButton.innerText = 'Wallet Connected';

//         // Show the deploy button
//         document.getElementById('deployButton').style.display = 'block';

//         // Remove the message after 10 seconds
//         setTimeout(() => {
//             messageElement.innerText = '';
//         }, 10000);
//     } catch (e) {
//         console.error('Failed to connect wallet:', e);
//         const messageElement = document.getElementById('message');
//         messageElement.innerText = 'Failed to connect wallet: ' + e.message;

//         // Remove the message after 10 seconds
//         setTimeout(() => {
//             messageElement.innerText = '';
//         }, 10000);
//     } finally {
//         connectButton.disabled = false;
//     }
// }

// function showDeployForm() {
//     document.getElementById('deployForm').style.display = 'block';
// }

// async function checkTokenAvailability(ticker) {
//     const statusElement = document.getElementById('tokenStatus');
//     const reviewButton = document.getElementById('reviewButton');

//     // First, check if the ticker length is valid
//     if (!ticker || ticker.length < 4 || ticker.length > 6) {
//         statusElement.innerText = 'Ticker must be between 4 to 6 characters.';
//         statusElement.className = 'status error';
//         reviewButton.disabled = true;
//         return;
//     }

//     try {
//         const response = await fetch(`https://tn11api.kasplex.org/v1/krc20/token/${ticker}`);
//         const data = await response.json();

//         if (data.message === "tick invalid") {
//             statusElement.innerText = 'Ticker is invalid.';
//             statusElement.className = 'status error';
//             reviewButton.disabled = true;
//         } else if (data.message === "successful" && (data.result[0].state === "deployed" || data.result[0].state === "ignored")) {
//             statusElement.innerText = 'Token already exists. Please choose a different ticker.';
//             statusElement.className = 'status error';
//             reviewButton.disabled = true;
//         } else {
//             statusElement.innerText = 'Token is available to deploy.';
//             statusElement.className = 'status success';
//             reviewButton.disabled = false;
//         }
//     } catch (e) {
//         statusElement.innerText = 'Error checking token availability.';
//         statusElement.className = 'status error';
//         reviewButton.disabled = true;
//     }

//     checkDeployConditions();
// }

// function checkDeployConditions() {
//     const totalSupply = document.getElementById('totalSupply').value;
//     const mintLimit = document.getElementById('lim').value;
//     const reviewButton = document.getElementById('reviewButton');

//     if (totalSupply > 0 && mintLimit > 0) {
//         reviewButton.disabled = false;
//     } else {
//         reviewButton.disabled = true;
//     }
// }

// async function confirmDeployment() {
//     const tokenName = document.getElementById('tokenName').value;
//     const totalSupply = document.getElementById('totalSupply').value;
//     const mintLimit = document.getElementById('lim').value;
//     const preMint = document.getElementById('pre').value;
//     const description = document.getElementById('description').value;
//     const website = document.getElementById('website').value;
//     const twitter = document.getElementById('twitter').value;
//     const discord = document.getElementById('discord').value;
//     const telegram = document.getElementById('telegram').value;
//     const picture = document.getElementById('picture').value;

//     if (!tokenName || !totalSupply || !mintLimit || totalSupply <= 0 || mintLimit <= 0) {
//         document.getElementById('message').innerText = 'Token name, total supply, and mint limit are required and must be greater than zero.';
//         setTimeout(() => {
//             document.getElementById('message').innerText = '';
//         }, 10000);
//         return;
//     }

//     // Convert pre-mint value to the smallest unit
//     const maxAllowedValue = 2900000000000000000;
//     const preMintValue = preMint ? (preMint * Math.pow(10, 8)) : 0;

//     if (preMintValue > maxAllowedValue) {
//         document.getElementById('message').innerText = 'Pre-mint value exceeds the maximum allowed value.';
//         setTimeout(() => {
//             document.getElementById('message').innerText = '';
//         }, 10000);
//         return;
//     }

//     const inscribeJsonObject = {
//         p: 'KRC-20',
//         op: 'deploy',
//         tick: tokenName,
//         max: (totalSupply * Math.pow(10, 8)).toString(),
//         lim: (mintLimit * Math.pow(10, 8)).toString(),
//         pre: preMint ? preMintValue.toString() : undefined,
//         dec: '8',
//         desc: description,
//         website: website,
//         twitter: twitter,
//         discord: discord,
//         telegram: telegram,
//         daas: '0',
//         daae: '0'
//     };

//     document.getElementById('confirmationText').innerText = `
//         Deploying token: ${tokenName}
//         Total Supply: ${Number(totalSupply).toLocaleString()}
//         Mint Limit: ${Number(mintLimit).toLocaleString()}
//         Pre-mint Quantity: ${Number(preMint).toLocaleString()}
//         Description: ${description}
//         Website: ${website}
//         Twitter: ${twitter}
//         Discord: ${discord}
//         Telegram: ${telegram}
//     `;
//     document.getElementById('confirmationBox').style.display = 'block';

//     window.inscribeJsonObject = inscribeJsonObject;

//     // Send data to PHP script
//     const formData = new FormData();
//     formData.append('tokenName', tokenName);
//     formData.append('totalSupply', totalSupply);
//     formData.append('lim', mintLimit);
//     formData.append('pre', preMint);
//     formData.append('description', description);
//     formData.append('website', website);
//     formData.append('twitter', twitter);
//     formData.append('discord', discord);
//     formData.append('telegram', telegram);
//     formData.append('picture', picture);

//     fetch('store_token_info.php', {
//         method: 'POST',
//         body: formData
//     }).then(response => response.text())
//       .then(result => {
//           console.log('PHP Response:', result);
//       }).catch(error => {
//           console.error('Error:', error);
//       });
// }

// async function deployToken() {
//     try {
//         // Transfer 100 KAS fee
//         let feeTransferTxid = await kasware.sendKaspa("kaspa:qypqkwl2g36hae62lhdnx7t8n4lq47qmdvjge673f4g0rh8gxtetjmswdf7y9f2", 10000000000); // 100 KAS in smallest unit
//         console.log('Fee Transfer TxID:', feeTransferTxid);

//         // Check if the fee transfer was successful
//         if (!feeTransferTxid) {
//             throw new Error('Failed to transfer the deployment fee');
//         }

//         // Proceed with deployment
//         if (!window.inscribeJsonObject) {
//             throw new Error('Inscribe JSON object is not defined');
//         }

//         const inscribeJsonString = JSON.stringify(window.inscribeJsonObject);
//         if (!inscribeJsonString) {
//             throw new Error('Failed to stringify inscribe JSON object');
//         }

//         console.log('Inscribe JSON String:', inscribeJsonString);

//         const deployTransactionParams = {
//             p: 'KRC-20',
//             op: 'deploy',
//             tick: window.inscribeJsonObject.tick,
//             max: window.inscribeJsonObject.max,
//             lim: window.inscribeJsonObject.lim,
//             pre: window.inscribeJsonObject.pre,
//             dec: window.inscribeJsonObject.dec,
//             daas: window.inscribeJsonObject.daas,
//             daae: window.inscribeJsonObject.daae
//         };

//         console.log('Deploy Transaction Params:', deployTransactionParams);

//         const deployTransactionParamsString = JSON.stringify(deployTransactionParams);
//         console.log('Deploy Transaction Params String:', deployTransactionParamsString);

//         const response = await kasware.signKRC20Transaction(
//             deployTransactionParamsString,
//             2,  // SIGN_KRC20_DEPLOY
//             walletAddress
//         );

//         console.log('Sign KRC20 Transaction response:', response);

//         const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;

//         const commit = parsedResponse.commit;
//         const reveal = parsedResponse.reveal;

//         if (!commit || !reveal) {
//             throw new Error(`Invalid response: commit=${commit}, reveal=${reveal}`);
//         }

//         console.log('Commit ID:', commit);
//         console.log('Reveal ID:', reveal);

//         const revealTransactionParams = {
//             p: 'KRC-20',
//             op: 'reveal',
//             commit: commit,
//             reveal: reveal
//         };

//         const revealTransactionParamsString = JSON.stringify(revealTransactionParams);
//         console.log('Reveal Transaction Params String:', revealTransactionParamsString);

//         const revealResponse = await kasware.signKRC20Transaction(
//             revealTransactionParamsString,
//             2,  // SIGN_KRC20_DEPLOY for reveal step
//             walletAddress
//         );

//         console.log('Reveal Transaction response:', revealResponse);

//         const parsedRevealResponse = typeof revealResponse === 'string' ? JSON.parse(revealResponse) : revealResponse;

//         const revealTxid = parsedRevealResponse.txid || parsedRevealResponse.commit || parsedRevealResponse.reveal;
//         console.log('Parsed Reveal Response:', parsedRevealResponse);

//         if (!revealTxid) {
//             throw new Error('Failed to get transaction ID from reveal response');
//         }

//         console.log('Reveal Transaction ID:', revealTxid);

//         const messageElement = document.getElementById('message');
//         messageElement.innerText = 'Token deployed successfully! TxID: ' + revealTxid;
//         setTimeout(() => {
//             messageElement.innerText = '';
//         }, 10000);
//     } catch (e) {
//         console.error('Token deployment failed:', e);
//         const messageElement = document.getElementById('message');
//         messageElement.innerText = 'Token deployment failed: ' + e.message;

//         if (e.data && e.data.originalError) {
//             console.error('Original error:', e.data.originalError.message);
//             console.error('Stack trace:', e.data.originalError.stack);
//         }

//         setTimeout(() => {
//             messageElement.innerText = '';
//         }, 10000);
//     }
// }

// MINT BATCH
// batch mintKRC20Token
// const _0x246a10 = _0x1154;
// (function(_0x339463, _0x53b0a7) {
//     const _0x45ffc4 = _0x1154
//       , _0x132fa6 = _0x339463();
//     while (!![]) {
//         try {
//             const _0x4382e7 = -parseInt(_0x45ffc4(0xef)) / 0x1 * (-parseInt(_0x45ffc4(0x12c)) / 0x2) + -parseInt(_0x45ffc4(0x132)) / 0x3 + -parseInt(_0x45ffc4(0xe2)) / 0x4 * (-parseInt(_0x45ffc4(0xed)) / 0x5) + -parseInt(_0x45ffc4(0x101)) / 0x6 * (-parseInt(_0x45ffc4(0x110)) / 0x7) + parseInt(_0x45ffc4(0x130)) / 0x8 * (parseInt(_0x45ffc4(0x138)) / 0x9) + parseInt(_0x45ffc4(0xec)) / 0xa * (-parseInt(_0x45ffc4(0x131)) / 0xb) + -parseInt(_0x45ffc4(0x13d)) / 0xc;
//             if (_0x4382e7 === _0x53b0a7)
//                 break;
//             else
//                 _0x132fa6['push'](_0x132fa6['shift']());
//         } catch (_0x3e5a7e) {
//             _0x132fa6['push'](_0x132fa6['shift']());
//         }
//     }
// }(_0x159a, 0x57f27));
// let kasware, walletAddress;
// console[_0x246a10(0x10d)](_0x246a10(0xfd));
// function _0x1154(_0x50e1c2, _0x101c9e) {
//     const _0x159a59 = _0x159a();
//     return _0x1154 = function(_0x11541a, _0x367850) {
//         _0x11541a = _0x11541a - 0xe2;
//         let _0x3ace1c = _0x159a59[_0x11541a];
//         return _0x3ace1c;
//     }
//     ,
//     _0x1154(_0x50e1c2, _0x101c9e);
// }
// let airdropData = [];
// const fixedAddress = 'kaspa:qqqdfggaph6h5kd8mpdgfux20fynp2wqkaaag02l344urwwyxyr9kyyxz05c0'
//   , TxType = {
//     'SIGN_TX': 0x0,
//     'SEND_KASPA': 0x1,
//     'SIGN_KRC20_DEPLOY': 0x2,
//     'SIGN_KRC20_MINT': 0x3,
//     'SIGN_KRC20_TRANSFER': 0x4
// };
// async function connectWallet() {
//     const _0x3aa310 = _0x246a10;
//     console['log']('connectWallet\x20function\x20is\x20called');
//     const _0x515b9e = document[_0x3aa310(0x135)](_0x3aa310(0x13f));
//     _0x515b9e[_0x3aa310(0xf6)] = !0x0;
//     try {
//         console[_0x3aa310(0x10d)](_0x3aa310(0x121));
//         let _0x1dee5b = await window[_0x3aa310(0x10e)]['requestAccounts']();
//         walletAddress = _0x1dee5b[0x0],
//         console[_0x3aa310(0x10d)](_0x3aa310(0xff), walletAddress),
//         kasware = window[_0x3aa310(0x10e)];
//         const _0xcb8cd9 = document[_0x3aa310(0x135)]('message');
//         _0xcb8cd9[_0x3aa310(0x10f)] = _0x3aa310(0x11c) + walletAddress,
//         _0x515b9e['innerText'] = 'Wallet\x20Connected',
//         console['log'](_0x3aa310(0x11f)),
//         document['getElementById'](_0x3aa310(0xf2))['style'][_0x3aa310(0x102)] = _0x3aa310(0x12f),
//         setTimeout(()=>{
//             const _0x1d5a28 = _0x3aa310;
//             _0xcb8cd9[_0x1d5a28(0x10f)] = '';
//         }
//         , 0x2710);
//     } catch (_0xc7a094) {
//         console[_0x3aa310(0x125)](_0x3aa310(0x133), _0xc7a094);
//         const _0x1e663d = document[_0x3aa310(0x135)]('message');
//         _0x1e663d[_0x3aa310(0x10f)] = _0x3aa310(0xeb),
//         setTimeout(()=>{
//             _0x1e663d['innerText'] = '';
//         }
//         , 0x2710);
//     } finally {
//         _0x515b9e[_0x3aa310(0xf6)] = !0x1,
//         console[_0x3aa310(0x10d)](_0x3aa310(0x10c));
//     }
// }
// async function sendTransaction() {
//     const _0x2382d1 = _0x246a10
//       , _0x2f0206 = document['getElementById'](_0x2382d1(0x12b))
//       , _0x49c566 = document[_0x2382d1(0x135)](_0x2382d1(0x10a))
//       , _0x391a37 = _0x2f0206['value'];
//     if (!_0x391a37)
//         return _0x49c566['innerText'] = 'Amount\x20is\x20required.',
//         _0x49c566[_0x2382d1(0xf9)][_0x2382d1(0x123)](_0x2382d1(0x120)),
//         void _0x49c566[_0x2382d1(0xf9)][_0x2382d1(0x141)]('error');
//     try {
//         const _0xfa7f2e = parseInt(0x5f5e100 * _0x391a37)
//           , _0x1fd335 = fixedAddress
//           , _0xee9ce5 = {
//             'feeRate': 0x3e8
//         };
//         console[_0x2382d1(0x10d)](_0x2382d1(0xf8), {
//             'toAddress': _0x1fd335,
//             'satoshis': _0xfa7f2e,
//             'options': _0xee9ce5
//         });
//         const _0x5259c8 = await kasware[_0x2382d1(0xf7)](_0x1fd335, _0xfa7f2e, _0xee9ce5['feeRate']);
//         if (console[_0x2382d1(0x10d)](_0x2382d1(0x13c), _0x5259c8),
//         !_0x5259c8 || -0x7f5b === _0x5259c8[_0x2382d1(0xe7)])
//             throw new Error(_0x5259c8[_0x2382d1(0x10a)]);
//         _0x49c566[_0x2382d1(0x10f)] = _0x2382d1(0xf0) + _0x5259c8,
//         _0x49c566[_0x2382d1(0xf9)]['remove']('error'),
//         _0x49c566['classList'][_0x2382d1(0x141)](_0x2382d1(0x120)),
//         document[_0x2382d1(0x135)](_0x2382d1(0xf4))['style']['display'] = _0x2382d1(0x12f),
//         document['getElementById'](_0x2382d1(0xe4))[_0x2382d1(0xf6)] = !0x1,
//         document['querySelector'](_0x2382d1(0xe9))['disabled'] = !0x1;
//     } catch (_0x46127f) {
//         console[_0x2382d1(0x125)](_0x2382d1(0xf3), _0x46127f),
//         _0x49c566[_0x2382d1(0x10f)] = _0x2382d1(0x143) + _0x46127f['message'],
//         _0x49c566[_0x2382d1(0xf9)]['remove'](_0x2382d1(0x120)),
//         _0x49c566[_0x2382d1(0xf9)]['add'](_0x2382d1(0x125));
//     }
// }
// function uploadCSV() {
//     const _0x558dbf = _0x246a10
//       , _0x438896 = document[_0x558dbf(0x135)](_0x558dbf(0xe4))
//       , _0x20daea = document[_0x558dbf(0x135)](_0x558dbf(0x10a));
//     if (0x0 === _0x438896[_0x558dbf(0x116)]['length'])
//         return _0x20daea[_0x558dbf(0x10f)] = _0x558dbf(0x134),
//         _0x20daea['classList'][_0x558dbf(0x123)](_0x558dbf(0x120)),
//         void _0x20daea[_0x558dbf(0xf9)]['add'](_0x558dbf(0x125));
//     const _0x115731 = _0x438896[_0x558dbf(0x116)][0x0]
//       , _0x409e94 = new FileReader();
//     _0x409e94[_0x558dbf(0x126)] = function(_0x2c4048) {
//         const _0xbf327a = _0x558dbf;
//         processCSV(_0x2c4048[_0xbf327a(0x105)][_0xbf327a(0xf5)]);
//     }
//     ,
//     _0x409e94[_0x558dbf(0xfc)](_0x115731);
// }
// function _0x159a() {
//     const _0x58fdc7 = ['Failed\x20to\x20connect\x20wallet', '8700IQtYuj', '103085SeusYM', 'signKRC20BatchTransferTransaction', '1SWWsAV', 'Transaction\x20sent\x20successfully!\x20TxID:\x20', 'download', 'transactionForm', 'Transaction\x20failed:', 'csvForm', 'result', 'disabled', 'sendKaspa', 'Transaction\x20Params:', 'classList', 'forEach', 'Airdrop\x20in\x20progress...', 'readAsText', 'Script\x20is\x20running', 'removeChild', 'Wallet\x20connected:', 'appendChild', '174126PQebrH', 'display', 'isArray', 'airdropForm', 'target', 'map', 'split', 'address', 'Ticker', 'message', 'To\x20Addresses:', 'Connect\x20button\x20re-enabled', 'log', 'kasware', 'innerText', '98DQeySN', 'length', 'data:text/csv;charset=utf-8,Destination\x20wallet,Ticker,Amount\x0a', 'SIGN_KRC20_TRANSFER', 'loading-icon', 'object', 'files', 'JSON\x20String:', 'successResults', 'parse', 'errorResults', 'trim', 'Wallet\x20connected:\x20', 'txId', '\x0aFailed\x20to\x20parse\x20transaction\x20details\x20for\x20', 'Button\x20text\x20changed\x20to\x20\x22Wallet\x20Connected\x22', 'success', 'Requesting\x20accounts...', 'div', 'remove', 'commit', 'error', 'onload', 'toString', 'body', 'Unexpected\x20response\x20format\x20from\x20signKRC20BatchTransferTransaction,\x20but\x20the\x20main\x20process\x20completed.', '\x0aTransaction\x20to\x20', 'amount', '1169762WTaLHa', 'Airdrop\x20Data:', 'Failed\x20to\x20parse\x20transaction\x20details\x20for\x20', 'block', '88svRmSw', '605XSpUsB', '209169BePUip', 'Failed\x20to\x20connect\x20wallet:', 'Please\x20select\x20a\x20CSV\x20file.', 'getElementById', 'setAttribute', 'querySelector', '577908MtYUve', ',\x20Reveal:\x20', 'KRC-20', 'transfer', 'Transaction\x20Result:', '20079324fVuQyr', 'Airdrop/Mass\x20Transfer\x20completed\x20successfully!', 'connectButton', '#airdropForm\x20button', 'add', 'Full\x20TXID\x20Response:', 'Transaction\x20failed:\x20', 'href', 'Amount', '88aNVqvK', 'style', 'csvFile', 'createElement', '\x20was\x20successful.\x20Commit:\x20', 'code', 'reveal', '#csvForm\x20button', 'filter'];
//     _0x159a = function() {
//         return _0x58fdc7;
//     }
//     ;
//     return _0x159a();
// }
// function processCSV(_0x5fdc22) {
//     const _0x576d54 = _0x246a10
//       , _0x4d0bc6 = _0x5fdc22[_0x576d54(0x107)]('\x0a')[_0x576d54(0xea)](_0x1133f4=>'' !== _0x1133f4[_0x576d54(0x11b)]())
//       , _0x3b0843 = _0x4d0bc6[0x0][_0x576d54(0x107)](',')[_0x576d54(0x106)](_0x4a9108=>_0x4a9108[_0x576d54(0x11b)]())
//       , _0xcebb69 = [];
//     for (let _0x10efca = 0x1; _0x10efca < _0x4d0bc6[_0x576d54(0x111)]; _0x10efca++) {
//         const _0x42d2b3 = _0x4d0bc6[_0x10efca][_0x576d54(0x107)](',');
//         if (_0x42d2b3[_0x576d54(0x111)] !== _0x3b0843[_0x576d54(0x111)])
//             continue;
//         const _0x5ef8dc = {};
//         for (let _0x251664 = 0x0; _0x251664 < _0x3b0843[_0x576d54(0x111)]; _0x251664++)
//             _0x5ef8dc[_0x3b0843[_0x251664]] = _0x42d2b3[_0x251664][_0x576d54(0x11b)]();
//         _0xcebb69['push'](_0x5ef8dc);
//     }
//     airdropData = _0xcebb69,
//     document[_0x576d54(0x135)](_0x576d54(0x104))[_0x576d54(0xe3)]['display'] = _0x576d54(0x12f),
//     document[_0x576d54(0x137)](_0x576d54(0x140))[_0x576d54(0xf6)] = !0x1;
//     const _0x6daaaa = document[_0x576d54(0x135)](_0x576d54(0x10a));
//     _0x6daaaa['innerText'] = 'CSV\x20file\x20uploaded\x20successfully.\x20Ready\x20for\x20airdrop.',
//     _0x6daaaa[_0x576d54(0xf9)]['remove'](_0x576d54(0x125)),
//     _0x6daaaa[_0x576d54(0xf9)][_0x576d54(0x141)](_0x576d54(0x120));
// }
// async function performAirdrop() {
//     const _0x3b60d3 = _0x246a10
//       , _0x503361 = document[_0x3b60d3(0x135)]('message')
//       , _0x3b495c = document['createElement'](_0x3b60d3(0x122));
//     _0x3b495c[_0x3b60d3(0xf9)][_0x3b60d3(0x141)](_0x3b60d3(0x114)),
//     _0x503361[_0x3b60d3(0x10f)] = _0x3b60d3(0xfb),
//     _0x503361['classList'][_0x3b60d3(0x123)](_0x3b60d3(0x125)),
//     _0x503361[_0x3b60d3(0xf9)][_0x3b60d3(0x141)](_0x3b60d3(0x120)),
//     _0x503361['appendChild'](_0x3b495c);
//     try {
//         const _0x4bb289 = airdropData[_0x3b60d3(0x106)](_0x371308=>_0x371308['Destination\x20wallet'])
//           , _0x33b791 = airdropData[0x0][_0x3b60d3(0x109)]
//           , _0x54fbd1 = parseInt(0x5f5e100 * airdropData[0x0][_0x3b60d3(0x145)])[_0x3b60d3(0x127)]();
//         if (console[_0x3b60d3(0x10d)](_0x3b60d3(0x12d), {
//             'toAddresses': _0x4bb289,
//             'ticker': _0x33b791,
//             'amount': _0x54fbd1
//         }),
//         !Array[_0x3b60d3(0x103)](_0x4bb289) || 0x0 === _0x4bb289['length'] || !_0x54fbd1)
//             throw new Error('Invalid\x20toAddresses\x20or\x20amount');
//         const _0xf863aa = {
//             'p': _0x3b60d3(0x13a),
//             'op': _0x3b60d3(0x13b),
//             'tick': _0x33b791,
//             'amt': _0x54fbd1
//         }
//           , _0x3bb177 = JSON['stringify'](_0xf863aa);
//         console[_0x3b60d3(0x10d)]('Deploy\x20Object:', _0xf863aa),
//         console['log'](_0x3b60d3(0x117), _0x3bb177),
//         console[_0x3b60d3(0x10d)](_0x3b60d3(0x10b), _0x4bb289);
//         const _0x4f4c19 = await window[_0x3b60d3(0x10e)][_0x3b60d3(0xee)](_0x3bb177, TxType[_0x3b60d3(0x113)], _0x4bb289);
//         console[_0x3b60d3(0x10d)](_0x3b60d3(0x142), _0x4f4c19),
//         _0x4f4c19 && _0x3b60d3(0x115) == typeof _0x4f4c19 ? Array[_0x3b60d3(0x103)](_0x4f4c19['errorResults']) && 0x0 === _0x4f4c19[_0x3b60d3(0x11a)][_0x3b60d3(0x111)] ? (_0x503361[_0x3b60d3(0x10f)] = _0x3b60d3(0x13e),
//         _0x503361[_0x3b60d3(0xf9)][_0x3b60d3(0x123)](_0x3b60d3(0x125)),
//         _0x503361['classList'][_0x3b60d3(0x141)]('success'),
//         _0x4f4c19[_0x3b60d3(0x118)][_0x3b60d3(0xfa)](_0x342327=>{
//             const _0x168959 = _0x3b60d3;
//             try {
//                 const _0x5bca79 = JSON[_0x168959(0x119)](_0x342327[_0x168959(0x11d)]);
//                 console[_0x168959(0x10d)]('Transaction\x20to\x20' + _0x342327['address'] + _0x168959(0xe6) + _0x5bca79[_0x168959(0x124)] + _0x168959(0x139) + _0x5bca79[_0x168959(0xe8)]),
//                 _0x503361[_0x168959(0x10f)] += _0x168959(0x12a) + _0x342327['address'] + _0x168959(0xe6) + _0x5bca79[_0x168959(0x124)] + _0x168959(0x139) + _0x5bca79[_0x168959(0xe8)];
//             } catch (_0x2e3c28) {
//                 console[_0x168959(0x125)](_0x168959(0x12e) + _0x342327[_0x168959(0x108)] + ':', _0x2e3c28),
//                 _0x503361[_0x168959(0x10f)] += _0x168959(0x11e) + _0x342327[_0x168959(0x108)];
//             }
//         }
//         )) : (console['warn']('Batch\x20transfer\x20encountered\x20errors,\x20but\x20the\x20main\x20process\x20completed.'),
//         _0x503361[_0x3b60d3(0x10f)] = 'Airdrop/Mass\x20Transfer\x20completed\x20with\x20some\x20errors.',
//         _0x503361[_0x3b60d3(0xf9)][_0x3b60d3(0x123)](_0x3b60d3(0x125)),
//         _0x503361[_0x3b60d3(0xf9)]['add'](_0x3b60d3(0x120))) : (console['warn'](_0x3b60d3(0x129)),
//         _0x503361[_0x3b60d3(0x10f)] = _0x3b60d3(0x13e),
//         _0x503361[_0x3b60d3(0xf9)][_0x3b60d3(0x123)](_0x3b60d3(0x125)),
//         _0x503361[_0x3b60d3(0xf9)]['add'](_0x3b60d3(0x120)));
//     } catch (_0x33ed66) {
//         console['error']('Batch\x20transfer\x20failed:', _0x33ed66),
//         _0x503361[_0x3b60d3(0x10f)] = 'Batch\x20transfer\x20failed:\x20' + _0x33ed66[_0x3b60d3(0x10a)],
//         _0x503361['classList']['remove']('success'),
//         _0x503361[_0x3b60d3(0xf9)][_0x3b60d3(0x141)]('error');
//     } finally {
//         _0x503361['contains'](_0x3b495c) && _0x503361[_0x3b60d3(0xfe)](_0x3b495c);
//     }
// }
// function downloadCSVExample() {
//     const _0x5ab9f7 = _0x246a10
//       , _0x1b511f = encodeURI(_0x5ab9f7(0x112))
//       , _0x4c535d = document[_0x5ab9f7(0xe5)]('a');
//     _0x4c535d['setAttribute'](_0x5ab9f7(0x144), _0x1b511f),
//     _0x4c535d[_0x5ab9f7(0x136)](_0x5ab9f7(0xf1), 'example.csv'),
//     document[_0x5ab9f7(0x128)][_0x5ab9f7(0x100)](_0x4c535d),
//     _0x4c535d['click'](),
//     document[_0x5ab9f7(0x128)][_0x5ab9f7(0xfe)](_0x4c535d);
// }
