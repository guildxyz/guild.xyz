import { Box } from "@chakra-ui/react"
import dynamic from "next/dynamic"
import { PropsWithChildren } from "react"
import { Rest } from "types"
import { MarkerProps } from "./Marker"

type Props = {
  hidden?: boolean
} & MarkerProps &
  Rest

const DynamicMarker = dynamic(() => import("./Marker"))

const PulseMarker = ({
  colorScheme,
  placement = "bottom",
  hidden,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <Box position="relative" {...rest}>
    {children}
    {typeof window !== "undefined" && !hidden && (
      <DynamicMarker placement={placement} colorScheme={colorScheme} />
    )}
  </Box>
)

export default PulseMarker
