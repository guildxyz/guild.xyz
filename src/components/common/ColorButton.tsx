import { Box, Button, ButtonProps } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { PropsWithChildren } from "react"
import Card from "./Card"

type Props = {
  color: string
}

const MotionBox = motion(Box)

const ColorButton = ({
  color,
  children,
  ...buttonProps
}: PropsWithChildren<Props & ButtonProps>): JSX.Element => {
  return (
    <Card position="relative" rounded="2xl" overflow="visible">
      <MotionBox
        position="absolute"
        inset={-0.5}
        top={0.5}
        bgColor={color}
        borderRadius="2xl"
        filter="auto"
        blur="8px"
        initial={{
          opacity: 0.25,
        }}
        animate={{
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{ ease: "linear", duration: 2, repeat: Infinity }}
      />
      <Card position="relative">
        <Button borderWidth={2} borderColor={color} {...buttonProps}>
          {children}
        </Button>
      </Card>
    </Card>
  )
}

export default ColorButton
