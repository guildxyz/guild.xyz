"use client";

import { RequirementDisplayComponent } from "@/components/requirements/RequirementDisplayComponent";
import { rewardCards } from "@/components/rewards/rewardCards";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useMeasure } from "@/hooks/useMeasure";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/cssUtils";
import { fetchGuildApiData } from "@/lib/fetchGuildApi";
import type { GuildReward, GuildRewardType } from "@/lib/schemas/guildReward";
import type { Role } from "@/lib/schemas/role";
import {
  ArrowDown,
  Check,
  ImageSquare,
  LockSimple,
} from "@phosphor-icons/react/dist/ssr";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { Suspense } from "react";
import { joinModalAtom } from "../atoms";
import { useGuild } from "../hooks/useGuild";
import { useSuspenseRoles } from "../hooks/useSuspenseRoles";

const GuildPage = () => {
  const { data: roles } = useSuspenseRoles();

  return (
    <div className="my-4 space-y-4">
      {roles.map((role) => (
        <Suspense
          fallback={<Skeleton className="h-40 w-full rounded-xl" />}
          key={role.id}
        >
          <RoleCard role={role} />
        </Suspense>
      ))}
    </div>
  );
};

const RoleCard = ({ role }: { role: Role }) => (
  <Card className="grid md:grid-cols-2" key={role.id}>
    <div className="@container flex flex-col border-r md:min-h-[22rem]">
      <div className="flex items-center gap-3 p-5">
        {role.imageUrl ? (
          <img
            className="size-14 rounded-full border"
            src={role.imageUrl}
            alt="role avatar"
          />
        ) : (
          <div className="flex size-14 items-center justify-center rounded-full bg-image text-white">
            <ImageSquare weight="duotone" className="size-6" />
          </div>
        )}
        <h3 className="font-extrabold text-xl">{role.name}</h3>
      </div>

      <RoleDescription role={role} />

      <Suspense fallback={<p>Loading rewards...</p>}>
        <RoleRewards roleId={role.id} roleRewards={role.rewards} />
      </Suspense>
    </div>

    <div className="relative mb-8 flex flex-col bg-card-secondary sm:mb-0">
      <div className="flex items-center justify-between p-5">
        <span className="font-bold text-foreground-secondary text-xs uppercase md:hidden lg:inline">
          Requirements
        </span>

        <AccessIndicator
          roleId={role.id}
          className="-bottom-8 absolute left-0 sm:relative sm:bottom-0"
        />
      </div>

      {/* TODO group rules by access groups */}
      <ScrollArea
        className={cn(
          "scroll-shadow relative flex w-full flex-grow basis-80 flex-col overflow-y-auto md:basis-0",
          {
            // "basis-full": (requirements?.length ?? 0) < 3,
            "basis-full": true,
          },
        )}
      >
        <div className="grid px-5 pb-5">
          {role.accessGroups[0].rules?.map((rule) => (
            <RequirementDisplayComponent
              key={rule.accessRuleId}
              requirement={rule}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  </Card>
);

const MAX_INITIAL_DESCRIPTION_HEIGHT_WITH_REWARDS = 192; // 12rem
const MAX_INITIAL_DESCRIPTION_HEIGHT = 260; // 16.25rem (22rem - 92px, the height of the role card's header)
const RoleDescription = ({ role }: { role: Role }) => {
  const maxDescriptionHeight =
    role.rewards?.length > 0
      ? MAX_INITIAL_DESCRIPTION_HEIGHT_WITH_REWARDS
      : MAX_INITIAL_DESCRIPTION_HEIGHT;

  const { ref, bounds } = useMeasure<HTMLDivElement>();

  const shouldShowViewMoreButton =
    !!bounds && bounds.height > maxDescriptionHeight;

  const { isOpen, onToggle } = useDisclosure();

  return (
    <div
      className="group relative overflow-hidden px-5 pb-4 text-foreground-dimmed leading-relaxed transition-all"
      style={
        shouldShowViewMoreButton
          ? {
              // + 16 is pb-4 (1rem)
              height: isOpen ? bounds.height + 16 : maxDescriptionHeight,
              maxHeight: "none",
            }
          : {
              // Defining an initial max height to avoid a jump on initial load
              maxHeight: maxDescriptionHeight,
            }
      }
    >
      <p ref={ref}>{role.description}</p>

      {shouldShowViewMoreButton && (
        <div
          className={cn(
            "absolute bottom-0 left-0 flex w-full justify-center break-words bg-gradient-to-t from-black/10 to-transparent pb-2 transition-colors dark:from-black/25",
            {
              "from-transparent dark:from-transparent": isOpen,
            },
          )}
        >
          <Card className="opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="xs"
              onClick={() => onToggle()}
              rightIcon={
                <ArrowDown
                  weight="bold"
                  className={cn({
                    "-rotate-180": isOpen,
                  })}
                />
              }
            >
              {isOpen ? "Collapse" : "Click to expand"}
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

const RoleRewards = ({
  roleId,
  roleRewards,
}: { roleId: string; roleRewards: Role["rewards"] }) => {
  const { data: guild } = useGuild();
  const { data: rewards } = useSuspenseQuery<GuildReward[]>({
    queryKey: ["reward", "search", guild.id],
    queryFn: () =>
      fetchGuildApiData<{ items: GuildReward[] }>(
        `reward/search?customQuery=@guildId:{${guild.id}}`,
      ).then((data) => data.items), // TODO: we shouldn't do this, we should just get back an array on this endpoint in my opinion
  });

  return roleRewards?.length > 0 && rewards?.length > 0 ? (
    <div className="mt-auto grid @[26rem]:grid-cols-2 gap-2 p-5">
      {roleRewards.map((roleReward) => {
        const guildReward = rewards.find((gr) => gr.id === roleReward.rewardId);
        if (!guildReward) return null;

        const hasRewardCard = (
          rewardType: GuildRewardType,
        ): rewardType is keyof typeof rewardCards => rewardType in rewardCards;

        const RewardCard = hasRewardCard(guildReward.type)
          ? rewardCards[guildReward.type]
          : null;

        if (!RewardCard) return null;

        return (
          <RewardCard
            key={roleReward.rewardId}
            roleId={roleId}
            reward={{
              guildReward,
              roleReward,
            }}
          />
        );
      })}
    </div>
  ) : null;
};

// TODO: handle state during join & error/no access states too
const ACCESS_INDICATOR_CLASS =
  "rounded-b-2xl rounded-t-none min-w-full justify-between sm:rounded-b-xl sm:rounded-t-xl sm:min-w-max h-8 shrink-0 ml-auto";
const AccessIndicator = ({
  roleId,
  className,
}: { roleId: Role["id"]; className?: string }) => {
  const { data: guild } = useGuild();

  const { data: user } = useUser();
  const isGuildMember = user?.guilds?.find((g) => g.guildId === guild.id);
  const isRoleMember = !!user?.guilds
    ?.flatMap((g) => g.roles)
    ?.find((r) => r?.roleId === roleId);

  const onJoinModalOpenChange = useSetAtom(joinModalAtom);

  if (!isGuildMember)
    return (
      <Button
        size="sm"
        leftIcon={<LockSimple weight="bold" />}
        className={cn(ACCESS_INDICATOR_CLASS, className)}
        onClick={() => onJoinModalOpenChange(true)}
      >
        Join guild to collect rewards
      </Button>
    );

  if (!isRoleMember)
    return (
      <Button
        size="sm"
        leftIcon={<LockSimple weight="bold" />}
        className={cn(ACCESS_INDICATOR_CLASS, className)}
        onClick={() => onJoinModalOpenChange(true)}
      >
        Check access to collect rewards
      </Button>
    );

  return (
    <Badge
      className={buttonVariants({
        size: "sm",
        colorScheme: "success",
        variant: "subtle",
        className: [ACCESS_INDICATOR_CLASS, className, "pointer-events-none"],
      })}
    >
      <Check weight="bold" />
      <span>You have access</span>
    </Badge>
  );
};

export default GuildPage;
