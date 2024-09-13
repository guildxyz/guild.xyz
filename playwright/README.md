# E2E tests

We use Playwright for E2E testing. When running our tests, we create a viem [Test Client](https://viem.sh/docs/clients/test#test-client), pass it to the `wagmiConfig` & use the [Mock connector](https://wagmi.sh/core/api/connectors/mock) in order to connect to Guild. Before running the tests, we spin up an Anvil node, so we can use it for reproducible onchain interactions (see the `webServer` property in `playwright.config.ts`).

## Prerequisites & running the tests

1. Get the necessary environment variables (`NEXT_PUBLIC_E2E_WALLET_MNEMONIC`, `ANVIL_FORK_URL` & `ANVIL_FORK_KEY`) from our 1Password vault.
2. Install Anvil: 
```sh
curl -L https://foundry.paradigm.xyz | bash
foundryup
```
3. Either run the frontend in dev mode (`npm run dev`) or build it (`npm run build`) and run the tests. You can pick between several different modes, e.g. `npm run test` will just run the tests and print the output, `npm run test:ui` will open the Playwright runner, where you can see the console, network tab, etc., and `npm run test:debug` will open a Chromium browser where you can inspect the page during the test.

## Writing tests

If you haven't used Playwright before, you can read the basics on [playwright.dev](https://playwright.dev/docs/writing-tests).

We write 2 type of tests: unauthenticated and authenticated. For the former, there aren't any special requirements, you can use Playwright as is. For the former, you should use the custom `test` function which we export from `/playwright/fixtures.ts`. It reads the authentication data from a JSON file instead of clicking on the sign in and verify button on our UI, that way the tests run much faster.