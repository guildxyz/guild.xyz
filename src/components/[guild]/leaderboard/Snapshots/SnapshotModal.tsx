import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Schemas } from "@guildxyz/types"
import { useAccessedGuildPoints } from "components/[guild]/AccessHub/hooks/useAccessedGuildPoints"
import { ReactNode, useMemo } from "react"
import Star from "static/icons/star.svg"
import { Requirement } from "types"
import SnapshotTable from "./SnapshotTable"

// TODO: implement proper schemas in our types package and use those here
type GuildRewardWithId = Schemas["GuildReward"] & { id: number }

const SnapshotModal = ({
  snapshotRequirement,
  trigger,
}: {
  snapshotRequirement: Extract<Requirement, { type: "GUILD_SNAPSHOT" }>
  trigger: ReactNode
}) => {
  const snapshotData = useMemo(
    () =>
      snapshotRequirement.data.snapshot
        .sort((a, b) => b.value - a.value)
        .map((row, idx) => ({
          rank: idx + 1,
          address: row.key as `0x${string}`,
          points: row.value,
        })),
    [snapshotRequirement]
  )

  const pointsRewards = useAccessedGuildPoints("ALL")
  const pointsReward = pointsRewards.find(
    (gp) => gp.id === snapshotRequirement.data.guildPlatformId
  ) as Extract<GuildRewardWithId, { platformName: "POINTS" }> | undefined

  if (snapshotRequirement.data.guildPlatformId && !pointsReward) return null

  const pointData = pointsReward
    ? {
        id: pointsReward.id.toString(),
        name: pointsReward.platformGuildData?.name || "points",
        image: pointsReward.platformGuildData?.imageUrl ? (
          <img
            src={pointsReward.platformGuildData.imageUrl}
            className="size-5 rounded-full"
          />
        ) : (
          <div className="flex size-5 items-center justify-center">
            <Star />
          </div>
        ),
      }
    : null

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{snapshotRequirement.name || "View snapshot"}</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="mb-3 flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Snapshot type</span>
              <span>{pointData ? "Point based" : "Custom upload"}</span>
            </div>

            {pointData && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Point type</span>
                <div className="flex items-center gap-0.5">
                  {pointData.image}
                  <span>{pointData.name}</span>
                </div>
              </div>
            )}

            {!!snapshotRequirement.createdAt && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Created at</span>
                <span>
                  {new Date(snapshotRequirement.createdAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <SnapshotTable snapshotData={snapshotData} />
        </DialogBody>

        <DialogCloseButton />
      </DialogContent>
    </Dialog>
  )
}

export default SnapshotModal
