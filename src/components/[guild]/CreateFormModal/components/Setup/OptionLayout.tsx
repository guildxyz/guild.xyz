import {
  Center,
  ChakraProps,
  Flex,
  Grid,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react"
import MotionWrapper from "components/common/CardMotionWrapper"
import { DotsSixVertical } from "phosphor-react"
import { PropsWithChildren, ReactNode } from "react"
import { Rest } from "types"

type Props = {
  action: ReactNode
  type?: "radio" | "checkbox"
  draggable?: boolean
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
  type = "radio",
  draggable,
  ..._props
}: PropsWithChildren<Props>) => {
  const circleBgColor = useColorModeValue("white", "blackAlpha.300")

  const { key, ...props } = _props

  return (
    <MotionWrapper key={key}>
      <Grid templateColumns="2fr 1fr" gap={2} {...props}>
        <HStack w="full" role="group">
          <Center
            borderWidth={2}
            bgColor={circleBgColor}
            width={5}
            height={5}
            borderRadius={type === "checkbox" ? "sm" : "var(--chakra-sizes-2-5)"}
            flexShrink={0}
            {...(draggable ? draggableCenterProps : undefined)}
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
    </MotionWrapper>
  )
}

export default OptionLayout
