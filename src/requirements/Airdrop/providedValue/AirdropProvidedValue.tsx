import { Button } from "@/components/ui/Button"
import { ArrowSquareIn } from "@phosphor-icons/react/dist/ssr"
import SnapshotModal from "components/[guild]/leaderboard/Snapshots/SnapshotModal"
import type { ProvidedValueDisplayProps } from "requirements/requirementProvidedValues"
import { Requirement } from "types"

const AirdropProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => (
  <div className="flex items-center gap-1">
    <span>Points in</span>

    <SnapshotModal
      snapshotRequirement={
        requirement as Extract<Requirement, { type: "GUILD_SNAPSHOT" }>
      }
      trigger={
        <Button
          variant="unstyled"
          className="h-auto gap-0.5 p-0 underline-offset-2 hover:underline"
          rightIcon={<ArrowSquareIn weight="bold" />}
        >
          {"snapshot"}
        </Button>
      }
    />
  </div>
)

export default AirdropProvidedValue
