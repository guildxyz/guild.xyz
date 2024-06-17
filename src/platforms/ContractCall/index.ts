import { PlatformAsRewardRestrictions, Rewards } from "platforms/types"
import useContractCallCardProps from "./useContractCallCardProps"
import ContractCallRewardCardButton from "./ContractCallRewardCardButton"
import ContractCallCardMenu from "./ContractCallCardMenu"
import dynamicComponents from "./DynamicComponents"
import Photo from "static/icons/photo.svg"

const { AddRewardPanel, RewardPreview, RoleCardComponent } = dynamicComponents

const rewards = {
  CONTRACT_CALL: {
    icon: Photo,
    name: "NFT",
    colorScheme: "cyan",
    gatedEntity: "",
    cardPropsHook: useContractCallCardProps,
    cardButton: ContractCallRewardCardButton,
    cardMenuComponent: ContractCallCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    AddRewardPanel,
    RewardPreview,
    RoleCardComponent,
  },
} as const satisfies Partial<Rewards>

export default rewards
