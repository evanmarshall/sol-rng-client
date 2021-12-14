import { web3, Provider, Program } from '@project-serum/anchor';
const Buffer = require('buffer').Buffer;
window.Buffer = Buffer;
const base64url = require('base64url');

const ORACLE_ADDRESS = "4CBRPLgSVXw8B1ib8pMNqD8eaQk1iXqcsWtHWwSrHWA1";

function addNewLinesToRandomBits(bits) {
    var len = Math.floor(bits.length**(0.5));
    var output = '';
    for (var i = len; i < bits.length; i += len) {
        output += bits.slice(i, Math.min(bits.length, i + len));
        output += '\n';
    }
    return output.replace(' ', '');
}

function randomAccountToString(r) {
    
    let randomBits = r.account.value.map(t => { return (t >>> 0).toString(2).padStart(8, '0'); } ).join('');
    randomBits = addNewLinesToRandomBits(randomBits);

    var pktId = base64url(r.account.pktId);
    var tlsId = base64url(r.account.tlsId);

    var date = new Date(r.account.timestamp.toNumber() * 1000);
    var oracleVerified = false;
    if (r.account.oracle.toString() == ORACLE_ADDRESS) {
        oracleVerified = true
    }

    return `
    <tr>
        <th scope="row">${r.account.uuid.toNumber()}</th>
        <td>${oracleVerified}</td>
        <td>${date}</td>
        <td>${randomBits}</td>
        <td><a href="${`https://arweave.net/${pktId}`}">Packet Capture File</a></td>
        <td><a href="${`https://arweave.net/${tlsId}`}">TLS Session Keys File</a></td>
    </tr>`;
}

class Wallet {
    constructor(payer) {
        this.payer = payer;
    }
    async signTransaction(tx) {
        tx.partialSign(this.payer);
        return tx;
    }
    
    async signAllTransactions(txs) {
        return txs.map((t) => {
            t.partialSign(this.payer);
            return t;
        });
    }
    
      get publicKey() {
        return this.payer.publicKey;
      }
}

(async () => {
    const ENV = 'https://api.devnet.solana.com';
    const LOCAL_WALLET = new Wallet(web3.Keypair.generate());
    const IDL_STRINGIFIED = '{"version":"0.0.0","name":"solRng","instructions":[{"name":"postRandom","accounts":[{"name":"random","isMut":true,"isSigner":false},{"name":"oracle","isMut":true,"isSigner":true},{"name":"rent","isMut":false,"isSigner":false},{"name":"systemProgram","isMut":false,"isSigner":false}],"args":[{"name":"randBump","type":"u8"},{"name":"uuid","type":"u64"},{"name":"value","type":{"array":["u8",64]}},{"name":"pktId","type":{"array":["u8",32]}},{"name":"tlsId","type":{"array":["u8",32]}}]}],"accounts":[{"name":"Random","type":{"kind":"struct","fields":[{"name":"uuid","type":"u64"},{"name":"oracle","type":"publicKey"},{"name":"timestamp","type":"i64"},{"name":"value","type":{"array":["u8",64]}},{"name":"pktId","type":{"array":["u8",32]}},{"name":"tlsId","type":{"array":["u8",32]}},{"name":"bump","type":"u8"}]}}],"metadata":{"address":"Bty5iscY33GnVqzstci1gVNaikxt9aPFW4Q1FmyEqseR"}}';
    const IDL  = JSON.parse(IDL_STRINGIFIED);
    const PROGRAM_ID = new web3.PublicKey('8i5JTa2WvxK53R3iPFTDTj7n6vdYwa22DBux26WszrKd');
    const connection = new web3.Connection(ENV);
    
    const provider = new Provider(connection, LOCAL_WALLET, {
        preflightCommitment: 'recent',
    });

    const program = new Program(IDL, PROGRAM_ID, provider);
    let randoms = await program.account.random.all();
    randoms.sort(function(a, b){ return a.account.timestamp.toNumber() - b.account.timestamp.toNumber()});
    randoms.reverse();

    console.log(`Found ${randoms.length} random numbers`);

    var allRandomDataFormatted = randoms.map(r => randomAccountToString(r)).join('');
    window.allRandomDataFormatted = allRandomDataFormatted;
})();