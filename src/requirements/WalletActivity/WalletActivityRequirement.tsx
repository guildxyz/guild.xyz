import { Icon } from "@chakra-ui/react"
import {
  ArrowsLeftRight,
  Coins,
  FileText,
  Wallet,
  type IconProps,
} from "@phosphor-icons/react"
import DataBlockWithDate from "components/[guild]/Requirements/components/DataBlockWithDate"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import RequirementChainIndicator from "components/[guild]/Requirements/components/RequirementChainIndicator"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import DataBlockWithCopy from "components/common/DataBlockWithCopy"
import { ForwardRefExoticComponent, RefAttributes } from "react"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
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
  const requirement = useRequirementContext()

  const maxAmount = requirement.data?.timestamps?.maxAmount
  const minAmount = requirement.data?.timestamps?.minAmount

  const getFirstTxContent = () => {
    if (maxAmount && minAmount === undefined)
      return (
        <>
          {`Have a wallet created before `}
          <DataBlockWithDate timestamp={maxAmount} />
        </>
      )

    if (maxAmount === undefined && minAmount)
      return (
        <>
          {`Have a wallet created after `}
          <DataBlockWithDate timestamp={minAmount} />
        </>
      )

    if (maxAmount && minAmount)
      return (
        <>
          {`Have a wallet created between `}
          <DataBlockWithDate timestamp={minAmount} />
          {` and `}
          <DataBlockWithDate timestamp={maxAmount} />
        </>
      )

    return <>Have a wallet with at least one transaction</>
  }

  const getFirstTxRelativeContent = () => {
    const formattedMin = formatRelativeTimeFromNow(minAmount)
    const formattedMax = formatRelativeTimeFromNow(maxAmount)

    if (maxAmount && !minAmount)
      return (
        <>
          {`Have a wallet older than `}
          <DataBlock>{formattedMax}</DataBlock>
        </>
      )

    if (!maxAmount && minAmount)
      return (
        <>
          {`Have a wallet younger than `}
          <DataBlock>{formattedMin}</DataBlock>
        </>
      )

    if (maxAmount && minAmount)
      return (
        <>
          {`Have a wallet older than `}
          <DataBlock>{formattedMax}</DataBlock>
          {` and younger than `}
          <DataBlock>{formattedMin}</DataBlock>
        </>
      )

    return <>Have a wallet with at least one transaction</>
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
            return getFirstTxContent()
          case "COVALENT_FIRST_TX_RELATIVE":
            return getFirstTxRelativeContent()
          case "COVALENT_CONTRACT_DEPLOY":
            return (
              <>
                {`Deployed ${
                  requirement.data.txCount > 1 ? requirement.data.txCount : "a"
                } contract${requirement.data.txCount > 1 ? "s" : ""}`}
                {requirement.data.timestamps.maxAmount &&
                requirement.data.timestamps.minAmount ? (
                  <>
                    {" between "}
                    <DataBlockWithDate
                      timestamp={requirement.data.timestamps.minAmount}
                    />
                    {" and "}
                    <DataBlockWithDate
                      timestamp={requirement.data.timestamps.maxAmount}
                    />
                  </>
                ) : requirement.data.timestamps.minAmount ? (
                  <>
                    {" before "}
                    <DataBlockWithDate
                      timestamp={requirement.data.timestamps.minAmount}
                    />
                  </>
                ) : null}
              </>
            )
          case "COVALENT_CONTRACT_DEPLOY_RELATIVE": {
            const formattedMinAmount = formatRelativeTimeFromNow(
              requirement.data.timestamps.minAmount,
            )

            const formattedMaxAmount = formatRelativeTimeFromNow(
              requirement.data.timestamps.maxAmount,
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

                {requirement.data.timestamps.maxAmount &&
                requirement.data.timestamps.minAmount ? (
                  <>
                    {" between "}
                    <DataBlockWithDate
                      timestamp={requirement.data.timestamps.minAmount}
                    />
                    {" and "}
                    <DataBlockWithDate
                      timestamp={requirement.data.timestamps.maxAmount}
                    />
                  </>
                ) : requirement.data.timestamps.minAmount ? (
                  <>
                    {" before "}
                    <DataBlockWithDate
                      timestamp={requirement.data.timestamps.minAmount}
                    />
                  </>
                ) : null}
              </>
            )
          case "COVALENT_TX_COUNT_RELATIVE": {
            const formattedMinAmount = formatRelativeTimeFromNow(
              requirement.data.timestamps.minAmount,
            )

            const formattedMaxAmount = formatRelativeTimeFromNow(
              requirement.data.timestamps.maxAmount,
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
