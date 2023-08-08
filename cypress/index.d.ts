declare namespace Cypress {
  interface Chainable {
    getByDataTest(selector: string): Chainable<JQuery<HTMLElement>>
    connectWalletAndVerifyAccount(): Chainable<any>
    connectWallet(): Chainable<any>
  }
}
