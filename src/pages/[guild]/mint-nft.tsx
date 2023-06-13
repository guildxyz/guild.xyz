import {
  Box,
  Heading,
  HStack,
  Icon,
  Img,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import useGuild from "components/[guild]/hooks/useGuild"
import LogicDivider from "components/[guild]/LogicDivider"
import NftDetails from "components/[guild]/mint-nft/components/NftDetails"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import { Users } from "phosphor-react"
import { Fragment } from "react"

const IMAGE_SRC =
  "https://guild-xyz.mypinata.cloud/ipfs/QmRMiu8iiVNi6FCZS3QnHamzp6QVpXJp3a2JDFv98LPxME"

const Page = () => {
  // TEMP, for testing
  const { theme, imageUrl, name, roles } = useGuild()
  const role = roles?.find((r) => r.id === 56990) ?? roles?.[0] // 56990 is a role in Johnny's Guild
  const requirements = role?.requirements ?? []

  const requirementsSectionBgColor = useColorModeValue("gray.50", "blackAlpha.300")

  return (
    <Layout
      ogTitle="Mint NFT"
      background={theme?.color ?? "gray.900"}
      backgroundImage={theme?.backgroundImage}
      maxWidth="container.xl"
    >
      <Stack spacing={8}>
        <HStack>
          <GuildLogo imageUrl={imageUrl} size={8} />
          <Text as="span" fontFamily="display" fontWeight="bold">
            {name}
          </Text>
        </HStack>

        <SimpleGrid
          templateColumns={{
            base: "1fr",
            md: "1fr 1fr",
            xl: "7fr 5fr",
          }}
          gap={{ base: 6, lg: 8 }}
        >
          <Stack w="full" spacing={12}>
            <Card
              aspectRatio={1}
              bgColor="black"
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                position="absolute"
                inset={0}
                bgImage={IMAGE_SRC}
                transform="scale(1.5)"
                filter="blur(20px)"
                opacity={0.75}
              />
              <Img
                position="relative"
                maxW="80%"
                maxH="80%"
                src={IMAGE_SRC}
                alt="NFT image"
                filter="drop-shadow(0px 1rem 2rem black)"
              />
            </Card>

            <Stack spacing={8}>
              <Stack spacing={4}>
                <Heading as="h2" fontFamily="display" fontSize="4xl">
                  {`Joined ${name}`}
                </Heading>

                <HStack pb={2}>
                  <Text as="span">by Role:</Text>
                  <HStack>
                    <GuildLogo imageUrl={role?.imageUrl} size={6} />
                    <Text as="span" fontWeight="bold">
                      Member
                    </Text>
                  </HStack>

                  <HStack spacing={1} color="gray">
                    <Icon as={Users} boxSize={4} />
                    <Text as="span">
                      {new Intl.NumberFormat("en", { notation: "compact" }).format(
                        role?.memberCount ?? 0
                      )}
                    </Text>
                  </HStack>
                </HStack>

                <Text
                  lineHeight={1.75}
                >{`This is an on-chain proof that you joined ${name} on Guild.xyz.`}</Text>
                <Text lineHeight={1.75}>
                  Contrary to popular belief, Lorem Ipsum is not simply random text.
                  It has roots in a piece of classical Latin literature from 45 BC,
                  making it over 2000 years old. Richard McClintock, a Latin
                  professor at Hampden-Sydney College in Virginia, looked up one of
                  the more obscure Latin words, consectetur, from a Lorem Ipsum
                  passage, and going through the cites of the word in classical
                  literature, discovered the undoubtable source.
                </Text>
                <Text lineHeight={1.75}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                  a tincidunt nisi, eu cursus neque. Suspendisse bibendum sapien at
                  eleifend viverra. Vestibulum porttitor eget nunc eget gravida. In
                  hac habitasse platea dictumst. Etiam ut luctus urna, in rutrum
                  libero. Vestibulum et diam elementum, blandit ipsum quis, consequat
                  lacus. Mauris sed varius metus. In viverra risus turpis, a placerat
                  justo vehicula dictum. Vestibulum eu mollis justo, at semper orci.
                  Cras dapibus, tortor non ultricies commodo, nibh massa semper
                  lorem, ac facilisis eros dui et lacus.
                </Text>
              </Stack>

              <NftDetails
                chain="POLYGON"
                address="0xff04820c36759c9f5203021fe051239ad2dcca8a"
              />
            </Stack>
          </Stack>

          <Card w="full" h="max-content" position="sticky" top={{ base: 4, md: 5 }}>
            <Stack
              p={{ base: 5, md: 8 }}
              bgColor={requirementsSectionBgColor}
              spacing={{ base: 4, md: 8 }}
            >
              <Text
                as="span"
                fontSize="xs"
                fontWeight="bold"
                color="gray"
                textTransform="uppercase"
                noOfLines={1}
              >
                Requirements to qualify
              </Text>

              <Stack spacing={0}>
                {requirements.map((requirement, i) => (
                  <Fragment key={requirement.id}>
                    <RequirementDisplayComponent requirement={requirement} />
                    {i < requirements.length - 1 && (
                      <LogicDivider logic={role.logic} />
                    )}
                  </Fragment>
                ))}
              </Stack>

              <Button colorScheme="green">Mint</Button>
            </Stack>
          </Card>
        </SimpleGrid>
      </Stack>
    </Layout>
  )
}

export default Page
