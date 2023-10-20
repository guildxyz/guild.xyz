import { VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, GuildPlatform } from "types"
import CreateGuildButton from "../CreateGuildButton"
import { TemplateType, useCreateGuildContext } from "../CreateGuildContext"
import GuildCreationProgress from "../GuildCreationProgress"
import TemplateCard, { Template } from "./components/TemplateCard"

const ChooseTemplate = (): JSX.Element => {
  const { triedEager, openWalletSelectorModal, isWalletSelectorModalOpen } =
    useWeb3ConnectionManager()
  const { account } = useWeb3React()

  useEffect(() => {
    if (!triedEager || account || isWalletSelectorModalOpen) return
    openWalletSelectorModal()
  }, [triedEager, account, isWalletSelectorModalOpen])

  const { TEMPLATES, getTemplate, setTemplate, nextStep } = useCreateGuildContext()

  const { control, getValues, formState } = useFormContext<GuildFormType>()

  const requirements = useWatch({ control, name: "roles.0.requirements" })
  const roles = useWatch({ control, name: "roles" })

  return (
    <>
      <VStack>
        {Object.entries(getTemplate()).map(
          ([id, template]: [id: TemplateType, template: Template], index) => (
            <TemplateCard
              key={index}
              id={id}
              selectedGuildPlatforms={findRelevantPlatforms(
                id,
                getValues("guildPlatforms")
              )}
              selected={
                !!roles.find((selected) => selected.name === template.roles[0].name)
              }
              {...template}
              onClick={(newTemplateId: TemplateType) => {
                const role = TEMPLATES[newTemplateId].roles[0]

                console.log("xy ", roles, template.name)

                role.rolePlatforms = convertRolePlatformsToGuildPLatformIndecies(
                  findRelevantPlatforms(newTemplateId, getValues("guildPlatforms")),
                  getValues("guildPlatforms")
                ) as any

                setTemplate(id as TemplateType, role)
              }}
            />
          )
        )}
      </VStack>
      <GuildCreationProgress
        next={nextStep}
        progress={65}
        isDisabled={!requirements?.length}
        customButton={
          <CreateGuildButton
            isDisabled={
              !getValues("name") || !!Object.values(formState.errors).length
            }
          />
        }
      />
    </>
  )
}

function findRelevantPlatforms(templateId: TemplateType, guildPlatforms) {
  if (templateId === "MEMBER") return guildPlatforms

  return []
}

function convertRolePlatformsToGuildPLatformIndecies(
  rolePlatforms: GuildPlatformExtended[],
  guildPlatforms: GuildPlatformExtended[]
) {
  return rolePlatforms.map((rolePlatform) => {
    const index = guildPlatforms.findIndex(
      (guildPlatform) => guildPlatform.platformName === rolePlatform.platformName
    )

    return {
      guildPlatformIndex: index,
      platformRoleId:
        rolePlatform.platformName === "GOOGLE"
          ? rolePlatform.platformGuildId
          : undefined,
    }
  })
}

type GuildPlatformExtended = Partial<GuildPlatform> & { platformName: string }
export default ChooseTemplate
