# Loop SDK

Loop SDK allows dApps to connect to a [Loop](https://cantonloop.com) account.  
The Loop wallet can be on mobile or desktop, and the entire interaction flow happens within your dApp.  
For signing in, the user will be prompted on their Loop wallet.

## Limitation

Currently, the SDK only supports DAML transactions from the built‑in Splice DAR files and Utility app DAR files.

There is no plan to upload or support third‑party DAR files at this time.

---

## Quick Overview

For a quick demonstration of how the SDK works, see this CodePen example:

🔗 **https://codepen.io/kureikain/pen/KwVGgLX**

---

## Usage Guide

### Install the SDK

Using Bun:

```bash
bun add @fivenorth/loop-sdk
```

Or via CDN (no build process required):

```javascript
import { loop } from "https://unpkg.com/@fivenorth/loop-sdk@0.2.0/dist";
```

Then import into your dApp:

```javascript
import { loop } from '@fivenorth/loop-sdk';
```

---

## 1. Initialize the SDK

Call `loop.init()` once when your application loads:

```javascript
loop.init({
    appName: 'My Awesome dApp',
    network: 'local', // or 'devnet', 'mainnet'
    onAccept: (provider) => {
        console.log('Connected!', provider);
        // You can now use the provider to interact with the wallet
    },
    onReject: () => {
        console.log('Connection rejected by user.');
    },
});
```

### Parameters

| Field | Description |
|-------|-------------|
| `appName` | Name shown to the user in Loop wallet |
| `network` | `local`, `devnet`, or `mainnet` |
| `onAccept(provider)` | Called when the user approves connection |
| `onReject()` | Called when the user rejects connection |

---

## 2. Connect to the Wallet

To start the connection:

```javascript
loop.connect();
```

This opens a QR modal for the user to scan with their Loop wallet.

---

## 3. Using the Provider

When the user accepts, the `provider` object gives you access to wallet data and ledger operations.

The provider object includes:

- `party_id`
- `public_key`
- `email` 

---

### Get Holdings

```javascript
const holdings = await provider.getHolding();
console.log(holdings);
```

---

### Get Active Contracts

By Template ID:

```javascript
const contracts = await provider.getActiveContracts({
    templateId: '#splice-amulet:Splice.Amulet:Amulet'
});
console.log(contracts);
```

By Interface ID:

```javascript
const contracts = await provider.getActiveContracts({
    interfaceId: '#splice-api-token-holding-v1:Splice.Api.Token.HoldingV1:Holding'
});
console.log(contracts);
```

---

### Submit a Transaction

```javascript
const damlCommand = {
    commands: [{
        ExerciseCommand: {
            templateId: "#splice-api-token-transfer-instruction-v1:Splice.Api.Token.TransferInstructionV1:TransferFactory",
            contractId: 'your-contract-id', 
            choice: 'TransferFactory_Transfer',
            choiceArgument: {
                // ... your arguments
            }
        }
    }],
};

try {
    const result = await provider.submitTransaction(damlCommand);
    console.log('Transaction successful:', result);
} catch (error) {
    console.error('Transaction failed:', error);
}
```

---

### Sign a Message

```javascript
const message = 'Hello, Loop!';
try {
    const signature = await provider.signMessage(message);
    console.log('Signature:', signature);
} catch (error) {
    console.error('Signing failed:', error);
}
```

---

## How the Loop Connect Flow Works

This section explains the code path from your dApp to the Loop wallet and back.

### 1. Your dApp initializes the SDK

You call `loop.init()` once your app loads:

```javascript
loop.init({
    appName: 'My Test dApp',
    network: 'devnet',
    
    // Optional: override wallet/backend URLS for local/dev builds
    walletUrl,
    apiUrl,

    onAccept: (provider) => setProvider(provider),
    onReject: () => console.log('User rejected connection'),
});
```

This step only configures the SDK.
**No connection is made yet.**

---

### 2. User clicks "Connect" in your dApp

```javascript
loop.connect();
```

When called, the SDK:

1. Checks localStorage to see if there is a previous session.
2. If not, it asks the Loop backend for a **connect ticket**.
3. Builds the wallet URL:
    `/.connect/?ticketId=xxxx`
4. Opens the connection flow (QR, popup, or new tab).
5. Opens a WebSocket to wait for approve/reject.

If a valid session is already cached, the SDK may skip the QR step and reconnect automatically.

---

### 3. User approves in the Loop wallet

When the user approves:

1. The wallet updates the backend with "approved".
2. The backend sends a `handshake_accept` message over WebSocket.
3. The SDK creates a `Provider` object containing:

- `party_id`
- `public_key`
- `email`
- `authToken`

4. SDK calls your `onAccept(provider)` callback.

At this point, **your dApp is connected**.

---

### 4. Your dApp uses the Provider

After you store the provider in your component/state, you can call:

```javascript
provider.getHolding();
provider.getActiveContracts({ templateId });
provider.submitTransaction(damlCommand);
provider.signMessage("Hello");
```

This is the same flow used in the CodePen demo.
You initialize once, connect on the button click, then use the provider to interact with the wallet and ledger.

---

# API

More detailed API documentation is coming soon.

---