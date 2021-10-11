import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"

type Props = {
  whitelist: Array<string>
}

const Whitelist = ({ whitelist }: Props): JSX.Element => (
  <Accordion w="full" allowToggle>
    <AccordionItem border="none">
      <AccordionButton px={0} pb={2} _hover={{ bgColor: null }}>
        <Box flex="1" textAlign="left" fontWeight="bold" fontSize="sm">
          {whitelist?.length > 0 &&
            `${whitelist.length} address${whitelist.length > 1 ? "es" : ""}`}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel p={0} overflow="hidden">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th pl={0} pr={2} py={1}>
                Address
              </Th>
            </Tr>
          </Thead>
          <Tbody fontWeight="normal" fontSize="sm">
            {whitelist?.map((address) => (
              <Tr key={address}>
                <Td px={0} py={0.5}>
                  {address}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
)

export default Whitelist
