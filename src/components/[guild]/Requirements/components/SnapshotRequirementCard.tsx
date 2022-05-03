import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Link,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { Requirement } from "types"
import CopyableAddress from "../../../common/CopyableAddress"
import RequirementCard from "./common/RequirementCard"
import RequirementText from "./common/RequirementText"

type Props = {
  requirement: Requirement
}

const SnapshotRequirementCard = ({ requirement }: Props): JSX.Element => (
  <RequirementCard requirement={requirement} pr={undefined}>
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
    <Divider my={4} />
    <Accordion w="full" allowToggle>
      <AccordionItem border="none">
        <AccordionButton px={0} _hover={{ bgColor: null }}>
          <Box mr="2" textAlign="left" fontWeight="medium" fontSize="sm">
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
            <Tbody fontWeight="normal" fontSize="sm">
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
                          fontSize="sm"
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
  </RequirementCard>
)

export default SnapshotRequirementCard
