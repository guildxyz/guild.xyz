import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import RequirementText from "./RequirementText"

type Props = {
  whitelist: Array<string>
}

const Whitelist = ({ whitelist }: Props): JSX.Element => (
  <Box w="full">
    <RequirementText>Be included in whitelist</RequirementText>
    <Divider my={4} />
    <Accordion w="full" allowToggle>
      <AccordionItem border="none">
        <AccordionButton px={0} _hover={{ bgColor: null }}>
          <Box mr="2" textAlign="left" fontWeight="medium" fontSize="sm">
            {whitelist?.length > 0 &&
              `View ${whitelist.length} address${whitelist.length > 1 ? "es" : ""}`}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel px={0} overflow="hidden">
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
  </Box>
)

export default Whitelist
