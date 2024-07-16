import { FuelWalletConnector, FueletWalletConnector } from "@fuels/connectors"
import { FuelConfig } from "fuels"

export const fuelConfig: FuelConfig = {
  connectors: [new FuelWalletConnector(), new FueletWalletConnector()],
}
