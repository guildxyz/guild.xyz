import { useGuild } from "@/app/(dashboard)/[guildUrlName]/hooks/useGuild";
import { IDENTITY_STYLES } from "@/config/constants";
import { cn } from "@/lib/cssUtils";
import { env } from "@/lib/env";
import { userOptions } from "@/lib/options";
import type { GuildReward } from "@/lib/schemas/guildReward";
import { IDENTITY_NAME } from "@/lib/schemas/identity";
import { DiscordRoleRewardDataSchema } from "@/lib/schemas/roleReward";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { FunctionComponent } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "../ui/Tooltip";
import { RewardCard, RewardCardButton } from "./RewardCard";
import type { RewardCardProps } from "./types";

export const DiscordRewardCard: FunctionComponent<RewardCardProps> = ({
  roleId,
  reward,
}) => {
  const router = useRouter();
  const {
    data: { imageUrl, invite },
  } = reward.guildReward as Extract<GuildReward, { type: "DISCORD" }>;
  const roleRewardData = DiscordRoleRewardDataSchema.parse(
    reward.roleReward.data,
  );

  const Icon = IDENTITY_STYLES.DISCORD.icon;

  const { data: user } = useQuery(userOptions());
  const connected = !!user?.identities?.find((i) => i.platform === "DISCORD");

  const {
    data: { id: guildId },
  } = useGuild();

  const isGuildMember = !!user?.guilds?.find((g) => g.guildId === guildId);

  const hasRoleAccess = !!user?.guilds
    ?.flatMap((g) => g.roles)
    ?.find((r) => r?.roleId === roleId);
  return (
    <RewardCard
      title="Get role"
      description={roleRewardData.roleId}
      image={imageUrl ?? <Icon className="size-4" weight="fill" />}
      className={IDENTITY_STYLES.DISCORD.borderColorClassName}
    >
      {!user || !isGuildMember || !hasRoleAccess ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <RewardCardButton
              rightIcon={<ArrowSquareOut weight="bold" />}
              className={cn(
                IDENTITY_STYLES.DISCORD.buttonColorsClassName,
                "![--button-bg-hover:var(--button-bg)] ![--button-bg-active:var(--button-bg)] cursor-not-allowed opacity-50",
              )}
            >
              Go to server
            </RewardCardButton>
          </TooltipTrigger>

          <TooltipPortal>
            <TooltipContent>
              <p>
                {!user
                  ? "Sign in to proceed"
                  : !isGuildMember
                    ? "Join guild to check access"
                    : "Check access to get reward"}
              </p>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      ) : connected ? (
        <RewardCardButton
          rightIcon={<ArrowSquareOut weight="bold" />}
          className={IDENTITY_STYLES.DISCORD.buttonColorsClassName}
          onClick={() => router.push(`https://discord.gg/${invite}`)}
        >
          Go to server
        </RewardCardButton>
      ) : (
        <RewardCardButton
          className={IDENTITY_STYLES.DISCORD.buttonColorsClassName}
          onClick={
            user
              ? () =>
                  router.push(
                    `${env.NEXT_PUBLIC_API}/connect/DISCORD?returnTo=${window.location.href}`,
                  )
              : undefined
          }
        >
          {`Connect ${IDENTITY_NAME.DISCORD}`}
        </RewardCardButton>
      )}
    </RewardCard>
  );
};
