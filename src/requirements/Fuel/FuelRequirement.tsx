import { Icon, Img, Tag, TagLabel, Text, useColorModeValue } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlockWithCopy from "components/common/DataBlockWithCopy"
import { ArrowsLeftRight } from "phosphor-react"
import shortenHex from "utils/shortenHex"

const NULL_FUEL_ADDRESS =
  "0x0000000000000000000000000000000000000000000000000000000000000000"

const FuelRequirement = (props: RequirementProps) => {
  const { type, address, data } = useRequirementContext()
  const tagBg = useColorModeValue("white", "blackAlpha.300")

  return (
    <Requirement
      image={
        type === "FUEL_BALANCE" ? (
          <Text as="span" fontWeight="bold" fontSize="xx-small">
            TOKEN
          </Text>
        ) : (
          <Icon as={ArrowsLeftRight} boxSize={6} />
        )
      }
      footer={
        <Tag size="sm" bg={tagBg}>
          <Img src="/walletLogos/fuel.svg" alt="Fuel" boxSize={3} mr={1} />
          <TagLabel>Fuel</TagLabel>
        </Tag>
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
                ) : data?.symbol ? (
                  <Text as="span">{data.symbol}</Text>
                ) : (
                  <DataBlockWithCopy text={address}>
                    {shortenHex(address)}
                  </DataBlockWithCopy>
                )}
              </>
            )
          case "FUEL_TRANSACTIONS":
            return (typeof data.minAmount === "number" && !data.maxAmount) ||
              (!data.minAmount && !data.maxAmount)
              ? `Have ${data.minAmount > 1 ? data.minAmount : "a"}${
                  !!data.id ? ` ${data.id}` : ""
                } transaction${data.minAmount > 1 ? "s" : ""}`
              : typeof data.maxAmount === "number" && !data.minAmount
              ? `Have at most ${data.maxAmount}${
                  !!data.id ? ` ${data.id}` : ""
                } transaction${data.minAmount > 1 ? "s" : ""}`
              : `Have ${data.minAmount} - ${data.maxAmount}${
                  !!data.id ? ` ${data.id}` : ""
                } transaction${data.minAmount > 1 ? "s" : ""}`
        }
      })()}
    </Requirement>
  )
}

export default FuelRequirement
