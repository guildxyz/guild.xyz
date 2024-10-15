import { Badge } from "@/components/ui/Badge"
import { ArrowsLeftRight } from "@phosphor-icons/react/dist/ssr"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlockWithCopy } from "components/common/DataBlockWithCopy"
import shortenHex from "utils/shortenHex"

const NULL_FUEL_ADDRESS =
  "0x0000000000000000000000000000000000000000000000000000000000000000"

const FuelRequirement = (props: RequirementProps) => {
  const { type, address, data } = useRequirementContext()

  // TODO: remove these once we implement the Fuel requirement schema
  const requirementAddress = address as `0x${string}`
  const requirementDataSymbol = data.symbol

  return (
    <Requirement
      image={
        type === "FUEL_BALANCE" ? (
          <span className="font-bold text-[xx-small]">TOKEN</span>
        ) : (
          <ArrowsLeftRight weight="bold" className="size-6" />
        )
      }
      footer={
        <Badge size="sm">
          <img src="/walletLogos/fuel.svg" alt="Fuel" className="size-3" />
          <span>Fuel</span>
        </Badge>
      }
      {...props}
    >
      {(() => {
        switch (type) {
          case "FUEL_BALANCE":
            return (
              <>
                {`Hold ${
                  data?.maxAmount
                    ? `${data.minAmount} - ${data.maxAmount}`
                    : data?.minAmount > 0
                      ? `at least ${data?.minAmount}`
                      : "any amount of"
                } `}
                {address === NULL_FUEL_ADDRESS ? (
                  "ETH"
                ) : requirementDataSymbol ? (
                  <span>{requirementDataSymbol}</span>
                ) : (
                  <DataBlockWithCopy text={requirementAddress}>
                    {shortenHex(requirementAddress)}
                  </DataBlockWithCopy>
                )}
              </>
            )
          case "FUEL_TRANSACTIONS":
            const minAmountGTOne = (data.minAmount ?? 0) > 1
            return (typeof data.minAmount === "number" && !data.maxAmount) ||
              (!data.minAmount && !data.maxAmount)
              ? `Have ${minAmountGTOne ? data.minAmount : "a"}${
                  !!data.id ? ` ${data.id}` : ""
                } transaction${minAmountGTOne ? "s" : ""}`
              : typeof data.maxAmount === "number" && !data.minAmount
                ? `Have at most ${data.maxAmount}${
                    !!data.id ? ` ${data.id}` : ""
                  } transaction${minAmountGTOne ? "s" : ""}`
                : `Have ${data.minAmount} - ${data.maxAmount}${
                    !!data.id ? ` ${data.id}` : ""
                  } transaction${minAmountGTOne ? "s" : ""}`
        }
      })()}
    </Requirement>
  )
}

export default FuelRequirement
