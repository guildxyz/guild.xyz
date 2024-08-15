import { FunctionComponent } from "react"
import { SUBSCRIPTIONS } from "./constants"

export type ChainAction = "next" | "previous"
export interface ChainData {
  chosenSubscription: (typeof SUBSCRIPTIONS)[number]
}
export type DispatchChainAction = (args: {
  action: ChainAction
  data?: Partial<ChainData>
}) => void

export type OnboardingChain = FunctionComponent<{
  dispatchChainAction: DispatchChainAction
  chainData: Partial<ChainData>
}>
