import { Button } from "@/components/ui/Button"
import { Icon } from "@phosphor-icons/react/dist/lib/types"
import { ArrowSquareIn } from "@phosphor-icons/react/dist/ssr"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import SnapshotModal from "components/[guild]/leaderboard/Snapshots/SnapshotModal"
import REQUIREMENTS from "requirements"

const RequirementIcon = REQUIREMENTS.GUILD_SNAPSHOT.icon as Icon

const AirdropRequirement = ({ ...rest }: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext<"GUILD_SNAPSHOT">()

  const { isHidden } = requirement?.data

  return (
    <Requirement
      image={<RequirementIcon weight="bold" className="size-6" />}
      footer={
        isHidden && (
          <span className="font-normal text-muted-foreground text-xs">
            Snapshot is hidden
          </span>
        )
      }
      {...rest}
    >
      <span>{"Be included in "}</span>
      {isHidden ? (
        <span>snapshot</span>
      ) : (
        <SnapshotModal
          trigger={
            <Button
              variant="unstyled"
              className="h-auto p-0 underline-offset-2 hover:underline"
              rightIcon={<ArrowSquareIn weight="bold" />}
            >
              this snapshot
            </Button>
          }
          snapshotRequirement={requirement}
        />
      )}
    </Requirement>
  )
}

export default AirdropRequirement
