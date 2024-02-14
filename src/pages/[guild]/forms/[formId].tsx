import { Box } from "@chakra-ui/react"
import { EditGuildDrawerProvider } from "components/[guild]/EditGuild/EditGuildDrawerContext"
import JoinModalProvider from "components/[guild]/JoinModal/JoinModalProvider"
import RoleRequirements from "components/[guild]/Requirements"
import { RoleRequirementsSkeleton } from "components/[guild]/Requirements/RoleRequirements"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import GuildImageAndName from "components/[guild]/collect/components/GuildImageAndName"
import FillForm from "components/[guild]/forms/FillForm"
import FormNoAccess from "components/[guild]/forms/FormNoAccess"
import useForms from "components/[guild]/hooks/useForms"
import useGuild from "components/[guild]/hooks/useGuild"
import Layout from "components/common/Layout"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { GetStaticPaths, GetStaticProps } from "next"
import { SWRConfig } from "swr"
import { Guild } from "types"
import fetcher from "utils/fetcher"
import parseDescription from "utils/parseDescription"

type Props = {
  formId: number
}

const FormPage = ({ formId }: Props) => {
  const { roles, imageUrl, guildPlatforms } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  const { data: forms } = useForms()
  const form = forms?.find((f) => f.id === formId)

  const relevantGuildPlatform = guildPlatforms.find(
    (gp) => gp.platformGuildData?.formId === formId
  )
  const role = roles.find((r) =>
    r.rolePlatforms.some((rp) => rp.guildPlatformId === relevantGuildPlatform?.id)
  )

  const { hasRoleAccess, isMember } = useRoleMembership(role?.id)

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
      mt={{ md: "-4" }}
    >
      {hasRoleAccess ? (
        <FillForm form={form} />
      ) : (
        <FormNoAccess isMember={isMember}>
          {!!role ? (
            <RoleRequirements role={role} isOpen isExpanded />
          ) : (
            <Box px={5} pb={5}>
              <RoleRequirementsSkeleton />
            </Box>
          )}
        </FormNoAccess>
      )}
    </Layout>
  )
}

const FormPageWrapper = ({ fallback, formId }): JSX.Element => (
  <SWRConfig value={fallback && { fallback }}>
    <ThemeProvider>
      <JoinModalProvider>
        <EditGuildDrawerProvider>
          <FormPage formId={formId} />
        </EditGuildDrawerProvider>
      </JoinModalProvider>
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
