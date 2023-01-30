import {
  Divider,
  HStack,
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
  Tr,
  useColorModeValue,
} from "@chakra-ui/react"
import BlockExplorerUrl from "components/[guild]/Requirements/components/BlockExplorerUrl"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { RequirementButton } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { ArrowSquareOut, Function } from "phosphor-react"
import shortenHex from "utils/shortenHex"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const ContractStateRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()
  const tableBgColor = useColorModeValue("white", "blackAlpha.300")

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={<Icon as={Function} boxSize={6} />}
      footer={
        <HStack divider={<Divider orientation="vertical" h="4" />} spacing={3}>
          <BlockExplorerUrl />

          <Popover placement="bottom">
            <PopoverTrigger>
              <RequirementButton rightIcon={<Icon as={ArrowSquareOut} />}>
                View query
              </RequirementButton>
            </PopoverTrigger>

            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Query
                </PopoverHeader>
                <PopoverBody p={0}>
                  <Table
                    variant="simple"
                    w="full"
                    sx={{ tableLayout: "fixed", borderCollapse: "unset" }}
                    size="sm"
                    bg={tableBgColor}
                    borderWidth={0}
                    borderBottomRadius="xl"
                  >
                    <Tbody fontWeight="normal" fontSize="xs">
                      {(requirement.data.params as string[])?.map((param, i) => (
                        <Tr key={i}>
                          <Td>{`${i + 1}. input param`}</Td>
                          <Td>{param}</Td>
                        </Tr>
                      ))}
                      <Tr fontWeight={"semibold"}>
                        <Td>{`Expected ${
                          requirement.data.resultIndex !== undefined
                            ? `${requirement.data.resultIndex + 1}. `
                            : ""
                        }output`}</Td>
                        <Td>
                          {`${requirement.data.resultMatch} ${
                            ADDRESS_REGEX.test(requirement.data.expected)
                              ? shortenHex(requirement.data.expected, 3)
                              : requirement.data.expected
                          }`}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </HStack>
      }
      {...props}
    >
      Satisfy custom query of{" "}
      <DataBlock>{requirement.data.id.split("(")[0]}</DataBlock> on the{" "}
      <DataBlock>{shortenHex(requirement.address, 3)}</DataBlock> contract
    </Requirement>
  )
}

export default ContractStateRequirement
