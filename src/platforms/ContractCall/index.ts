import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import useContractCallCardProps from "./useContractCallCardProps"
import ContractCallRewardCardButton from "./ContractCallRewardCardButton"
import ContractCallCardMenu from "./ContractCallCardMenu"
import dynamicComponents from "./DynamicComponents"
import Photo from "static/icons/photo.svg"

export default {
  icon: Photo,
  name: "NFT",
  colorScheme: "cyan",
  gatedEntity: "",
  cardPropsHook: useContractCallCardProps,
  cardButton: ContractCallRewardCardButton,
  cardMenuComponent: ContractCallCardMenu,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
  ...dynamicComponents,
} as const satisfies RewardData
