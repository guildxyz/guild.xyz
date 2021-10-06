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
import { Requirement } from "temporaryData/types"
import CopyableAddress from "../../../common/CopyableAddress"

type Props = {
  requirement: Requirement
}

const SnapshotStrategy = ({ requirement }: Props): JSX.Element => (
  <>
    <Link
      href={`https://github.com/snapshot-labs/snapshot-strategies/tree/master/src/strategies/${requirement.value}`}
      isExternal
      title="View on GitHub"
    >
      {requirement.value.charAt(0).toUpperCase() + requirement.value.slice(1)}
    </Link>
    {` snapshot strategy`}
    <Divider my={4} />
    <Accordion w="full" allowToggle>
      <AccordionItem border="none">
        <AccordionButton px={0} pb={2} _hover={{ bgColor: null }}>
          <Box flex="1" textAlign="left" fontWeight="bold" fontSize="sm">
            View details
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel p={0} overflow="hidden">
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
              {Object.entries(requirement.data)?.map(([name, value]) => (
                <Tr key={name}>
                  <Td pl={0} pr={2} py={0.5}>
                    {name}
                  </Td>
                  <Td px={0} py={0.5}>
                    {value.toString().startsWith("0x") ? (
                      <CopyableAddress
                        address={value.toString()}
                        fontWeight="normal"
                        fontSize="sm"
                      />
                    ) : (
                      value
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  </>
)

export default SnapshotStrategy
