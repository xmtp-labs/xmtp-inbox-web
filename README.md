# XMTP Inbox web chat app

![Unit and Component Tests](https://github.com/xmtp-labs/xmtp-inbox-web/actions/workflows/tests.yml/badge.svg)
![E2E Tests](https://github.com/xmtp-labs/xmtp-inbox-web/actions/workflows/cypress.yml/badge.svg)
![Lint Checks](https://github.com/xmtp-labs/xmtp-inbox-web/actions/workflows/lint.yml/badge.svg)
![Code Format Checks](https://github.com/xmtp-labs/xmtp-inbox-web/actions/workflows/fmt-check.yml/badge.svg)

![x-red-sm](https://user-images.githubusercontent.com/510695/163488403-1fb37e86-c673-4b48-954e-8460ae4d4b05.png)

**XMTP Inbox demonstrates core and advanced capabilities of the XMTP client SDK, aiming to showcase effective and innovative ways of building with XMTP.**

The XMTP Inbox app is built with React and the [XMTP client SDK for JavaScript](https://github.com/xmtp/xmtp-js) (`xmtp-js`).

This app is maintained by [XMTP Labs](https://xmtplabs.com) and distributed under [MIT License](./LICENSE) for learning about and developing apps built with XMTP (Extensible Message Transport Protocol), the open protocol and network for secure web3 messaging.

You are free to customize and deploy the app.

This app has not undergone a formal security audit.

> **Note**  
> You might also be interested in the [XMTP React playground app](https://github.com/xmtp/xmtp-react-playground/) that you can use as a tool to start building an app with XMTP. This basic messaging app has an intentionally unopinionated UI to help make it easier for you to build with.

## Get started

### Configure Infura

The XMTP Inbox app uses Infura to enable wallet apps to connect to the Ethereum blockchain.

Add your Infura API key to `.env.local` at the root of `xmtp-inbox-web`.

```
INFURA_ID={YOUR_INFURA_API_KEY}
```

To learn how to create an Infura API key, see [Getting started](https://docs.infura.io/infura/getting-started) in the Infura docs.

### Install the package

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the app.

## Functionality

### Network environment

By default, the app code in this repo is set to send and receive messages using the XMTP `dev` network environment. Use the `XMTP_ENVIRONMENT` variable to change the network the app uses. Other available network environments include `production` and `local`.

XMTP may occasionally delete messages and keys from the `dev` network, and will provide advance notice in the [XMTP Discord community](https://discord.gg/xmtp). The `production` network is configured to store messages indefinitely.

XMTP Labs hosts the following deployments of the XMTP Inbox chat app:

- https://dev.xmtp.chat/ on the `dev` network
- https://xmtp.chat/ on the `production` network

### Wallet connections

The XMTP Inbox app uses [RainbowKit](https://www.rainbowkit.com/) to enable users to connect a Coinbase Wallet, MetaMask, Rainbow, Trust Wallet, or WalletConnect-compatible wallet app (Note: as of WalletConnect v2, a project id is required. This is currently hardcoded with a placeholder value, but if you'd like to use WalletConnect, you can generate your own here and edit the placeholder value in main.tsx)

This app also uses a [viem Account](https://viem.sh/docs/accounts/privateKey.html) interface to sign transactions and messages with a given private key. The XMTP message API client needs this Account to enable and sign messages that create and enable their XMTP identity. This XMTP identity is what enables a user to send and receive messages.

Specifically, the user must provide two signatures using their connected blockchain account:

1. A one-time signature that is used to generate the account's private XMTP identity
2. A signature that is used on app startup to enable, or initialize, the XMTP message API client with that identity

### Chat conversations

The XMTP Inbox app uses the `xmtp-js` [Conversations](https://github.com/xmtp/xmtp-js#conversations) abstraction to list the available conversations for a connected wallet and to listen for or create new conversations. For each conversation, the app gets existing messages and listens for or creates new messages. Conversations and messages are kept in a lightweight store and made available through `XmtpProvider`.

### Accessibility

XMTP Inbox is built with Web Content Accessibility Guidelines (WCAG) AA compliance guidelines in mind.

To learn more about WCAG and building accessible web apps, see [WCAG 2 Overview](https://www.w3.org/WAI/standards-guidelines/wcag/).

### Localization

XMTP Inbox supports localization. If you'd like to contribute a translation of XMTP Inbox UI text, use the existing JSON files in the [`locales` folder](locales) as a starting point. Then, add your translated JSON file to the `locales` folder.

### Tests

Tests will be run with any pull request. To run tests locally, you may use the following commands:

Unit tests:

```bash
npm run test
```

End-to-end Cypress tests:

```bash
npm run e2e:headless
```

Component tests:

```bash
npm run cypress:component
```

### Considerations

You can't use an app built with XMTP to send a message to a blockchain account address that hasn't used XMTP. This app displays an error when it looks up an address that doesn't have an identity already registered on the XMTP network. Have questions or ideas about pre-registration messaging? Post to the [XMTP discussion forum](https://github.com/orgs/xmtp/discussions).
