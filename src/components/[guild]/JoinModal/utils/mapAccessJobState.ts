import type { AccessCheckJob, JoinJob } from "@guildxyz/types"

// TODO: uncomment the properly typed groupBy once we fix our types in the queues package!

// const groupBy = <Entity, By extends keyof Entity>(entities: Entity[], by: By) =>
//   entities.reduce<Record<string, Entity[]>>((grouped, entity) => {
//     const key = `${entity[by]}`
//     // eslint-disable-next-line no-param-reassign
//     grouped[key] ||= []
//     grouped[key].push(entity)
//     return grouped
//   }, {})

const groupBy = (entities: any[], by: string) =>
  entities.reduce<Record<string, any[]>>((grouped, entity) => {
    const key = `${entity[by]}`
    // eslint-disable-next-line no-param-reassign
    grouped[key] ||= []
    grouped[key].push(entity)
    return grouped
  }, {})

// explanation of the response statuses: https://discord.com/channels/697041998728659035/1100897398454222982/1197523089441955900
const mapAccessJobState = (progress: JoinJob, isLoading: boolean) => {
  if (!progress || progress?.failedErrorMsg) {
    if (isLoading) return { state: "PREPARING" }

    return {
      state: "INITIAL",
    } as const
  }

  const state =
    progress?.roleAccesses?.length > 0 &&
    progress.roleAccesses.every((role) => !role.access)
      ? "NO_ACCESS"
      : progress.done
        ? "FINISHED"
        : ((
            {
              none: "PREPARING",
              "access-preparation": "CHECKING",
              "access-check": "MANAGING_ROLES",
              "access-logic": "MANAGING_ROLES",
            } as const
          )[progress["completed-queue"] ?? "none"] ?? "MANAGING_REWARDS")

  const waitingPosition =
    (progress as any).currentQueueState === "waiting"
      ? (progress as any).position
      : null

  /**
   * After the "access-check" step, we can use progress.requirementAccesses for live
   * data, since that includes the final results (even if the guild has "chained"
   * roles)
   */
  const isAccessCheckComplete =
    !!progress["completed-queue"] &&
    !["access-preparation", "access-check"].includes(progress["completed-queue"])
  const requirementAccesses = isAccessCheckComplete
    ? ((progress as any)
        .requirementAccesses as AccessCheckJob["children:access-check:jobs"])
    : progress["children:access-check:jobs"]

  const requirements = requirementAccesses
    ? {
        all: requirementAccesses?.length,
        satisfied: requirementAccesses?.filter((req) => req?.access)?.length,
        checked: requirementAccesses?.filter((req) => req?.done)?.length,
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
    roleIds: progress.roleIds,
  } as const
}

export type JoinState = ReturnType<typeof mapAccessJobState>

export { groupBy }
export default mapAccessJobState
