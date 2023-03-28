import { Icon } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import DataBlockWithDate from "components/[guild]/Requirements/components/DataBlockWithDate"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { RPC } from "connectors"
import { ArrowsLeftRight, Coins, FileText, IconProps, Wallet } from "phosphor-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import shortenHex from "utils/shortenHex"

const requirementIcons: Record<
  string,
  ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
> = {
  ALCHEMY_FIRST_TX: Wallet,
  ALCHEMY_FIRST_TX_RELATIVE: Wallet,
  ALCHEMY_CONTRACT_DEPLOY: FileText,
  ALCHEMY_CONTRACT_DEPLOY_RELATIVE: FileText,
  ALCHEMY_TX_COUNT: ArrowsLeftRight,
  ALCHEMY_TX_COUNT_RELATIVE: ArrowsLeftRight,
  ALCHEMY_TX_VALUE: Coins,
  ALCHEMY_TX_VALUE_RELATIVE: Coins,
}

const WalletActivityRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  return (
    <Requirement
      image={<Icon as={requirementIcons[requirement.type]} boxSize={6} />}
      {...props}
    >
      {(() => {
        switch (requirement.type) {
          case "ALCHEMY_FIRST_TX":
            return (
              <>
                {"Have a wallet since at least "}
                <DataBlockWithDate
                  timestamp={requirement.data.timestamps.maxAmount}
                />
              </>
            )
          case "ALCHEMY_FIRST_TX_RELATIVE": {
            const formattedWalletAge = formatRelativeTimeFromNow(
              requirement.data.timestamps.maxAmount
            )

            return (
              <>
                {"Have a wallet older than "}
                <DataBlock>{formattedWalletAge}</DataBlock>
              </>
            )
          }

          case "ALCHEMY_CONTRACT_DEPLOY":
            return (
              <>
                {`Have ${
                  requirement.data.txCount > 1 ? requirement.data.txCount : "a"
                } deployed contract${requirement.data.txCount > 1 ? "s" : ""}
                `}
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
                    {"before "}
                    <DataBlockWithDate
                      timestamp={requirement.data.timestamps.minAmount}
                    />
                  </>
                ) : null}
              </>
            )
          case "ALCHEMY_CONTRACT_DEPLOY_RELATIVE": {
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
                } deployed contract${requirement.data.txCount > 1 ? "s" : ""}
                `}
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
          case "ALCHEMY_TX_COUNT":
            return (
              <>
                {`Have ${
                  requirement.data.txCount > 1 ? requirement.data.txCount : "a"
                } transaction${requirement.data.txCount > 1 ? "s" : ""}
                `}
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
                    {"before "}
                    <DataBlockWithDate
                      timestamp={requirement.data.timestamps.minAmount}
                    />
                  </>
                ) : null}
              </>
            )
          case "ALCHEMY_TX_COUNT_RELATIVE": {
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
                } transaction${requirement.data.txCount > 1 ? "s" : ""}
                `}
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
          case "ALCHEMY_TX_VALUE":
            return (
              <>
                {`Moved at least ${requirement.data.txValue} `}
                <DataBlock>
                  {requirement.symbol ?? requirement.address
                    ? shortenHex(requirement.address, 3)
                    : RPC[requirement.chain].nativeCurrency.symbol}
                </DataBlock>
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
                    {"before "}
                    <DataBlockWithDate
                      timestamp={requirement.data.timestamps.minAmount}
                    />
                  </>
                ) : null}
              </>
            )
          case "ALCHEMY_TX_VALUE_RELATIVE": {
            const formattedMinAmount = formatRelativeTimeFromNow(
              requirement.data.timestamps.minAmount
            )

            const formattedMaxAmount = formatRelativeTimeFromNow(
              requirement.data.timestamps.maxAmount
            )

            return (
              <>
                {`Moved at least ${requirement.data.txValue} `}
                <DataBlock>
                  {requirement.symbol ?? requirement.address
                    ? shortenHex(requirement.address, 3)
                    : RPC[requirement.chain].nativeCurrency.symbol}
                </DataBlock>

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
