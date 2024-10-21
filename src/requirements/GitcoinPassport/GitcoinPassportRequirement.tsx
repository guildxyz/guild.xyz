import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { cn } from "@/lib/utils"
import { CaretDown } from "@phosphor-icons/react/dist/ssr"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { RequirementButton } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlock } from "components/common/DataBlock"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { SetupPassport } from "./components/SetupPassport"
import { scorers } from "./constants"

type Key = "stamp" | "issuer" | "credType" | "minAmount" | "maxAmount"
const nameByKey: Record<Key, string> = {
  stamp: "Stamp",
  issuer: "Issuer",
  credType: "Type",
  minAmount: "Issued after",
  maxAmount: "Issued before",
}

const isValidKey = (key: string): key is Key => key in nameByKey
const isValidScorer = (scorer: string | number): scorer is keyof typeof scorers =>
  scorer in scorers

const GitcoinPassportRequirement = ({ ...rest }: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext<
    "GITCOIN_PASS" | "GITCOIN_STAMP" | "GITCOIN_SCORE"
  >()

  const { reqAccesses } = useRoleMembership(requirement.roleId)
  const showCreatePassportButton = reqAccesses?.some(
    (err) =>
      err.requirementId === requirement.id &&
      err.errorType === "PLATFORM_NOT_CONNECTED"
  )

  return (
    <Requirement
      image="/requirementLogos/gitcoin-passport.svg"
      {...rest}
      footer={
        <>
          {showCreatePassportButton && <SetupPassport />}
          {requirement.type === "GITCOIN_STAMP" &&
            Object.keys(requirement.data ?? {}).length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <RequirementButton rightIcon={<CaretDown weight="bold" />}>
                    View parameters
                  </RequirementButton>
                </PopoverTrigger>

                <PopoverPortal>
                  <PopoverContent className="p-0">
                    <table className="w-full table-fixed rounded-b-xl bg-card dark:bg-blackAlpha">
                      <tbody className="text-xs">
                        {Object.entries(requirement.data)?.map(
                          ([key, value]: [string, any]) => (
                            <tr
                              key={key}
                              className="border-border border-b [&>td]:p-1.5"
                            >
                              <td>
                                {isValidKey(key) ? nameByKey[key] : "Unknown key"}
                              </td>
                              <td>
                                <span
                                  className={cn("text-ellipsis", {
                                    "max-w-36": key === "issuer",
                                  })}
                                >
                                  {key === "minAmount" || key === "maxAmount"
                                    ? new Date(value).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })
                                    : value}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </PopoverContent>
                </PopoverPortal>
              </Popover>
            )}
        </>
      }
    >
      {(() => {
        switch (requirement.type) {
          case "GITCOIN_STAMP":
            return (
              <>
                <span>{"Have a Gitcoin Passport with the "}</span>
                <DataBlock>{requirement.data.stamp}</DataBlock>
                <span>{" stamp"}</span>
              </>
            )
          case "GITCOIN_SCORE":
            return (
              <>
                <span>{"Have a Gitcoin Passport with "}</span>
                <DataBlock>{requirement.data.score}</DataBlock>
                <span>{" score in "}</span>
                <DataBlock>{`${
                  isValidScorer(requirement.data.id)
                    ? scorers[requirement.data.id]
                    : "unknown scorer"
                }`}</DataBlock>
              </>
            )
          default:
            return "Have a Gitcoin Passport"
        }
      })()}
    </Requirement>
  )
}

export default GitcoinPassportRequirement
