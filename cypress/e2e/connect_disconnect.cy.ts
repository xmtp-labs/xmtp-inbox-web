import {
  checkElement,
  disconnectWallet,
  startDemoEnv,
  checkLink,
  checkMissingElement,
} from "../test_utils";

describe(
  "Connected Test Cases",
  {
    retries: {
      runMode: 2,
      openMode: 1,
    },
  },
  () => {
    beforeEach(() => {
      startDemoEnv();
      // // In connected flow, empty message should render before any tests run
      checkElement("empty-message-header");
    });

    it("Shows expected left panel fields when logged in with a connected wallet and no existing messages", () => {
      const elements = [
        "avatar",
        "messages-icon",
        "gallery-icon",
        "settings-icon",
        "collapse-icon",
        "icon",
        "conversation-list-header",
        "new-message-icon-cta",
        "empty-message-icon",
        "empty-message-header",
        "empty-message-subheader",
        "empty-message-cta",
      ];

      elements.forEach((element) => checkElement(element));
    });

    it("Shows expected right panel fields when logged in with a connected wallet and no existing messages", () => {
      const elements = [
        "learn-more-header",
        "get-started-header",
        "message-section-link",
        "message-icon",
        "message-header",
        "message-subheader",
        "message-arrow",
        "community-section-link",
        "community-icon",
        "community-header",
        "community-subheader",
        "community-arrow",
        "docs-section-link",
        "docs-icon",
        "docs-header",
        "docs-subheader",
        "docs-arrow",
        "xmtp-version",
      ];

      elements.forEach((element) => checkElement(element));
    });

    it("Directs user to expected links", () => {
      const elementsWithCtas = [
        {
          testId: "docs-section-link",
          link: "https://docs.xmtp.org",
        },
        {
          testId: "community-section-link",
          link: "https://community.xmtp.org",
        },
      ];
      elementsWithCtas.forEach((element) =>
        checkLink(element.testId, element.link),
      );
    });

    it("Shows expected fields when expanding side nav while connected", () => {
      cy.get(`[data-testid="collapse-icon"]`).click();

      const elements = [
        "Messages",
        "Gallery",
        "Settings",
        "Collapse",
        "wallet-address",
        "disconnect-wallet-cta",
      ];
      elements.forEach((element) => checkElement(element));

      cy.get(`[data-testid="disconnect-wallet-cta"]`).click();
      checkElement("no-wallet-connected-header");
    });
    it("Opens new message view when clicking on connect button from left panel", () => {
      checkMissingElement("message-input");
      checkElement("empty-message-cta").click();
      checkElement("message-input");
    });
    it("Opens new message view when clicking on plus icon from left panel", () => {
      checkMissingElement("message-input");
      checkElement("new-message-icon-cta").click();
      checkElement("message-input");
    });
    it("Opens new message view when clicking on new message section within learn more", () => {
      checkMissingElement("message-input");
      checkElement("message-section-link").click();
      checkElement("message-input");
    });
    it("Should show conversation list instead of empty message as soon as user enters something into the input", () => {
      checkElement("empty-message-header");
      checkMissingElement("message-input");
      checkElement("message-section-link").click();
      checkElement("message-to-input").type("a");
      checkMissingElement("empty-message-header");
      cy.get(`[data-testid=conversations-list-panel]`)
        .children()
        .should("have.length", 1);
    });
  },
);

describe("Disconnected Test Cases", () => {
  beforeEach(() => {
    startDemoEnv();
    checkElement("empty-message-header");
    disconnectWallet();
  });
  it("Shows expected fields when disconnected from a wallet", () => {
    const elements = [
      "xmtp-logo",
      "no-wallet-connected-header",
      "no-wallet-connected-subheader",
      "no-wallet-connected-cta",
      "no-wallet-connected-subtext",
    ];

    elements.forEach((element) => checkElement(element));
  });
});
