import {
  Box,
  Container,
  GridItem,
  Heading,
  Img,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react"
import { motion, useAnimation } from "framer-motion"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

type Props = {
  title: string
  photo: string | JSX.Element
  content: string | JSX.Element
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
          >
            <VStack spacing={4} py={4} textAlign={{ base: "center", md: "left" }}>
              <Heading as="h3" fontFamily="display" fontSize="4xl">
                {title}
              </Heading>
              {typeof content === "string" ? (
                <Text fontSize="xl" fontWeight="medium" lineHeight="125%">
                  {content}
                </Text>
              ) : (
                content
              )}
            </VStack>
          </MotionGridItem>

          <MotionGridItem
            initial="hidden"
            animate={controls}
            variants={variants}
            colSpan={{ base: 12, md: 7 }}
            order={{ base: 2, md: flipped ? 1 : 2 }}
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
