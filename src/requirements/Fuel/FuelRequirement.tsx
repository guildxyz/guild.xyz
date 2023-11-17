import { Text } from "@chakra-ui/react"
import DataBlockWithCopy from "components/[guild]/Requirements/components/DataBlockWithCopy"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import shortenHex from "utils/shortenHex"

const NULL_FUEL_ADDRESS =
  "0x0000000000000000000000000000000000000000000000000000000000000000"

const FuelRequirement = (props: RequirementProps) => {
  const { address, data } = useRequirementContext()

  return (
    <Requirement
      image={
        <Text as="span" fontWeight="bold" fontSize="xx-small">
          TOKEN
        </Text>
      }
      {...props}
    >
      {`Hold ${
        data?.maxAmount
          ? `${data.minAmount} - ${data.maxAmount}`
          : data?.minAmount > 0
          ? `at least ${data?.minAmount}`
          : "any amount of"
      } `}
      {address === NULL_FUEL_ADDRESS ? (
        "ETH"
      ) : data?.symbol ? (
        <Text as="span">{data.symbol}</Text>
      ) : (
        <DataBlockWithCopy text={address}>{shortenHex(address)}</DataBlockWithCopy>
      )}
    </Requirement>
  )
}

export default FuelRequirement
