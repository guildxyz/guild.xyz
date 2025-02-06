import { anchorVariants } from "@/components/ui/Anchor"
import { Button } from "@/components/ui/Button"
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlock } from "components/common/DataBlock"
import { DataBlockWithCopy } from "components/common/DataBlockWithCopy"
import shortenHex from "utils/shortenHex"
import { VeraxRequirementFooter } from "./VeraxRequirementFooter"

const formatValue = (val: string) => {
  let value = val
  try {
    value = JSON.stringify(JSON.parse(val), undefined, 2)
  } catch {
    // If we can't format it, we just return the original value
  }

  return value
}

const VeraxRequirement = (props: RequirementProps): JSX.Element => {
  const { type, data } = useRequirementContext<
    "VERAX_ATTEST" | "VERAX_ATTESTED_BY"
  >()

  return (
    <Requirement
      image="/requirementLogos/verax.png"
      footer={<VeraxRequirementFooter />}
      {...props}
    >
      {type === "VERAX_ATTEST" ? (
        <>
          <span>{"Attest "}</span>
          <DataBlockWithCopy text={data.subject}>
            {shortenHex(data.subject ?? "", 3)}
          </DataBlockWithCopy>
          <span>{" according to schema "}</span>
        </>
      ) : (
        <>
          <span>{"Be attested by "}</span>
          <DataBlockWithCopy text={data.attester}>
            {shortenHex(data.attester ?? "", 3)}
          </DataBlockWithCopy>
          <span>{" according to schema "}</span>
        </>
      )}
      <DataBlockWithCopy text={data.schemaId}>
        {shortenHex(data.schemaId, 3)}
      </DataBlockWithCopy>
      {data.key && (
        <>
          <span>{" with key "}</span>
          <DataBlock>{data.key}</DataBlock>
          {data.val && (
            <>
              <span>{" and  "}</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="unstyled"
                    className={anchorVariants({
                      className: "h-auto p-0",
                    })}
                    rightIcon={<ArrowSquareOut weight="bold" />}
                  >
                    a specific value
                  </Button>
                </PopoverTrigger>
                <PopoverPortal>
                  <PopoverContent side="bottom" className="w-max max-w-[100vw]">
                    <pre className="text-xs">{formatValue(data.val)}</pre>
                  </PopoverContent>
                </PopoverPortal>
              </Popover>
            </>
          )}
        </>
      )}
    </Requirement>
  )
}

export default VeraxRequirement
