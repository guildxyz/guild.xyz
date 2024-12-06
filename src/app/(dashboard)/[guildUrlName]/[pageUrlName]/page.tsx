"use client";

import { RequirementDisplayComponent } from "@/components/requirements/RequirementDisplayComponent";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Skeleton } from "@/components/ui/Skeleton";
import { rewardBatchOptions, roleBatchOptions } from "@/lib/options";
import type { Schemas } from "@guildxyz/types";
import { Lock } from "@phosphor-icons/react/dist/ssr";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Suspense } from "react";

const GuildPage = () => {
  const { pageUrlName, guildUrlName } = useParams<{
    pageUrlName: string;
    guildUrlName: string;
  }>();
  const { data: roles } = useSuspenseQuery(
    roleBatchOptions({
      guildIdLike: guildUrlName,
      pageIdLike: pageUrlName,
    }),
  );

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

const RoleCard = ({ role }: { role: Schemas["Role"] }) => {
  const { data: rewards } = useSuspenseQuery(
    rewardBatchOptions({ roleId: role.id }),
  );

  return (
    <Card className="flex flex-col md:flex-row" key={role.id}>
      <div className="border-r p-6 md:w-1/2">
        <div className="flex items-center gap-3">
          {role.imageUrl && (
            <img
              className="size-14 rounded-full border"
              src={role.imageUrl} // TODO: fallback image
              alt="role avatar"
            />
          )}
          <h3 className="font-bold text-xl tracking-tight">{role.name}</h3>
        </div>
        <p className="mt-4 text-foreground-dimmed leading-relaxed">
          {role.description}
        </p>
        {!!rewards.length && (
          <ScrollArea className="mt-8 h-64 rounded-lg border pr-3">
            <div className="flex flex-col gap-4">
              {rewards.map((reward) => (
                <Reward reward={reward} key={reward.id} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
      <div className="bg-card-secondary md:w-1/2">
        <div className="flex items-center justify-between p-5">
          <span className="font-bold text-foreground-secondary text-xs">
            REQUIREMENTS
          </span>
          <Button size="sm">
            <Lock />
            Join Guild to collect rewards
          </Button>
        </div>

        {/* TODO group rules by access groups */}
        <div className="grid px-5 pb-5">
          {role.accessGroups[0].rules?.map((rule) => (
            <RequirementDisplayComponent
              key={rule.accessRuleId}
              // @ts-expect-error: incomplete type
              requirement={rule}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

const Reward = ({ reward }: { reward: Schemas["Reward"] }) => {
  return (
    <div className="border-b p-4 last:border-b-0">
      <div className="mb-2 font-medium">{reward.name}</div>
      <div className="text-foreground-dimmed text-sm">{reward.description}</div>
      <pre className="mt-3 text-foreground-secondary text-xs">
        <code>{JSON.stringify(reward.permissions, null, 2)}</code>
      </pre>
    </div>
  );
};

export default GuildPage;
