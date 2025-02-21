import { anchorVariants } from "@/components/ui/Anchor"
import { Button } from "@/components/ui/Button"
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { IconProps } from "@phosphor-icons/react/dist/lib/types"
import {
  ArrowSquareOut,
  ArrowsLeftRight,
  Coins,
  FileText,
  Function,
  Wallet,
} from "@phosphor-icons/react/dist/ssr"
import { BeforeAfterDates } from "components/[guild]/Requirements/components/DataBlockWithDate"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { RequirementChainIndicator } from "components/[guild]/Requirements/components/RequirementChainIndicator"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlock } from "components/common/DataBlock"
import { DataBlockWithCopy } from "components/common/DataBlockWithCopy"
import { ForwardRefExoticComponent, RefAttributes } from "react"
import { Requirement as RequirementType } from "types"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import pluralize from "utils/pluralize"
import shortenHex from "utils/shortenHex"

const requirementIcons: Record<
  string,
  ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
> = {
  COVALENT_FIRST_TX: Wallet,
  COVALENT_FIRST_TX_RELATIVE: Wallet,
  COVALENT_CONTRACT_DEPLOY: FileText,
  COVALENT_CONTRACT_DEPLOY_RELATIVE: FileText,
  COVALENT_TX_COUNT: ArrowsLeftRight,
  COVALENT_TX_COUNT_RELATIVE: ArrowsLeftRight,
  COVALENT_TX_VALUE: Coins,
  COVALENT_TX_VALUE_RELATIVE: Coins,
  COVALENT_CONTRACT_CALL_COUNT: Function,
  COVALENT_CONTRACT_CALL_COUNT_RELATIVE: Function,
}

type CovalentRequirementType =
  | "COVALENT_FIRST_TX"
  | "COVALENT_FIRST_TX_RELATIVE"
  | "COVALENT_CONTRACT_DEPLOY"
  | "COVALENT_CONTRACT_DEPLOY_RELATIVE"
  | "COVALENT_TX_COUNT"
  | "COVALENT_TX_COUNT_RELATIVE"
  | "COVALENT_TX_VALUE"
  | "COVALENT_TX_VALUE_RELATIVE"
  | "COVALENT_CONTRACT_CALL_COUNT"
  | "COVALENT_CONTRACT_CALL_COUNT_RELATIVE"

const WalletActivityRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()
  const reqData = requirement.data as any // Important note: we needed a hotfix for the requirement icon, but we should find a proper solution for this.

  const maxAmount = reqData?.timestamps?.maxAmount
  const minAmount = reqData?.timestamps?.minAmount

  const getFirstTxRelativeContent = () => {
    const formattedMin = formatRelativeTimeFromNow(minAmount)
    const formattedMax = formatRelativeTimeFromNow(maxAmount)

    if (maxAmount && !minAmount)
      return (
        <>
          <span>{`Have a transaction more than `}</span>
          <DataBlock>{formattedMax}</DataBlock>
          <span>{` old`}</span>
        </>
      )

    if (!maxAmount && minAmount)
      return (
        <>
          <span>{`Have a transaction less than `}</span>
          <DataBlock>{formattedMin}</DataBlock>
          <span>{` old`}</span>
        </>
      )

    if (maxAmount && minAmount)
      return (
        <>
          <span>{`Have a transaction that is more than `}</span>
          <DataBlock>{formattedMax}</DataBlock>
          <span>{` old and less than `}</span>
          <DataBlock>{formattedMin}</DataBlock>
          <span>{` old`}</span>
        </>
      )

    return "Have at least one transaction"
  }

  const reqType = requirement.type.replace(
    "ALCHEMY",
    "COVALENT"
  ) as CovalentRequirementType

  const IconComponent = requirementIcons[reqType]

  return (
    <Requirement
      image={<IconComponent weight="bold" className="size-6" />}
      footer={<RequirementChainIndicator />}
      {...props}
    >
      {(() => {
        switch (reqType) {
          case "COVALENT_FIRST_TX":
            if (!minAmount && !maxAmount) return "Have at least one transaction"
            return (
              <>
                <span>Have your first transaction</span>
                <BeforeAfterDates minTs={minAmount} maxTs={maxAmount} />
              </>
            )
          case "COVALENT_FIRST_TX_RELATIVE":
            return getFirstTxRelativeContent()
          case "COVALENT_CONTRACT_DEPLOY":
            return (
              <>
                <span>
                  {`Deployed ${
                    reqData.txCount > 1 ? reqData.txCount : "a"
                  } ${pluralize(reqData.txCount, "contract", false)}`}
                </span>
                <BeforeAfterDates minTs={minAmount} maxTs={maxAmount} />
              </>
            )
          case "COVALENT_CONTRACT_DEPLOY_RELATIVE": {
            const formattedMinAmount = formatRelativeTimeFromNow(
              reqData.timestamps.minAmount
            )

            const formattedMaxAmount = formatRelativeTimeFromNow(
              reqData.timestamps.maxAmount
            )

            return (
              <>
                <span>
                  {`Deployed ${
                    reqData.txCount > 1 ? reqData.txCount : "a"
                  } contract${reqData.txCount > 1 ? "s" : ""}`}
                </span>
                {formattedMaxAmount && formattedMinAmount ? (
                  <>
                    <span>{" between the last "}</span>
                    <DataBlock>{formattedMinAmount}</DataBlock>
                    <span>{" - "}</span>
                    <DataBlock>{formattedMaxAmount}</DataBlock>
                  </>
                ) : formattedMinAmount ? (
                  <>
                    <span>{" in the last "}</span>
                    <DataBlock>{formattedMinAmount}</DataBlock>
                  </>
                ) : null}
              </>
            )
          }
          case "COVALENT_TX_COUNT":
            return (
              <>
                <span>
                  {`Have ${
                    reqData.txCount > 1 ? reqData.txCount : "a"
                  } transaction${reqData.txCount > 1 ? "s" : ""}`}
                </span>

                {requirement.address && (
                  <>
                    <span>{" to/from "}</span>
                    <DataBlockWithCopy text={requirement.address}>
                      {shortenHex(requirement.address, 3)}
                    </DataBlockWithCopy>
                  </>
                )}

                <BeforeAfterDates minTs={minAmount} maxTs={maxAmount} />
              </>
            )
          case "COVALENT_TX_COUNT_RELATIVE": {
            const formattedMinAmount = formatRelativeTimeFromNow(
              reqData.timestamps.minAmount
            )

            const formattedMaxAmount = formatRelativeTimeFromNow(
              reqData.timestamps.maxAmount
            )

            return (
              <>
                <span>
                  {`Have ${
                    reqData.txCount > 1 ? reqData.txCount : "a"
                  } transaction${reqData.txCount > 1 ? "s" : ""}`}
                </span>
                {formattedMaxAmount && formattedMinAmount ? (
                  <>
                    <span>{" between the last "}</span>
                    <DataBlock>{formattedMinAmount}</DataBlock>
                    <span>{" - "}</span>
                    <DataBlock>{formattedMaxAmount}</DataBlock>
                  </>
                ) : formattedMinAmount ? (
                  <>
                    <span>{" in the last "}</span>
                    <DataBlock>{formattedMinAmount}</DataBlock>
                  </>
                ) : null}
              </>
            )
          }
          case "COVALENT_CONTRACT_CALL_COUNT":
          case "COVALENT_CONTRACT_CALL_COUNT_RELATIVE": {
            const formattedMinAmount = formatRelativeTimeFromNow(
              reqData.timestamps.minAmount
            )

            const formattedMaxAmount = formatRelativeTimeFromNow(
              reqData.timestamps.maxAmount
            )

            const req = requirement as Extract<
              RequirementType,
              {
                type:
                  | "COVALENT_CONTRACT_CALL_COUNT"
                  | "COVALENT_CONTRACT_CALL_COUNT_RELATIVE"
              }
            >
            return (
              <>
                <span>{`Call the `}</span>
                <DataBlockWithCopy text={req.address}>
                  {shortenHex(req.address, 3)}
                </DataBlockWithCopy>
                <span>{" contract's "}</span>
                <DataBlock>{req.data.method}</DataBlock>
                <span>{" method"}</span>

                {req.data.txCount > 1 && <span>{` ${req.data.txCount} times`}</span>}

                {req.data.inputs.length > 0 && (
                  <>
                    <span>{" with "}</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="unstyled"
                          className={anchorVariants({
                            className: "h-auto p-0",
                          })}
                          rightIcon={<ArrowSquareOut weight="bold" />}
                        >
                          specific inputs
                        </Button>
                      </PopoverTrigger>

                      <PopoverPortal>
                        <PopoverContent side="bottom" className="p-0">
                          <div className="border-border border-b p-1.5 font-bold text-xs uppercase">
                            Query
                          </div>

                          <table className="w-full table-fixed rounded-b-xl bg-card dark:bg-blackAlpha">
                            <thead className="text-xs">
                              <tr>
                                <th>Input param</th>
                                <th>Operation</th>
                                <th>Value</th>
                              </tr>
                            </thead>
                            <tbody className="text-xs">
                              {req.data.inputs?.map((input) => (
                                <tr
                                  key={input.index}
                                  className="border-border border-b last:border-b-0 [&>td]:p-1.5"
                                >
                                  <td>{`${input.index + 1}. param`}</td>
                                  <td>{input.operator}</td>
                                  <td>{input.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </PopoverContent>
                      </PopoverPortal>
                    </Popover>
                  </>
                )}

                {req.type === "COVALENT_CONTRACT_CALL_COUNT" ? (
                  <BeforeAfterDates minTs={minAmount} maxTs={maxAmount} />
                ) : (
                  <>
                    {formattedMaxAmount && formattedMinAmount ? (
                      <>
                        <span>{" between the last "}</span>
                        <DataBlock>{formattedMinAmount}</DataBlock>
                        <span>{" - "}</span>
                        <DataBlock>{formattedMaxAmount}</DataBlock>
                      </>
                    ) : formattedMinAmount ? (
                      <>
                        <span>{" in the last "}</span>
                        <DataBlock>{formattedMinAmount}</DataBlock>
                      </>
                    ) : null}
                  </>
                )}
              </>
            )
          }
        }
      })()}
    </Requirement>
  )
}

export default WalletActivityRequirement
