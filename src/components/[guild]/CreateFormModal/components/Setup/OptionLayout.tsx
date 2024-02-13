import {
  Center,
  ChakraProps,
  Flex,
  Grid,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react"
import { Reorder, useDragControls } from "framer-motion"
import { DotsSixVertical } from "phosphor-react"
import { PropsWithChildren, ReactNode } from "react"
import { Rest } from "types"

type Props = {
  action: ReactNode
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE"
  draggable?: boolean
  fieldId?: string
} & Rest

const draggableCenterProps: ChakraProps = {
  cursor: "grab",
  _groupHover: {
    height: 6,
    borderRadius: "md",
  },
  _groupFocusWithin: {
    height: 6,
    borderRadius: "md",
  },
  transition: "height 0.24s ease, border-radius 0.24s ease",
}

const draggableIconProps: ChakraProps = {
  transition: "opacity 0.24s ease",
  _groupHover: {
    opacity: 1,
  },
  _groupFocusWithin: {
    opacity: 1,
  },
}

const OptionLayout = ({
  children,
  action,
  type,
  draggable,
  fieldId,
  ...props
}: PropsWithChildren<Props>) => {
  /**
   * Dark color is from blackAlpha.300, but without opacity so it looks great when we
   * reorder the choice inputs
   */
  const inputBgColor = useColorModeValue("white", "#35353A")

  const dragControls = useDragControls()

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={dragControls}
      value={fieldId}
      style={{
        position: "relative",
        marginBottom: "var(--chakra-sizes-2)",
      }}
    >
      <Grid templateColumns="2fr 1fr" gap={2} {...props}>
        <HStack
          w="full"
          role="group"
          sx={{
            "input:not(.addOption:not(:focus))": {
              bg: inputBgColor,
            },
          }}
        >
          <Center
            borderWidth={2}
            bgColor={inputBgColor}
            width={5}
            height={5}
            borderRadius={
              type === "MULTIPLE_CHOICE" ? "sm" : "var(--chakra-sizes-2-5)"
            }
            flexShrink={0}
            {...(draggable ? draggableCenterProps : undefined)}
            onPointerDown={draggable ? (e) => dragControls.start(e) : undefined}
          >
            <Icon
              as={DotsSixVertical}
              boxSize={3}
              opacity={0}
              {...(draggable ? draggableIconProps : undefined)}
            />
          </Center>
          {children}
        </HStack>

        <Flex alignItems="center">{action}</Flex>
      </Grid>
    </Reorder.Item>
  )
}

export default OptionLayout
