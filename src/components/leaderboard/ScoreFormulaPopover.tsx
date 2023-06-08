import {
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { Info } from "phosphor-react"

const ScoreFormulaPopover = () => (
  <Popover trigger="hover">
    <PopoverTrigger>
      <Icon as={Info} boxSize={3.5} color="gray" />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverHeader fontWeight="bold" fontSize="sm">
        How do we calculate scores?
      </PopoverHeader>
      <PopoverBody px={4}>
        <Stack spacing={2}>
          <Text fontSize="sm">
            Your score depends on the rank and quantity of your Guild Pins. Early
            minting means lower rank.
          </Text>

          <Table
            variant="simple"
            size="sm"
            sx={{
              th: {
                px: 0,
                py: 1,
                fontSize: "xs",
              },
              td: {
                px: 0,
                py: 1,
                fontSize: "xs",
              },
            }}
          >
            <Thead>
              <Tr>
                <Th>Pin's Rank</Th>
                <Th>Pin's Score</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>1 - 10</Td>
                <Td>100 + 10 / rank</Td>
              </Tr>
              <Tr>
                <Td>11 - 100</Td>
                <Td>75 + 100 / rank</Td>
              </Tr>
              <Tr>
                <Td>101 - 1.000</Td>
                <Td>50 + 1.000 / rank</Td>
              </Tr>
              <Tr>
                <Td>1.001 - 10.000</Td>
                <Td>25 + 10.000 / rank</Td>
              </Tr>
              <Tr>
                <Td>10.001 - 100.000</Td>
                <Td>10 + 100.000 / rank</Td>
              </Tr>
            </Tbody>
          </Table>
        </Stack>
      </PopoverBody>
    </PopoverContent>
  </Popover>
)

export default ScoreFormulaPopover
