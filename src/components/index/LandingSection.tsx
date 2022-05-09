import { Box, Container, GridItem, Img, SimpleGrid, VStack } from "@chakra-ui/react"
import { motion, useAnimation } from "framer-motion"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import LandingSectionTitle from "./LandingSectionTitle"

type Props = {
  title: string
  photo: string | JSX.Element
  content: JSX.Element
  flipped?: boolean
}

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

const MotionGridItem = motion(GridItem)

const LandingSection = ({ title, photo, content, flipped }: Props): JSX.Element => {
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
        <SimpleGrid
          ref={ref}
          columns={12}
          rowGap={{ base: 8, md: 0 }}
          columnGap={{ base: 0, md: 16 }}
        >
          <MotionGridItem
            initial="hidden"
            animate={controls}
            variants={variants}
            colSpan={{ base: 12, md: 5 }}
            order={{ base: 1, md: flipped ? 2 : 1 }}
            w="full"
          >
            <VStack spacing={4} py={4} textAlign={{ base: "center", md: "left" }}>
              <LandingSectionTitle>{title}</LandingSectionTitle>
              {content}
            </VStack>
          </MotionGridItem>

          <MotionGridItem
            initial="hidden"
            animate={controls}
            variants={variants}
            colSpan={{ base: 12, md: 7 }}
            order={{ base: 2, md: flipped ? 1 : 2 }}
            w="full"
          >
            {typeof photo === "string" ? (
              <Img w="full" src={photo} alt={title} />
            ) : (
              photo
            )}
          </MotionGridItem>
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default LandingSection
