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
import { Requirement } from "types"
import shortenHex from "utils/shortenHex"
import BlockExplorerUrl from "./common/BlockExplorerUrl"
import { RequirementButton } from "./common/RequirementButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const ContractStateRequirementCard = ({ requirement }: Props) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <RequirementCard
      requirement={requirement}
      image={<Icon as={Function} boxSize={6} />}
      footer={
        <>
          <HStack divider={<Divider orientation="vertical" h="4" />} spacing="4">
            <BlockExplorerUrl requirement={requirement} />
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
                {requirement.data.params.map((param, i) => (
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
    >
      Satisfy custom query of <pre>{requirement.data.id.split("(")[0]}</pre> on the
      <pre>{shortenHex(requirement.address, 3)}</pre> contract
    </RequirementCard>
  )
}

export default ContractStateRequirementCard
