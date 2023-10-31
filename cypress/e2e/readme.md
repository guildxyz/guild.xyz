# E2E testing with Cypress

We use [Cypress](https://www.cypress.io/) for testing. The setup is quite simple, anyone can start writing tests easily.

### Writing tests

You should put the `*.spec.ts` files in the `/cypress/e2e` folder. The folder structure is not well defined here, so feel free to change it. Currently there is a `0-guild` folder with the (platformless) guild related tests, a `1-roles-requirements-rewards` folder with the role/requirement related tests, and a `2-guild-checkout` folder with Payment, Guild Pin, and NFT reward related ones.

It is recommended to start each test by removing data from indexedDB & connecting the mock wallet to the app, like so:

```ts
before(() => {
  cy.cleanIndexedDB()
  cy.connectWallet()
})
```

Then, you can write the actual test. The official [Cypress guide](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test) is a great starting point, it contains most of the resources you'll need to write E2E tests.

### Custom commands

Sometimes you can find yourself in a situation where you start repeating yourself. In this case, you can create a custom command within the `/cypress/support/commands.ts` file. We already have a couple of custom commands, like `getByDataTest`, `connectWallet`, and `cleanIndexedDB`.

### How to use selectors

You should try to be as specific as possible when using the `cy.get()` command. In some cases, you might not be able to select the specific element you want just by using an ID or class - in that case, feel free to add a `data-test` HTML attribute to the element and use the custom `getByDataTest` command in your tests. Here's an example:

```html
<button data-test="my-awesome-button">Click me!</button>
```

```ts
cy.getByDataTest("my-awesome-button").click()
```

### Mocking data

Although we (should) try to use real data in our tests, sometimes we can't avoid mocking API responses. You can define the mocked data in JSON files inside the `/cypress/fixtures` directory, and then use it in your tests using `cy.intercept` a:

```ts
// Intercept an API call
cy.intercept(`${Cypress.env("guildApiUrl")}/some/endpoint`, {
  statusCode: 200,
  fixture: "someData.json",
}).as("mockedData")

// Wait for the intercepted response
cy.wait("@mockedData")
```

You can find more details about this topic in the official Cypress docs: [fixture](https://docs.cypress.io/api/commands/fixture#docusaurus_skipToContent_fallback), [intercept](https://docs.cypress.io/api/commands/intercept#docusaurus_skipToContent_fallback)

### Running Cypress locally

You can open Cypress UI using the `npm run cypress:open` command. Make sure to set the `NEXT_PUBLIC_MOCK_CONNECTOR` env var to `true` & also define the `NEXT_PUBLIC_E2E_WALLET_MNEMONIC` env var (you can find its value in our 1Password). If you'd just like to run tests in headless mode, you can use the `npm run test` command.

### GitHub Action

There's a GitHub Action for running the tests. It'll run when we push a commit to `main`, or when we open a pull request.
