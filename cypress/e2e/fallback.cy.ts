export {}; // makes this file a module so the helpers below stay local
// Checks the page-agent fallback: a page with too little text for the main-text extractor.
// Runs the real extension build in a real browser. The model is the scripted mock.
const DEMO = "http://localhost:8789";
const panel = () => cy.get("#cts-root").shadow();

describe("page-agent fallback", () => {
  it("reads a short page through PageController and still verifies the quote", () => {
    cy.visit(`${DEMO}/terms-short.html`);
    panel().find("#cts-open").click();
    panel().find("#cts-analyse").click();
    panel().find("#score", { timeout: 20000 }).should("be.visible");
    panel().find("#findings li.finding").should("have.length", 1);
    panel().find("#findings blockquote").should("contain.text", "We do not give refunds or credits after you pay.");
    cy.task<string>("lastLlmRequest").then((body) => {
      expect(body).to.contain("Tiny Notes Terms");
      // PageController marks links with an index like [0]<a ...>. Our own extractor writes plain text,
      // so this pattern only appears when the page-agent fallback produced the text.
      expect(body).to.match(/\[\d+\]<a /);
    });
  });
});
