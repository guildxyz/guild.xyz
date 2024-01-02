import { Img, Tag, TagLabel, Text, useColorModeValue } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlockWithCopy from "components/common/DataBlockWithCopy"
import shortenHex from "utils/shortenHex"

const NULL_FUEL_ADDRESS =
  "0x0000000000000000000000000000000000000000000000000000000000000000"

const FuelRequirement = (props: RequirementProps) => {
  const { address, data } = useRequirementContext()
  const tagBg = useColorModeValue("white", "blackAlpha.300")

  return (
    <Requirement
      image={
        <Text as="span" fontWeight="bold" fontSize="xx-small">
          TOKEN
        </Text>
      }
      footer={
        <Tag size="sm" bg={tagBg}>
          <Img src="/walletLogos/fuel.svg" alt="Fuel" boxSize={3} mr={1} />
          <TagLabel>Fuel</TagLabel>
        </Tag>
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
