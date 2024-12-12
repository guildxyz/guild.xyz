import type { IdentityType } from "@/lib/schemas/identity";
import type { Icon } from "@phosphor-icons/react/dist/lib/types";
import { DiscordLogo } from "@phosphor-icons/react/dist/ssr";

export const IDENTITY_STYLES = {
  DISCORD: {
    bgColorClassName: "bg-indigo-500",
    borderColorClassName: "border-indigo-500",
    buttonColorsClassName:
      "[--button-bg:theme(colors.indigo.500)] [--button-bg-hover:theme(colors.indigo.600)] [--button-bg-active:theme(colors.indigo.700)] dark:[--button-bg-hover:theme(colors.indigo.400)] dark:[--button-bg-active:theme(colors.indigo.300)]",
    icon: DiscordLogo,
  },
} satisfies Record<
  IdentityType,
  {
    bgColorClassName: string;
    borderColorClassName: string;
    buttonColorsClassName: string;
    icon: Icon;
  }
>;
