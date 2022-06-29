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
import { CaretDown } from "phosphor-react"
import { Requirement } from "types"
import { RequirementButton } from "./common/RequirementButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const SnapshotRequirementCard = ({ requirement }: Props): JSX.Element => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <RequirementCard
      requirement={requirement}
      image="/requirementLogos/snapshot.jpg"
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
              overflow="hidden"
              sx={{ tableLayout: "fixed" }}
            >
              <Thead>
                <Tr>
                  <Th pl={0} pr={2} py={1}>
                    Param
                  </Th>
                  <Th px={0} py={1}>
                    Value
                  </Th>
                </Tr>
              </Thead>
              <Tbody fontWeight="normal" fontSize="xs">
                {Object.entries(requirement.data?.strategy?.params || {})?.map(
                  ([name, value]) => (
                    <Tr key={name}>
                      <Td pl={0} pr={2} py={0.5}>
                        {name}
                      </Td>
                      <Td px={0} py={0.5}>
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
    >
      {`Satisfy the ${requirement.data?.strategy?.name} snapshot strategy`}
    </RequirementCard>
  )
}

export default SnapshotRequirementCard
