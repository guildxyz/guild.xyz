import { Box, Icon } from "@chakra-ui/react"
import { Question } from "@phosphor-icons/react"
import JoinModalProvider from "components/[guild]/JoinModal/JoinModalProvider"
import useActiveMembershipUpdate from "components/[guild]/JoinModal/hooks/useActiveMembershipUpdate"
import RoleRequirements from "components/[guild]/Requirements"
import { RoleRequirementsSkeleton } from "components/[guild]/Requirements/RoleRequirements"
import Requirement from "components/[guild]/Requirements/components/Requirement"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import GuildImageAndName from "components/[guild]/collect/components/GuildImageAndName"
import FillForm from "components/[guild]/forms/FillForm"
import FormNoAccess from "components/[guild]/forms/FormNoAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import Card from "components/common/Card"
import ErrorAlert from "components/common/ErrorAlert"
import Layout from "components/common/Layout"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { GetStaticPaths, GetStaticProps } from "next"
import { useEffect } from "react"
import { SWRConfig } from "swr"
import { Guild } from "types"
import fetcher from "utils/fetcher"
import parseDescription from "utils/parseDescription"

type Props = {
  formId: number
}

const FormPage = ({ formId }: Props) => {
  const { roles, imageUrl, guildPlatforms, isLoading } = useGuild()

  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  const { form, error, mutate: mutateForm } = useGuildForm(formId)

  /**
   * Mutating the form, so in case the user gets access to the form's role by
   * clicking on the join / re-check access button, we can show them the form right
   * away
   */
  const { data: activeMembershipUpdate } = useActiveMembershipUpdate()
  const isMembershipUpdateDone = activeMembershipUpdate?.done
  useEffect(() => {
    if (!isMembershipUpdateDone) return
    mutateForm()
  }, [isMembershipUpdateDone, mutateForm])

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
      {error ? (
        <Card>
          <ErrorAlert label="Couldn't load form" mb="0" />
        </Card>
      ) : form?.fields && role && hasRoleAccess ? (
        <FillForm form={form} />
      ) : (
        <FormNoAccess isMember={isMember}>
          {!!role ? (
            <RoleRequirements role={role} isOpen isExpanded />
          ) : (
            <Box px={5} pb={5}>
              {isLoading ? (
                <RoleRequirementsSkeleton />
              ) : (
                <Requirement image={<Icon as={Question} boxSize={5} />}>
                  Some secret requirements
                </Requirement>
              )}
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
        <FormPage formId={formId} />
      </JoinModalProvider>
    </ThemeProvider>
  </SWRConfig>
)

const getStaticProps: GetStaticProps = async ({ params }) => {
  const formId = +params.formId
  if (!formId)
    return {
      notFound: true,
      revalidate: 300,
    }

  const endpoint = `/v2/guilds/guild-page/${params.guild}`
  const guild: Guild = await fetcher(endpoint).catch((_) => ({}))

  if (!guild.id)
    return {
      notFound: true,
      revalidate: 300,
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
