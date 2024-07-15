import {
  Box,
  Center,
  Grid,
  Icon,
  SpaceProps,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import { PiArrowDown } from "react-icons/pi"
import { PiArrowRight } from "react-icons/pi"

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
  const templateColumns = useBreakpointValue({
    base: "1fr",
    md: "1fr var(--chakra-space-8) 1fr",
  })
  const icon = useBreakpointValue({ base: PiArrowDown, md: PiArrowRight })

  const boxProps = unstyled
    ? {}
    : {
        ...(typeof boxPadding === "number" ? { p: boxPadding } : { py: 2, px: 4 }),
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
