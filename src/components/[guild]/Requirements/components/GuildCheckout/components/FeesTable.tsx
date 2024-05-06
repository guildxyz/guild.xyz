import {
  Collapse,
  Icon,
  Stack,
  StackProps,
  Table,
  TableContainer,
  Tbody,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { CaretDown } from "phosphor-react"
import { PropsWithChildren } from "react"

type Props = {
  buttonComponent: JSX.Element
  bgColor?: string
} & StackProps

const FeesTable = ({
  buttonComponent,
  bgColor,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack w="full" spacing={0} data-test="fees-table" {...rest}>
      <Button
        display="flex"
        w="full"
        fontWeight="normal"
        p={0}
        h="auto"
        variant="unstyled"
        onClick={onToggle}
        rightIcon={
          <Icon
            as={CaretDown}
            boxSize={3}
            transition="transform 0.2s ease"
            transform={`rotate(${isOpen ? "-180" : "0"}deg)`}
          />
        }
        sx={{ "> div": { width: "full" } }}
      >
        {buttonComponent}
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <TableContainer borderWidth={1} borderRadius="xl" mt={2} bgColor={bgColor}>
          <Table variant="simple" size="sm" color="gray">
            <Tbody>{children}</Tbody>
          </Table>
        </TableContainer>
      </Collapse>
    </Stack>
  )
}

export default FeesTable
