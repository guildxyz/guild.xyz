import {
  Box,
  Center,
  Grid,
  Icon,
  SpaceProps,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import { ArrowDown, ArrowRight } from "phosphor-react"

type Props = {
  before: JSX.Element
  after?: JSX.Element
  boxPadding?: SpaceProps["p"]
  unstyled?: boolean
}

const UpdatedDataGrid = ({
  before,
  after,
  boxPadding,
  unstyled,
}: Props): JSX.Element => {
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const templateColumns = useBreakpointValue({ base: "1fr", md: "1fr 2rem 1fr" })
  const icon = useBreakpointValue({ base: ArrowDown, md: ArrowRight })

  const boxProps = unstyled
    ? {}
    : {
        ...(boxPadding ? { p: boxPadding } : { py: 2, px: 4 }),
        borderWidth: 1,
        borderColor,
        borderRadius: "xl",
        overflow: "hidden",
      }

  return (
    <Grid templateColumns={templateColumns} gap={4}>
      <Box {...boxProps}>{before}</Box>

      {after && (
        <Center>
          <Icon as={icon} boxSize={6} />
        </Center>
      )}

      {after && <Box {...boxProps}>{after}</Box>}
    </Grid>
  )
}

export default UpdatedDataGrid
