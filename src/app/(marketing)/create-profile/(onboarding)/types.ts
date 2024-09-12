import { Schemas } from "@guildxyz/types"
import { FunctionComponent } from "react"
import { SUBSCRIPTIONS } from "./constants"

export type CreateProfileAction = "next" | "previous"

export interface CreateProfileData {
  chosenSubscription: (typeof SUBSCRIPTIONS)[number]
  referrerProfile: Schemas["Profile"]
  createdProfile: Schemas["Profile"]
  subscription: boolean
}
export type DispatchAction = (args: {
  action: CreateProfileAction
  data?: Partial<CreateProfileData>
}) => void

export type CreateProfileStep = FunctionComponent<{
  dispatchAction: DispatchAction
  data: Partial<CreateProfileData>
}>
