import type { PlatformName, Requirement } from "@guildxyz/types"
import type { GuildPlatformWithOptionalId, RoleFormType } from "types"
import type { ThemingProps } from "@chakra-ui/react"
import type { RewardProps } from "components/[guild]/RoleCard/components/Reward"
import type {
  IconProps,
} from "phosphor-react"
import type {
  ComponentType,
  ForwardRefExoticComponent,
  PropsWithChildren,
  RefAttributes
} from "react"

export type CardSettingsComponent = () => JSX.Element

export enum PlatformAsRewardRestrictions {
  /** @example Twitter */
  NOT_APPLICABLE,
  /** @example Telegram */
  SINGLE_ROLE,
  /** @example Discord */
  MULTIPLE_ROLES,
}

export type RewardData = {
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
  imageUrl?: string
  name: string
  colorScheme: ThemingProps["colorScheme"]
  gatedEntity: string
  cardPropsHook?: CardPropsHook
  /** true when the AddRewardPanel just automatically adds the platform without any user input */
  autoRewardSetup?: boolean
  cardSettingsComponent?: CardSettingsComponent
  cardMenuComponent?: (props) => JSX.Element
  cardWarningComponent?: (props) => JSX.Element
  cardButton?: (props) => JSX.Element
  AddRewardPanel?: ComponentType<AddRewardPanelProps>
  RewardPreview?: ComponentType<PropsWithChildren<unknown>>
  RoleCardComponent?: ComponentType<RewardProps>
  isPlatform?: boolean
  asRewardRestriction: PlatformAsRewardRestrictions
}

// TODO: exclude extended union types and sync externally
type ExtendedPlatformName = PlatformName | "EMAIL"

export type Rewards = Readonly<Record<ExtendedPlatformName, RewardData>>

export type AddRewardPanelProps = {
  onAdd: (
    data: RoleFormType["rolePlatforms"][number] & {
      requirements?: Requirement[]
      roleName?: string
    }
  ) => void
  skipSettings?: boolean
}

export type CardPropsHook = (guildPlatform: GuildPlatformWithOptionalId) => {
  type: ExtendedPlatformName
  name: string
  image?: string | JSX.Element
  info?: string | JSX.Element
  link?: string
  shouldHide?: boolean
}
