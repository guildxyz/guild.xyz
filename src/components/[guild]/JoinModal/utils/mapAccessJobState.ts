import type { JoinJob } from "@guildxyz/types"

const groupBy = <Entity, By extends keyof Entity>(entities: Entity[], by: By) =>
  entities.reduce<Record<string, Entity[]>>((grouped, entity) => {
    const key = `${entity[by]}`
    // eslint-disable-next-line no-param-reassign
    grouped[key] ||= []
    grouped[key].push(entity)
    return grouped
  }, {})

// explanation of the response statuses: https://discord.com/channels/697041998728659035/1100897398454222982/1197523089441955900
const mapAccessJobState = (progress: JoinJob) => {
  if (!progress) {
    return {
      state: "INITIAL",
    } as const
  }

  const state =
    progress?.roleAccesses && progress?.roleAccesses?.every((role) => !role.access)
      ? "NO_ACCESS"
      : progress.done
      ? "FINISHED"
      : (
          {
            none: "PREPARING",
            "access-preparation": "CHECKING",
            "access-check": "MANAGING_ROLES",
            "access-logic": "MANAGING_ROLES",
          } as const
        )[progress["completed-queue"] ?? "none"] ?? "MANAGING_REWARDS"

  const waitingPosition =
    (progress as any).currentQueueState === "waiting"
      ? (progress as any).position
      : null

  const requirements = progress["children:access-check:jobs"]
    ? {
        all: progress["children:access-check:jobs"]?.length,
        satisfied: progress["children:access-check:jobs"]?.filter(
          (req) => req?.access
        )?.length,
        checked: progress["children:access-check:jobs"]?.filter((req) => req?.done)
          ?.length,
      }
    : null

  const roles =
    progress.roleIds && progress.updateMembershipResult
      ? {
          all: progress.roleIds?.length,
          granted: progress.updateMembershipResult?.membershipRoleIds?.length,
        }
      : null

  const rewardsGroupedByPlatforms = progress["children:manage-reward:jobs"]
    ? groupBy(progress["children:manage-reward:jobs"], "flowName")
    : null

  const rewards = rewardsGroupedByPlatforms
    ? {
        all: Object.keys(rewardsGroupedByPlatforms).length,
        granted: Object.values(rewardsGroupedByPlatforms).filter((rewardResults) =>
          rewardResults.every((rewardResult) => rewardResult.success)
        ).length,
      }
    : null

  return {
    state,
    waitingPosition,
    requirements,
    roles,
    rewards,
  } as const
}

export type JoinState = ReturnType<typeof mapAccessJobState>

export default mapAccessJobState
