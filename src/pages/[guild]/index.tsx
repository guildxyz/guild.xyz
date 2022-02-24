import {
  Divider,
  HStack,
  Stack,
  Tag,
  useBreakpointValue,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import { WithRumComponentContext } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import Section from "components/common/Section"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import LeaveButton from "components/[guild]/LeaveButton"
import Members from "components/[guild]/Members"
import RolesByPlatform from "components/[guild]/RolesByPlatform"
import RoleListItem from "components/[guild]/RolesByPlatform/components/RoleListItem"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuildMembers from "hooks/useGuildMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import dynamic from "next/dynamic"
import React, { useEffect, useMemo, useState } from "react"
import { SWRConfig, useSWRConfig } from "swr"
import { Guild } from "types"
import fetcher from "utils/fetcher"

const GuildPage = (): JSX.Element => {
  const { name, description, imageUrl, platforms, owner } = useGuild()
  const [DynamicEditGuildButton, setDynamicEditGuildButton] = useState(null)
  const [DynamicAddRoleButton, setDynamicAddRoleButton] = useState(null)

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
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  const { colorMode } = useColorMode()
  const guildLogoSize = useBreakpointValue({ base: 48, lg: 56 })
  const guildLogoIconSize = useBreakpointValue({ base: 20, lg: 28 })

  useEffect(() => {
    if (isOwner) {
      const EditGuildButton = dynamic(
        () => import("components/[guild]/EditGuildButton")
      )
      const AddRoleButton = dynamic(() => import("components/[guild]/AddRoleButton"))
      setDynamicEditGuildButton(EditGuildButton)
      setDynamicAddRoleButton(AddRoleButton)
    }
  }, [isOwner])

  return (
    <Layout
      title={name}
      textColor={textColor}
      description={description}
      showLayoutDescription
      image={
        <GuildLogo
          imageUrl={imageUrl}
          size={guildLogoSize}
          iconSize={guildLogoIconSize}
          mt={{ base: 1, lg: 2 }}
          bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
        />
      }
      action={
        <HStack>
          {DynamicEditGuildButton ? <DynamicEditGuildButton /> : <LeaveButton />}
        </HStack>
      }
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
    >
      <Stack position="relative" spacing="12">
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
                    <RoleListItem
                      key={role.id}
                      roleData={role}
                      isInitiallyExpanded={singleRole}
                    />
                  ))}
                {platform.platformType === "DISCORD" && DynamicAddRoleButton && (
                  <DynamicAddRoleButton />
                )}
              </VStack>
            </RolesByPlatform>
          ))}
        </VStack>
        <Section
          title="Members"
          titleRightElement={
            <Tag size="sm">
              {members?.filter((address) => !!address)?.length ?? 0}
            </Tag>
          }
        >
          <Members
            owner={owner}
            members={members}
            fallbackText="This guild has no members yet"
          />
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

export default WithRumComponentContext("Guild page", GuildPageWrapper)
