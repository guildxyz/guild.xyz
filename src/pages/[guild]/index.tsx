import {
  Divider,
  HStack,
  Stack,
  Tag,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import Section from "components/common/Section"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import LeaveButton from "components/[guild]/LeaveButton"
import LogicDivider from "components/[guild]/LogicDivider"
import Members from "components/[guild]/Members"
import RequirementCard from "components/[guild]/RequirementCard"
import RolesByPlatform from "components/[guild]/RolesByPlatform"
import RoleListItem from "components/[guild]/RolesByPlatform/components/RoleListItem"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuildMembers from "hooks/useGuildMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import dynamic from "next/dynamic"
import React, { useEffect, useMemo } from "react"
import { SWRConfig, useSWRConfig } from "swr"
import { Guild } from "types"
import fetcher from "utils/fetcher"

const DynamicEditButtonGroup = dynamic(
  () => import("components/[guild]/EditButtonGroup"),
  { ssr: false }
)

const GuildPage = (): JSX.Element => {
  const { name, description, imageUrl, platforms } = useGuild()

  const roles = useMemo(() => {
    if (!platforms || platforms.length < 1) return []

    return platforms
      .map((platform) => platform.roles)
      ?.reduce((arr1, arr2) => arr1.concat(arr2), [])
  }, [platforms])
  const singleRole = useMemo(() => roles?.length === 1, [roles])

  const { account } = useWeb3React()
  const isOwner = useIsOwner(account)
  const members = useGuildMembers(roles)
  const { textColor, localThemeColor } = useThemeContext()

  const { colorMode } = useColorMode()

  return (
    <Layout
      title={name}
      textColor={textColor}
      description={description}
      showLayoutDescription
      imageUrl={imageUrl}
      imageBg={textColor === "primary.800" ? "primary.800" : "transparent"}
      action={
        <HStack>{isOwner ? <DynamicEditButtonGroup /> : <LeaveButton />}</HStack>
      }
      background={localThemeColor}
      backgroundImage={"/assets/fire.png"}
    >
      <Stack position="relative" spacing="12">
        {singleRole ? (
          <VStack width="full" alignItems="start" spacing={{ base: 5, sm: 6 }}>
            <RolesByPlatform
              key={platforms[0].platformIdentifier}
              platformType={platforms[0].platformType}
              platformName={platforms[0].platformName}
              roleIds={platforms[0].roles.map((role) => role.id)}
            />
            <VStack width="full" maxW="md">
              {platforms[0].roles[0].requirements.map((requirement, i) => (
                <React.Fragment key={i}>
                  <RequirementCard requirement={requirement} />
                  {i < platforms[0].roles[0].requirements.length - 1 && (
                    <LogicDivider logic={platforms[0].roles[0].logic} />
                  )}
                </React.Fragment>
              ))}
            </VStack>
          </VStack>
        ) : (
          <VStack spacing={{ base: 5, sm: 6 }}>
            {platforms?.map((platform) => (
              <RolesByPlatform
                key={platform.platformIdentifier}
                platformType={platform.platformType}
                platformName={platform.platformName}
                roleIds={platform.roles?.map((role) => role.id)}
              >
                <VStack
                  px={{ base: 5, sm: 6 }}
                  py={3}
                  divider={
                    <Divider
                      borderColor={
                        colorMode === "light" ? "blackAlpha.200" : "whiteAlpha.300"
                      }
                    />
                  }
                >
                  {platform.roles
                    ?.sort(
                      (role1, role2) => role2.members?.length - role1.members?.length
                    )
                    ?.map((role) => (
                      <RoleListItem key={role.id} roleData={role} />
                    ))}
                </VStack>
              </RolesByPlatform>
            ))}
          </VStack>
        )}
        <Section
          title={
            <HStack spacing={2} alignItems="center">
              <Text as="span">Members</Text>
              <Tag size="sm">
                {members?.filter((address) => !!address)?.length ?? 0}
              </Tag>
            </HStack>
          }
        >
          <Members members={members} fallbackText="This guild has no members yet" />
        </Section>
      </Stack>
    </Layout>
  )
}

type Props = {
  fallback: { string: Guild }
}

const GuildPageWrapper = ({ fallback }: Props): JSX.Element => {
  /**
   * Manually triggering mutate on mount because useSWRImmutable doesn't do because
   * of the fallback
   */
  const { mutate } = useSWRConfig()
  useEffect(() => {
    mutate(Object.keys(fallback)[0])
  }, [])

  const urlName = Object.values(fallback)[0].urlName

  return (
    <>
      <LinkPreviewHead path={urlName} />
      <SWRConfig value={{ fallback }}>
        <ThemeProvider>
          <GuildPage />
        </ThemeProvider>
      </SWRConfig>
    </>
  )
}

const getStaticProps: GetStaticProps = async ({ params }) => {
  const endpoint = `/guild/urlName/${params.guild?.toString()}`

  const data = await fetcher(endpoint).catch((_) => ({}))

  if (!data?.id)
    return {
      notFound: true,
    }

  return {
    props: {
      fallback: {
        [endpoint]: data,
      },
    },
    revalidate: 10,
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const mapToPaths = (_: Guild[]) =>
    Array.isArray(_) ? _.map(({ urlName: guild }) => ({ params: { guild } })) : []

  const paths = await fetcher(`/guild`).then(mapToPaths)

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default GuildPageWrapper
