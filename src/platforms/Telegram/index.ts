import { TelegramLogo } from "phosphor-react";
import { PlatformAsRewardRestrictions, Rewards } from "platforms/types";
import useTelegramCardProps from "./useTelegramCardProps";
import TelegramCardMenu from "./TelegramCardMenu";
import { AddRewardPanel } from "./AddRewardPanel";
import { RewardPreview } from "./RewardPreview";

const rewards = {
  TELEGRAM: {
    icon: TelegramLogo,
    imageUrl: "/platforms/telegram.png",
    name: "Telegram",
    colorScheme: "TELEGRAM",
    gatedEntity: "group",
    cardPropsHook: useTelegramCardProps,
    cardMenuComponent: TelegramCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    AddRewardPanel,
    RewardPreview,
    isPlatform: true,
  }
} as const as Partial<Rewards>

export default rewards
