import {
  Collapse,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react"
import CopyableAddress from "components/common/CopyableAddress"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { RequirementButton } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { CaretDown } from "phosphor-react"

const SnapshotRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const { isOpen, onToggle } = useDisclosure()

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image="/requirementLogos/snapshot.png"
      footer={
        <>
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
            View parameters
          </RequirementButton>
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
              <Thead>
                <Tr>
                  <Th>Param</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody fontWeight="normal" fontSize="xs">
                {Object.entries(requirement.data?.strategy?.params || {})?.map(
                  ([name, value]) => (
                    <Tr key={name}>
                      <Td>{name}</Td>
                      <Td>
                        {value?.toString()?.startsWith("0x") ? (
                          <CopyableAddress
                            address={value.toString()}
                            fontWeight="normal"
                            fontSize="xs"
                          />
                        ) : (
                          value?.toString()
                        )}
                      </Td>
                    </Tr>
                  )
                )}
              </Tbody>
            </Table>
          </Collapse>
        </>
      }
      {...props}
    >
      {`Satisfy the ${requirement.data?.strategy?.name} snapshot strategy`}
    </Requirement>
  )
}

export default SnapshotRequirement
