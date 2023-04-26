declare namespace Cypress {
  interface Chainable {
    getByDataTest(selector: string): Chainable<JQuery<HTMLElement>>
    connectWallet(): Chainable<any>
  }
}
