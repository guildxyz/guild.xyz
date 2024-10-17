import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { CaretDown, Function } from "@phosphor-icons/react/dist/ssr"
import { BlockExplorerUrl } from "components/[guild]/Requirements/components/BlockExplorerUrl"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { RequirementButton } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlock } from "components/common/DataBlock"
import shortenHex from "utils/shortenHex"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

type MappedParam = { value: string }
const isMappedParam = (param: any): param is MappedParam =>
  typeof param === "object" && "value" in param

const ContractStateRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext<"CONTRACT">()

  return (
    <Requirement
      image={<Function weight="bold" className="size-6" />}
      footer={
        <>
          <BlockExplorerUrl path="address" />

          <Popover>
            <PopoverTrigger asChild>
              <RequirementButton rightIcon={<CaretDown weight="bold" />}>
                View query
              </RequirementButton>
            </PopoverTrigger>

            <PopoverPortal>
              <PopoverContent side="bottom" className="p-0">
                <div className="border-border border-b p-1.5 font-bold text-xs uppercase">
                  Query
                </div>

                <table className="w-full table-fixed rounded-b-xl bg-card dark:bg-blackAlpha">
                  <tbody className="text-xs">
                    {requirement.data.params?.map((param, i) => (
                      <tr key={i} className="border-border border-b [&>td]:p-1.5">
                        <td>{`${i + 1}. input param`}</td>
                        <td>
                          {isMappedParam(param) ? param.value.toString() : param}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-semibold [&>td]:p-1.5">
                      <td>{`Expected ${
                        requirement.data.resultIndex !== undefined
                          ? `${requirement.data.resultIndex + 1}. `
                          : ""
                      }output`}</td>
                      <td>
                        {`${requirement.data.resultMatch} ${
                          ADDRESS_REGEX.test(requirement.data.expected)
                            ? shortenHex(requirement.data.expected, 3)
                            : requirement.data.expected
                        }`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        </>
      }
      {...props}
    >
      <span>{"Satisfy custom query of "}</span>
      <DataBlock>{requirement.data.id.split("(")[0]}</DataBlock> on the{" "}
      <DataBlock>{shortenHex(requirement.address, 3)}</DataBlock> contract
    </Requirement>
  )
}

export default ContractStateRequirement
