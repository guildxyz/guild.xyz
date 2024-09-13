import { Icon } from "@chakra-ui/react"
import {
  ArrowsLeftRight,
  Coins,
  FileText,
  IconProps,
  Wallet,
} from "@phosphor-icons/react"
import { BeforeAfterDates } from "components/[guild]/Requirements/components/DataBlockWithDate"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import RequirementChainIndicator from "components/[guild]/Requirements/components/RequirementChainIndicator"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import DataBlockWithCopy from "components/common/DataBlockWithCopy"
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

const WalletActivityRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext<
    | "COVALENT_FIRST_TX"
    | "COVALENT_FIRST_TX_RELATIVE"
    | "COVALENT_CONTRACT_DEPLOY"
    | "COVALENT_CONTRACT_DEPLOY_RELATIVE"
    | "COVALENT_TX_COUNT"
    | "COVALENT_TX_COUNT_RELATIVE"
    | "COVALENT_TX_VALUE"
    | "COVALENT_TX_VALUE_RELATIVE"
  >()

  const maxAmount = requirement.data?.timestamps?.maxAmount
  const minAmount = requirement.data?.timestamps?.minAmount

  const getFirstTxRelativeContent = () => {
    const formattedMin = formatRelativeTimeFromNow(minAmount)
    const formattedMax = formatRelativeTimeFromNow(maxAmount)

    if (maxAmount && !minAmount)
      return (
        <>
          {`Have a transaction more than `}
          <DataBlock>{formattedMax}</DataBlock>
          {` old`}
        </>
      )

    if (!maxAmount && minAmount)
      return (
        <>
          {`Have a transaction less than `}
          <DataBlock>{formattedMin}</DataBlock>
          {` old`}
        </>
      )

    if (maxAmount && minAmount)
      return (
        <>
          {`Have a transaction that is more than `}
          <DataBlock>{formattedMax}</DataBlock>
          {` old and less than `}
          <DataBlock>{formattedMin}</DataBlock>
          {` old`}
        </>
      )

    return <>Have at least one transaction</>
  }

  return (
    <Requirement
      image={<Icon as={requirementIcons[requirement.type]} boxSize={6} />}
      footer={<RequirementChainIndicator />}
      {...props}
    >
      {(() => {
        switch (requirement.type) {
          case "COVALENT_FIRST_TX":
            if (!minAmount && !maxAmount) return "Have at least one transaction"
            return (
              <>
                Have your first transaction
                <BeforeAfterDates minTs={minAmount} maxTs={maxAmount} />
              </>
            )
          case "COVALENT_FIRST_TX_RELATIVE":
            return getFirstTxRelativeContent()
          case "COVALENT_CONTRACT_DEPLOY":
            return (
              <>
                {`Deployed ${
                  requirement.data.txCount > 1 ? requirement.data.txCount : "a"
                } ${pluralize(requirement.data.txCount, "contract", false)}`}
                <BeforeAfterDates minTs={minAmount} maxTs={maxAmount} />
              </>
            )
          case "COVALENT_CONTRACT_DEPLOY_RELATIVE": {
            const formattedMinAmount = formatRelativeTimeFromNow(
              requirement.data.timestamps.minAmount
            )

            const formattedMaxAmount = formatRelativeTimeFromNow(
              requirement.data.timestamps.maxAmount
            )

            return (
              <>
                {`Deployed ${
                  requirement.data.txCount > 1 ? requirement.data.txCount : "a"
                } contract${requirement.data.txCount > 1 ? "s" : ""}`}
                {formattedMaxAmount && formattedMinAmount ? (
                  <>
                    {" between the last "}
                    <DataBlock>{formattedMinAmount}</DataBlock>
                    {" - "}
                    <DataBlock>{formattedMaxAmount}</DataBlock>
                  </>
                ) : formattedMinAmount ? (
                  <>
                    {" in the last "}
                    <DataBlock>{formattedMinAmount}</DataBlock>
                  </>
                ) : null}
              </>
            )
          }
          case "COVALENT_TX_COUNT":
            return (
              <>
                {`Have ${
                  requirement.data.txCount > 1 ? requirement.data.txCount : "a"
                } transaction${requirement.data.txCount > 1 ? "s" : ""}`}

                {requirement.address && (
                  <>
                    {" to/from "}
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
              requirement.data.timestamps.minAmount
            )

            const formattedMaxAmount = formatRelativeTimeFromNow(
              requirement.data.timestamps.maxAmount
            )

            return (
              <>
                {`Have ${
                  requirement.data.txCount > 1 ? requirement.data.txCount : "a"
                } transaction${requirement.data.txCount > 1 ? "s" : ""}`}
                {formattedMaxAmount && formattedMinAmount ? (
                  <>
                    {" between the last "}
                    <DataBlock>{formattedMinAmount}</DataBlock>
                    {" - "}
                    <DataBlock>{formattedMaxAmount}</DataBlock>
                  </>
                ) : formattedMinAmount ? (
                  <>
                    {" in the last "}
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
