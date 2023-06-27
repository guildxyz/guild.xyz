import {
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { RequirementButton } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { CaretDown } from "phosphor-react"

type Keys = "stamp" | "issuer" | "credType" | "minAmount" | "maxAmount"
const nameByKey: Record<Keys, string> = {
  stamp: "Stamp",
  issuer: "Issuer",
  credType: "Type",
  minAmount: "Issued after",
  maxAmount: "Issued before",
}

const GitcoinPassportRequirement = ({ ...rest }: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()
  const tableBgColor = useColorModeValue("white", "blackAlpha.300")

  return (
    <Requirement
      image="/requirementLogos/gitcoin-passport.svg"
      {...rest}
      footer={
        requirement.type === "GITCOIN_STAMP" &&
        Object.keys(requirement.data ?? {}).length > 0 && (
          <Popover placement="bottom">
            <PopoverTrigger>
              <RequirementButton rightIcon={<Icon as={CaretDown} />}>
                View parameters
              </RequirementButton>
            </PopoverTrigger>

            <Portal>
              <PopoverContent w="auto">
                <PopoverArrow />
                <PopoverHeader
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Parameters
                </PopoverHeader>
                <PopoverBody p={0}>
                  <Table
                    variant="simple"
                    w="full"
                    sx={{ tableLayout: "", borderCollapse: "unset" }}
                    size="sm"
                    bg={tableBgColor}
                    borderWidth={0}
                    borderBottomRadius="xl"
                  >
                    <Tbody fontWeight="normal" fontSize="xs">
                      {Object.entries(requirement.data)?.map(([key, value]) => (
                        <Tr key={key}>
                          <Td>{nameByKey[key]}</Td>
                          <Td>
                            <Text
                              as="span"
                              maxW={key === "issuer" ? 36 : undefined}
                              noOfLines={1}
                            >
                              {key === "minAmount" || key === "maxAmount"
                                ? new Date(value).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : value}
                            </Text>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        )
      }
    >
      {(() => {
        switch (requirement.type) {
          case "GITCOIN_STAMP":
            return (
              <>
                {"Have a Gitcoin Passport with the "}
                <DataBlock>{requirement.data.stamp}</DataBlock>
                {" stamp"}
              </>
            )
          case "GITCOIN_SCORE":
            return (
              <>
                {"Have a Gitcoin Passport with "}
                <DataBlock>{requirement.data.score}</DataBlock>
                {" score in the "}
                <DataBlock>{`#${requirement.data.id}`}</DataBlock>
                {" community"}
              </>
            )
          default:
            return "Have a Gitcoin Passport"
        }
      })()}
    </Requirement>
  )
}

export default GitcoinPassportRequirement
