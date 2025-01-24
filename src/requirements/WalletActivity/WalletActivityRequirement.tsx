import { IconProps } from "@phosphor-icons/react/dist/lib/types"
import {
  ArrowsLeftRight,
  Coins,
  FileText,
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
        }
      })()}
    </Requirement>
  )
}

export default WalletActivityRequirement
