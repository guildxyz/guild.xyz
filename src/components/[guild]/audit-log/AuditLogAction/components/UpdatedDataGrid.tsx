import {
  Box,
  Center,
  Grid,
  Icon,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import { ArrowDown, ArrowRight } from "phosphor-react"

type Props = {
  before: JSX.Element
  after?: JSX.Element
}

const UpdatedDataGrid = ({ before, after }: Props): JSX.Element => {
  const borderColor = useColorModeValue("gray.100", "gray.700")
  const templateColumns = useBreakpointValue({ base: "1fr", md: "1fr 2rem 1fr" })
  const icon = useBreakpointValue({ base: ArrowDown, md: ArrowRight })

  return (
    <Grid templateColumns={templateColumns} gap={4}>
      <Box p={4} borderWidth={1} borderColor={borderColor} borderRadius="xl">
        {before}
      </Box>

      {after && (
        <Center>
          <Icon as={icon} boxSize={6} />
        </Center>
      )}

      {after && (
        <Box p={4} borderWidth={1} borderColor={borderColor} borderRadius="xl">
          {after}
        </Box>
      )}
    </Grid>
  )
}

export default UpdatedDataGrid
