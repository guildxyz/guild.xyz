import {
  Box,
  Flex,
  Heading,
  Img,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { motion } from "framer-motion"
import { useState } from "react"
import LandingWideSection from "../LandingWideSection"
import useDiscoverLinks from "./hooks/useDiscoverLinks"

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)

const Discover = (): JSX.Element => {
  const { colorMode } = useColorMode()
  const { data: openGraphData, isValidating, error } = useDiscoverLinks()

  const columnCount = useBreakpointValue({ base: 1, sm: 2 })
  const [sectionHeight, setSectionHeight] = useState<"80vh" | "auto">("80vh")

  if (error) return <></>

  return (
    <LandingWideSection
      title="Discover tutorials &amp; updates"
      position="relative"
      overflow="hidden"
    >
      <MotionBox
        initial={{
          height: "80vh",
        }}
        animate={{ height: sectionHeight }}
      >
        {isValidating ? (
          <Flex alignItems="center" justifyContent="center">
            <Spinner />
          </Flex>
        ) : (
          <Box
            gap={{ base: 4, md: 8 }}
            sx={{
              columnCount,
            }}
          >
            {openGraphData?.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                target="_blank"
                w="full"
                _hover={{ textDecoration: "none" }}
              >
                <Card
                  role="group"
                  my={{ base: 2, md: 4 }}
                  w="full"
                  _hover={{
                    bg: colorMode === "light" ? "gray.50" : "gray.600",
                  }}
                >
                  {link.image && (
                    <Img
                      w="full"
                      src={link.image}
                      alt={link.title}
                      _groupHover={{ opacity: 0.8 }}
                    />
                  )}
                  <Stack px={{ base: 5, sm: 6 }} py={7}>
                    <Heading as="h4" fontSize="xl" fontFamily="display">
                      {link.title}
                    </Heading>
                    {link.description && (
                      <Text colorScheme="gray">{link.description}</Text>
                    )}
                  </Stack>
                </Card>
              </Link>
            ))}
          </Box>
        )}

        <MotionFlex
          alignItems="end"
          justifyContent="center"
          position="absolute"
          left={0}
          bottom={0}
          w="full"
          h="full"
          bgGradient="linear-gradient(to top, var(--chakra-colors-gray-800) 0%, var(--chakra-colors-gray-800) 20%, transparent)"
          zIndex="banner"
          pointerEvents="none"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: sectionHeight === "auto" ? 0 : 1,
          }}
        >
          <Button
            colorScheme="solid-gray"
            px={{ base: 4, "2xl": 6 }}
            h={{ base: 12, "2xl": 14 }}
            fontFamily="display"
            fontWeight="bold"
            letterSpacing="wide"
            lineHeight="base"
            pointerEvents="all"
            onClick={() => setSectionHeight("auto")}
          >
            See more
          </Button>
        </MotionFlex>
      </MotionBox>
    </LandingWideSection>
  )
}

export default Discover
