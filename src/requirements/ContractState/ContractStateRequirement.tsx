import {
  Collapse,
  Divider,
  HStack,
  Icon,
  Table,
  Tbody,
  Td,
  Tr,
  useDisclosure,
} from "@chakra-ui/react"
import { CaretDown, Function } from "phosphor-react"
import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import shortenHex from "utils/shortenHex"
import BlockExplorerUrl from "../common/BlockExplorerUrl"
import Requirement from "../common/Requirement"
import { RequirementButton } from "../common/RequirementButton"

const ContractStateRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Requirement
      image={<Icon as={Function} boxSize={6} />}
      footer={
        <>
          <HStack divider={<Divider orientation="vertical" h="4" />} spacing="4">
            <BlockExplorerUrl requirement={requirement} {...rest} />
            <RequirementButton
              rightIcon={
                <Icon
                  as={CaretDown}
                  transform={isOpen && "rotate(-180deg)"}
                  transition="transform .3s"
                />
              }
              onClick={onToggle}
            >
              View query
            </RequirementButton>
          </HStack>
          <Collapse in={isOpen}>
            <Table
              variant="simple"
              w="full"
              sx={{ tableLayout: "fixed", borderCollapse: "unset" }}
              size="sm"
              bg="blackAlpha.100"
              borderWidth="1px"
              borderRadius="md"
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
                    {`${requirement.data.resultMatch} ${requirement.data.expected}`}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Collapse>
        </>
      }
      {...rest}
    >
      Satisfy custom query of{" "}
      <DataBlock>{requirement.data.id.split("(")[0]}</DataBlock> on the{" "}
      <DataBlock>{shortenHex(requirement.address, 3)}</DataBlock> contract
    </Requirement>
  )
}

export default ContractStateRequirement
