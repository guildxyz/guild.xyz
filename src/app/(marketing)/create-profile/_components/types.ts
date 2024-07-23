import { ReactNode } from "react"

export type ChainAction = "next" | "previous"

export type OnboardingChain = (props: {
  dispatchChainAction: (action: ChainAction) => void
}) => ReactNode
