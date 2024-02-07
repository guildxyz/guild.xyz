import { Box, HStack, Icon, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { EditGuildDrawerProvider } from "components/[guild]/EditGuild/EditGuildDrawerContext"
import useJoin from "components/[guild]/JoinModal/hooks/useJoin"
import RoleRequirements from "components/[guild]/Requirements"
import { RoleRequirementsSkeleton } from "components/[guild]/Requirements/RoleRequirements"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import GuildImageAndName from "components/[guild]/collect/components/GuildImageAndName"
import FillForm from "components/[guild]/forms/FillForm"
import useAccess from "components/[guild]/hooks/useAccess"
import useForms from "components/[guild]/hooks/useForms"
import useGuild from "components/[guild]/hooks/useGuild"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import { GetStaticPaths, GetStaticProps } from "next"
import { Lock, LockSimple, Wallet } from "phosphor-react"
import { SWRConfig } from "swr"
import { Guild } from "types"
import fetcher from "utils/fetcher"
import parseDescription from "utils/parseDescription"

type Props = {
  formId: number
}

const FormPage = ({ formId }: Props) => {
  const { id: guildId, roles, imageUrl, guildPlatforms } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const bgColor = useColorModeValue("gray.50", "blackAlpha.300")

  const { data: forms } = useForms()
  const form = forms?.find((f) => f.id === formId)

  const relevantGuildPlatform = guildPlatforms.find(
    (gp) => gp.platformGuildData?.formId === formId
  )
  const role = roles.find((r) =>
    r.rolePlatforms.some((rp) => rp.guildPlatformId === relevantGuildPlatform?.id)
  )

  const { isWeb3Connected, openWalletSelectorModal } = useWeb3ConnectionManager()

  // TODO: use the v2 hook here
  const { onSubmit, isLoading } = useJoin()
  const { hasAccess } = useAccess(role?.id)

  return (
    <Layout
      textColor={textColor}
      imageUrl={imageUrl}
      title={form?.name ?? "Fill form"}
      ogTitle={`Fill form${form?.name ? ` - ${form.name}` : ""}`}
      description={!!form?.description && parseDescription(form.description)}
      ogDescription={form?.description}
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
      backgroundOffset={46}
      backButton={<GuildImageAndName />}
      maxWidth="container.md"
    >
      {hasAccess ? (
        <FillForm form={form} />
      ) : (
        <Card>
          <Stack bgColor={bgColor}>
            <HStack justifyContent="space-between" p={5}>
              <HStack display={{ base: "none", md: "flex" }}>
                <Icon as={Lock} />
                <Text fontWeight="semibold">
                  This form is locked. Requirements to access:
                </Text>
              </HStack>

              <Button
                leftIcon={
                  <Icon
                    as={isWeb3Connected ? LockSimple : Wallet}
                    width={"0.9em"}
                    height="0.9em"
                  />
                }
                size="sm"
                borderRadius="lg"
                isLoading={isLoading}
                loadingText="Checking access"
                onClick={
                  isWeb3Connected
                    ? () =>
                        onSubmit({
                          guildId,
                        })
                    : () => openWalletSelectorModal()
                }
              >
                {isWeb3Connected
                  ? "Join Guild to check access"
                  : "Connect to access"}
              </Button>
            </HStack>

            {!!role ? (
              <RoleRequirements
                role={role}
                isOpen
                isExpanded
                onToggleExpanded={() => {}}
              />
            ) : (
              <Box px={5} pb={5}>
                <RoleRequirementsSkeleton />
              </Box>
            )}
          </Stack>
        </Card>
      )}
    </Layout>
  )
}

const FormPageWrapper = ({ fallback, formId }): JSX.Element => (
  <SWRConfig value={fallback && { fallback }}>
    <ThemeProvider>
      <EditGuildDrawerProvider>
        <FormPage formId={formId} />
      </EditGuildDrawerProvider>
    </ThemeProvider>
  </SWRConfig>
)

const getStaticProps: GetStaticProps = async ({ params }) => {
  const formId = +params.formId
  if (!formId)
    return {
      notFound: true,
    }

  const endpoint = `/v2/guilds/guild-page/${params.guild}`
  const guild: Guild = await fetcher(endpoint).catch((_) => ({}))

  if (!guild.id)
    return {
      notFound: true,
    }

  guild.isFallback = true

  return {
    props: {
      formId,
      fallback: {
        [endpoint]: guild,
      },
    },
  }
}

const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
})

export default FormPageWrapper
export { getStaticPaths, getStaticProps }
