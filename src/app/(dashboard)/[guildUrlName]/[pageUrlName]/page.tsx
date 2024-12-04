import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { fetchGuildApiData } from "@/lib/fetchGuildApi";
import type { DynamicRoute } from "@/lib/types";
import type { Schemas } from "@guildxyz/types";
import { Lock } from "@phosphor-icons/react/dist/ssr";

const GuildPage = async ({
  params,
}: DynamicRoute<{ pageUrlName: string; guildUrlName: string }>) => {
  const { pageUrlName, guildUrlName } = await params;
  const guild = await fetchGuildApiData<Schemas["Guild"]>(
    `guild/urlName/${guildUrlName}`,
  );
  const pages = await fetchGuildApiData<Schemas["Page"][]>("page/batch", {
    method: "POST",
    body: JSON.stringify({ ids: guild.pages?.map((p) => p.pageId!) ?? [] }),
  });
  const page = pages.find((p) => p.urlName === pageUrlName)!;
  const roles = await fetchGuildApiData<Schemas["Role"][]>("role/batch", {
    method: "POST",
    body: JSON.stringify({
      ids: page.roles?.map((r) => r.roleId!) ?? [],
    }),
  });

  return (
    <div className="my-4 space-y-4">
      {roles.map((role) => (
        <RoleCard role={role} key={role.id} />
      ))}
    </div>
  );
};

const RoleCard = async ({ role }: { role: Schemas["Role"] }) => {
  const rewards = await fetchGuildApiData<Schemas["Reward"][]>("reward/batch", {
    method: "POST",
    body: JSON.stringify({
      ids: role.rewards?.map((r) => r.rewardId!) ?? [],
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

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
