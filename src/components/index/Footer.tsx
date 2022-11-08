import { Box, Container, GridItem, Img, SimpleGrid, Stack } from "@chakra-ui/react"
import Link from "components/common/Link"

const Footer = (): JSX.Element => (
  <Box
    position="relative"
    w="full"
    bgImage="url('/landing/fire.svg')"
    bgSize="auto 8rem"
    bgRepeat="repeat-x"
    bgPosition="bottom center"
    bgColor="gray.800"
  >
    <Container
      maxW="container.lg"
      px={{ base: 8, lg: 10 }}
      pt={{ base: 16, lg: 28 }}
      pb={{ base: 48, lg: 64 }}
    >
      <SimpleGrid columns={6} gap={8}>
        <GridItem
          colSpan={{ base: 3, md: 1 }}
          display="flex"
          alignItems="center"
          justifyContent={{ base: "center", md: "unset" }}
        >
          <Img
            src="/landing/guild-footer-logo.svg"
            alt="Guild.xyz"
            maxH={{ base: "120px", lg: "140px" }}
          />
        </GridItem>
        <GridItem colSpan={{ base: 3, md: 5 }}>
          <Stack
            w="full"
            h="full"
            spacing={{ base: 0, md: 8 }}
            direction={{ base: "column", md: "row" }}
            alignItems="center"
            justifyContent={{ base: "center", md: "end" }}
          >
            <Link
              href="https://twitter.com/guildxyz"
              isExternal
              fontSize={{ base: "xl", lg: "2xl" }}
              fontWeight="bold"
              fontFamily="display"
            >
              twitter
            </Link>
            <Link
              href="https://github.com/agoraxyz/guild.xyz"
              isExternal
              fontSize={{ base: "xl", lg: "2xl" }}
              fontWeight="bold"
              fontFamily="display"
            >
              github
            </Link>
            <Link
              href="https://guild.mirror.xyz"
              isExternal
              fontSize={{ base: "xl", lg: "2xl" }}
              fontWeight="bold"
              fontFamily="display"
            >
              mirror
            </Link>
            <Link
              href="https://guild.xyz/our-guild"
              isExternal
              fontSize={{ base: "xl", lg: "2xl" }}
              fontWeight="bold"
              fontFamily="display"
            >
              guild
            </Link>
            <Link
              href="/guild-xyz-brand-kit.zip"
              isExternal
              fontSize={{ base: "xl", lg: "2xl" }}
              whiteSpace="nowrap"
              fontWeight="bold"
              fontFamily="display"
            >
              brand kit
            </Link>
            <Link
              href="/privacy-policy"
              fontSize={{ base: "xl", lg: "2xl" }}
              whiteSpace="nowrap"
              fontWeight="bold"
              fontFamily="display"
            >
              privacy policy
            </Link>
          </Stack>
        </GridItem>
      </SimpleGrid>
    </Container>
  </Box>
)

export default Footer
