import {
  Box,
  Container,
  Flex,
  Heading,
  Img,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import Footer from "components/common/Layout/components/Footer"
import Header from "components/common/Layout/components/Header"
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import useGuild from "components/[guild]/hooks/useGuild"
import usePoap from "components/[guild]/Requirements/components/PoapRequirementCard/hooks/usePoap"
import Head from "next/head"
import { useRouter } from "next/router"

const Page = (): JSX.Element => {
  const router = useRouter()
  const { theme, name } = useGuild()
  const { poap, isLoading } = usePoap(router.query.fancyId?.toString())
  const { poapLinks, isPoapLinksLoading } = usePoapLinks(poap?.id)

  // TODO: don't show POAP data if it isn't dropped to the current guild!

  return (
    <>
      <Head>
        <title>{name ? `${name} - claim your POAP` : "Claim your POAP"}</title>
      </Head>

      <Header showBackButton={true} />
      <Container maxW="container.sm" pt={{ base: 16, md: 24 }} pb={12}>
        <Card overflow="hidden">
          <Box
            position="relative"
            h={48}
            bgColor={theme?.color ?? "gray.900"}
            bgImage={
              theme?.backgroundImage ? `url('${theme?.backgroundImage}')` : undefined
            }
            bgSize="cover"
          >
            <Flex
              position="absolute"
              left={0}
              right={0}
              bottom={-8}
              justifyContent="center"
            >
              <Box p={1} bgColor="gray.700" rounded="full">
                <SkeletonCircle boxSize={36} isLoaded={poap && !isLoading}>
                  <Img boxSize={36} rounded="full" src={poap?.image_url} />
                </SkeletonCircle>
              </Box>
            </Flex>
          </Box>
          <Stack
            px={{ base: 5, sm: 6 }}
            pt={12}
            pb={7}
            alignItems="center"
            spacing={4}
          >
            <Skeleton isLoaded={poap && !isLoading}>
              <Heading as="h2" fontSize="lg" fontFamily="display" textAlign="center">
                Claim your
                <br />
                <Text as="span" fontSize="2xl">{` ${poap?.name} `}</Text>
              </Heading>
            </Skeleton>

            <Skeleton isLoaded={poapLinks && !isPoapLinksLoading}>
              <Text
                color="gray"
                fontWeight="bold"
                fontSize="sm"
                textTransform="uppercase"
              >
                {`${poapLinks?.claimed}/${poapLinks?.total} claimed`}
              </Text>
            </Skeleton>

            <SkeletonText isLoaded={poap && !isLoading}>
              <Text color="gray" textAlign="center">
                {poap?.description}
              </Text>
            </SkeletonText>

            <Flex pt={8}>
              <Button colorScheme="indigo">Claim now!</Button>
            </Flex>
          </Stack>
        </Card>
      </Container>
      <Footer />
    </>
  )
}

export default Page
