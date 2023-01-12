import { Box } from "@chakra-ui/react"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import { useCreateGuildContext } from "../CreateGuildContext"
import Pagination from "../Pagination"
import TemplateCard from "./components/TemplateCard"

const ChooseTemplate = (): JSX.Element => {
  const {
    TEMPLATES,
    template: templateInContext,
    setTemplate,
    createDiscordRoles,
  } = useCreateGuildContext()

  const { control, setValue } = useFormContext<GuildFormType>()

  const roles = useWatch({ control, name: "roles" })
  const requirements = useWatch({ control, name: "roles.0.requirements" })

  useEffect(() => {
    if (
      !roles?.some(
        (r) => Object.values(r.rolePlatforms?.[0] ?? {}).filter(Boolean).length
      )
    )
      return
    roles?.forEach((_, i) =>
      setValue(
        `roles.${i}.rolePlatforms.0.guildPlatformIndex`,
        createDiscordRoles ? 0 : undefined
      )
    )
  }, [createDiscordRoles])

  return (
    <>
      {/* {platform === "DISCORD" && <CreateDiscordRolesSwitch />} */}

      <Box sx={{ columnCount: [1, 1, 2], columnGap: [4, 4, 6] }}>
        {Object.entries(TEMPLATES).map(([id, template], index) => (
          <TemplateCard
            key={index}
            id={id}
            {...template}
            selected={id === templateInContext}
            onClick={(newTemplateId) => {
              setValue("roles", TEMPLATES[newTemplateId].roles)
              setTemplate(newTemplateId)
            }}
          />
        ))}
      </Box>
      <Pagination nextButtonDisabled={!requirements?.length} />
    </>
  )
}

export default ChooseTemplate
