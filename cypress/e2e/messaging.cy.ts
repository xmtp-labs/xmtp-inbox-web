import {
  startDemoEnv,
  sendAndEnterMessage,
  checkElement,
  checkMissingElement,
  TIMEOUT,
} from "../test_utils";

describe(
  "Messaging Test Cases",
  {
    retries: {
      runMode: 2,
      openMode: 1,
    },
  },
  () => {
    beforeEach(() => {
      startDemoEnv();
      // In connected flow, empty message should render before any tests run
      checkElement("empty-message-header");
      checkElement("empty-message-cta").click();
    });
    const testUserWithXmtpAccount =
      "0x78BfD39428C32Be149892d64bEE6C6f90aedEec1";

    const shortMessage = "hello";
    const longMessage =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et ultrices neque ornare aenean euismod elementum. Etiam tempor orci eu lobortis elementum nibh. Tincidunt ornare massa eget egestas purus. Purus sit amet volutpat consequat mauris. Arcu felis bibendum ut tristique et egestas quis ipsum suspendisse. Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit. Neque ornare aenean euismod elementum nisi quis eleifend. Amet consectetur adipiscing elit pellentesque habitant morbi. Malesuada fames ac turpis egestas sed tempus urna. Morbi quis commodo odio aenean sed adipiscing diam donec. Id aliquet risus feugiat in. Massa sed elementum tempus egestas sed. Lectus mauris ultrices eros in cursus turpis massa tincidunt. Massa id neque aliquam vestibulum morbi blandit cursus risus at. Cursus eget nunc scelerisque viverra mauris in aliquam. Enim sed faucibus turpis in eu mi bibendum neque egestas. Lectus urna duis convallis convallis tellus id. Vitae semper quis lectus nulla at.";

    it("Can send a new message to user in XMTP network", () => {
      sendAndEnterMessage(testUserWithXmtpAccount, shortMessage, 1);
    });

    it("Can send a long message to user in XMTP network", () => {
      sendAndEnterMessage(testUserWithXmtpAccount, longMessage, 1);
    });

    it("Can send multiple messages to user in XMTP network", () => {
      sendAndEnterMessage(testUserWithXmtpAccount, shortMessage, 6);
    });

    it("Displays messages in the correct order", () => {
      sendAndEnterMessage(testUserWithXmtpAccount, shortMessage, 6, true);
    });

    it("Does not allow address to be edited", () => {
      sendAndEnterMessage(testUserWithXmtpAccount, shortMessage, 1);
      checkMissingElement("message-to-input");
      checkElement("recipient-wallet-address").should(
        "have.text",
        testUserWithXmtpAccount,
      );
    });

    it("Renders error message when sending message to existing user outside of XMTP network", () => {
      checkElement("message-to-input").type("invalidUser").click();
      cy.get(`[data-testid=message-to-subtext]`, { timeout: TIMEOUT }).should(
        "have.text",
        "Please enter a valid wallet address",
      );
    });
  },
);
