import { Box, Container, Heading, Stack } from "@chakra-ui/react"
import { motion, useAnimation } from "framer-motion"
import { PropsWithChildren, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { Rest } from "types"

type Props = {
  title: string
} & Rest

const variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

const MotionStack = motion(Stack)

const LandingWideSection = ({
  title,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const controls = useAnimation()
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    controls.start("visible")
  }, [controls, inView])

  return (
    <Box
      as="section"
      position="relative"
      pb={{ base: 16, md: 28 }}
      bgColor="gray.800"
      zIndex="banner"
    >
      <Container position="relative" maxW="container.lg" px={{ base: 8, lg: 10 }}>
        <MotionStack
          ref={ref}
          as="section"
          initial="hidden"
          animate={controls}
          variants={variants}
          spacing={16}
          {...rest}
        >
          <Heading as="h3" fontFamily="display" fontSize="4xl" textAlign="center">
            {title}
          </Heading>
          {children}
        </MotionStack>
      </Container>
    </Box>
  )
}

export default LandingWideSection
