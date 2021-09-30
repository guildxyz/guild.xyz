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
import shortenHex from "utils/shortenHex"
import useParamsArray from "../hooks/useParamsArray"

type Props = {
  params: Record<string, string | number>
}

const StrategyParams = ({ params }: Props): JSX.Element => {
  const paramsArray = useParamsArray(params)

  return (
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
              {paramsArray?.map((param) => (
                <Tr>
                  <Td pl={0} pr={2} py={0.5}>
                    {param.name}
                  </Td>
                  <Td px={0} py={0.5}>
                    {param.value.toString().startsWith("0x")
                      ? shortenHex(param.value.toString(), 3)
                      : param.value}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default StrategyParams
