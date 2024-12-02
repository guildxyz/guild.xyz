import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { env } from "@/lib/env";
import { fetcher } from "@/lib/fetcher";
import type { Guild } from "@/lib/schemas/guild";
import type { Role } from "@/lib/schemas/role";
import type { RoleGroup } from "@/lib/schemas/roleGroup";
import type { DynamicRoute, PaginatedResponse } from "@/lib/types";
import type { Schemas } from "@guildxyz/types";
import { Lock } from "@phosphor-icons/react/dist/ssr";

const RoleGroupPage = async ({
  params,
}: DynamicRoute<{ roleGroupUrlName: string; guildUrlName: string }>) => {
  const { roleGroupUrlName, guildUrlName } = await params;
  const guild = (await (
    await fetch(`${env.NEXT_PUBLIC_API}/guild/urlName/${guildUrlName}`)
  ).json()) as Guild;
  const paginatedRoleGroup = (await (
    await fetch(
      `${env.NEXT_PUBLIC_API}/page/search?customQuery=@guildId:{${guild.id}}&pageSize=${Number.MAX_SAFE_INTEGER}`,
    )
  ).json()) as PaginatedResponse<RoleGroup>;
  const roleGroups = paginatedRoleGroup.items;
  const roleGroup = roleGroups.find(
    // @ts-expect-error
    (rg) => rg.urlName === roleGroupUrlName || rg.id === guild.homeRoleGroupId,
  )!;
  const paginatedRole = await fetcher<PaginatedResponse<Role>>(
    `${env.NEXT_PUBLIC_API}/role/search?customQuery=@guildId:{${guild.id}}&pageSize=${Number.MAX_SAFE_INTEGER}`,
  );
  const roles = paginatedRole.items.filter((r) => r.groupId === roleGroup.id);

  return (
    <div className="my-4 space-y-4">
      {roles.map((role) => (
        <RoleCard role={role} key={role.id} />
      ))}
    </div>
  );
};

const RoleCard = async ({ role }: { role: Role }) => {
  const rewards = (await Promise.all(
    // @ts-ignore
    role.rewards?.map(({ rewardId }) => {
      const req = `${env.NEXT_PUBLIC_API}/reward/id/${rewardId}`;
      try {
        return fetcher<Schemas["RewardFull"]>(req);
      } catch {
        console.error({ rewardId, req });
      }
    }) ?? [],
  )) as Schemas["RewardFull"][];

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
      <div className="bg-card-secondary p-6 md:w-1/2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground-secondary text-xs">
            REQUIREMENTS
          </span>
          <Button size="sm">
            <Lock />
            Join Guild to collect rewards
          </Button>
        </div>
      </div>
    </Card>
  );
};

const Reward = ({ reward }: { reward: Schemas["RewardFull"] }) => {
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

export default RoleGroupPage;
