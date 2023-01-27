import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import CopyableAddress from "components/common/CopyableAddress"

type Props = {
  params: Record<string, string>
}

const StrategyParamsTable = ({ params }: Props): JSX.Element => (
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
      {Object.entries(params || {})?.map(([name, value]) => (
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
      ))}
    </Tbody>
  </Table>
)

export default StrategyParamsTable
