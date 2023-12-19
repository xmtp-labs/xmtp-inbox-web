import "../../src/polyfills";
import { Client } from "@xmtp/react-sdk";
import { startDemoEnv, checkElement } from "../test_utils";
import randomWallet from "../../src/helpers/createRandomWallet";

describe(
  "Portable Consent Test Cases",
  {
    retries: {
      runMode: 3,
      openMode: 2,
    },
  },
  () => {
    const testUserWithXmtpAccount =
      localStorage.getItem("demoWalletAddress") ?? "";

    // const shortMessage = "hello";
    beforeEach(() => {
      startDemoEnv();
      // In connected flow, conversation list header should render before any tests run
      checkElement("conversation-list-header");
      // Create new account, send message to this account
      // Client.create(senderWallet, { env: "dev" })
      //   .then((xmtp) => {
      //     xmtp.conversations
      //       .newConversation(testUserWithXmtpAccount)
      //       .then((conversation) => {
      //         conversation
      //           .send("hellooooo")
      //           .then((message) => {
      //             console.log("MESSAGE", message);
      //           })
      //           .catch(() => {
      //             console.log("message not sent");
      //           });
      //       })
      //       .catch(() => {
      //         console.log("conversation not created");
      //       });
      //   })
      //   .catch(() => {
      //     console.log("could not create client");
      //   });

      // We should receive this message and see it in requests before going any further

      // checkElement("message-preview-card").should("have.length", 4);
      // console.log("do we get here?");
      // Should see the requests modal with block/unblock
    });

    it("can accept a request and move it to messages", () => {
      const senderWallet = randomWallet;
      cy.wrap(null)
        .then(
          () => Client.create(senderWallet, { env: "dev" }), // Returns a promise
        )
        .then((xmtp) =>
          // Now 'client' holds the result of your SDK call
          // You can continue to chain and use the client here
          xmtp.conversations.newConversation(testUserWithXmtpAccount),
        )
        .then(
          (conversation) =>
            conversation.send("hellooooo").then((message) => {
              console.log("MESSAGE", message);
            }),
          // Handle the conversation object
          // ... your code to work with conversation ...
        );

      // when clicking on accept
      // Should disappear from requests
      // when clicking on messages
      // this message should appear there
      // The modal should not appear
      // The message input should appear
    });
    it("can block a request and move it to blocked", () => {
      // when clicking on blocked
      // Should disappear from requests
      // when clicking on blocked
      // this conversation should appear there
      // and should have an option to unblock
      // The modal should not appear
      // The message input should not appear
    });
    it("can unblock a request and move it to messages", () => {
      // when clicking on blocked
      // and click on blocked
      // should see message with option to unblock
      // when clicking unblock
      // should disappear from blocked
      // when clicking messages
      // and should see that message
      // the modal should not appear
      // the message input should appear
    });
  },
);
