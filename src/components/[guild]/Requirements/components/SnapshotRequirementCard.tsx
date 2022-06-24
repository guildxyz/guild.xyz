import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Link,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import CopyableAddress from "components/common/CopyableAddress"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"
import RequirementText from "./common/RequirementText"

type Props = {
  requirement: Requirement
}

const SnapshotRequirementCard = ({ requirement }: Props): JSX.Element => (
  <RequirementCard
    requirement={requirement}
    image="/requirementLogos/snapshot.jpg"
    footer={
      <Accordion w="full" allowToggle>
        <AccordionItem border="none">
          <AccordionButton p={0} _hover={{ bgColor: null }}>
            <Box mr="2" textAlign="left" fontWeight="medium" fontSize="xs">
              View details
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={0} overflow="hidden">
            <Table variant="simple">
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
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    }
  >
    <RequirementText>
      <Link
        href={`https://github.com/snapshot-labs/snapshot-strategies/tree/master/src/strategies/${requirement.data?.strategy?.name}`}
        isExternal
        title="View on GitHub"
      >
        {requirement.data?.strategy?.name?.charAt(0)?.toUpperCase() +
          requirement.data?.strategy?.name?.slice(1)}
      </Link>
      {` snapshot strategy`}
    </RequirementText>
  </RequirementCard>
)

export default SnapshotRequirementCard
