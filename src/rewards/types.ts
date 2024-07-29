import type { ThemingProps } from "@chakra-ui/react"
import type { IconProps } from "@phosphor-icons/react"
import type { RewardProps } from "components/[guild]/RoleCard/components/types"
import type {
  ComponentType,
  ForwardRefExoticComponent,
  PropsWithChildren,
  RefAttributes,
} from "react"
import type {
  GuildPlatformWithOptionalId,
  PlatformName,
  Requirement,
  RoleFormType,
} from "types"

export enum PlatformAsRewardRestrictions {
  /**
   * @example
   *   Twitter
   */
  NOT_APPLICABLE,
  /**
   * @example
   *   Telegram
   */
  SINGLE_ROLE,
  /**
   * @example
   *   Discord
   */
  MULTIPLE_ROLES,
}

export type RewardData = {
  icon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
  imageUrl?: string
  name: string
  colorScheme: ThemingProps["colorScheme"]
  gatedEntity: string
  /**
   * True when the AddRewardPanel just automatically adds the platform without any
   * user input
   */
  autoRewardSetup: boolean
  isPlatform: boolean
  asRewardRestriction: PlatformAsRewardRestrictions
}

export type RewardComponentsData = {
  cardPropsHook?: CardPropsHook
  cardSettingsComponent?: CardSettings
  cardMenuComponent?: (props: any) => JSX.Element
  cardWarningComponent?: (props: any) => JSX.Element
  cardButton?: (props: any) => JSX.Element
  AddRewardPanel?: ComponentType<AddRewardPanelProps>
  // RewardPreview?: ComponentType<PropsWithChildren>
  RoleCardComponent?: ComponentType<RewardProps>
}

export type CardSettings = () => JSX.Element
export type RewardPreview = ComponentType<PropsWithChildren>
export type AddRewardPanel = ComponentType<AddRewardPanelProps>
export type RoleCard = ComponentType<RewardProps>
// TODO: refactor so that props are properly typed out
export type CardMenu = (props: any) => JSX.Element
export type CardWarning = (props: any) => JSX.Element
export type CardButton = (props: any) => JSX.Element

export type RewardComponentMap<T> = Readonly<Partial<Record<PlatformName, T>>>

export type Rewards = Readonly<Record<PlatformName, RewardData>>
export type RewardComponents = Readonly<Record<PlatformName, RewardComponentsData>>

export type AddRewardPanelProps = {
  onAdd: (
    data: NonNullable<RoleFormType["rolePlatforms"]>[number] & {
      requirements?: Requirement[]
      roleName?: string
    }
  ) => void
  onCancel?: () => void
  skipSettings?: boolean
}

export type CardPropsHook = (guildPlatform: GuildPlatformWithOptionalId) => {
  type: PlatformName
  name: string
  image?: string | JSX.Element
  info?: string | JSX.Element
  link?: string
  shouldHide?: boolean
}
