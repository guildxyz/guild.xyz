import { useFieldArray, useFormContext } from "react-hook-form"
import { GuildFormType, RoleFormType } from "types"
import { TEMPLATES } from "../templates"

const ID_AFTER_DOMAIN_REGEX = /(?<=com\/).*$/

const useTemplate = () => {
  const methods = useFormContext<GuildFormType>()

  const { append, remove } = useFieldArray({
    name: "roles",
    control: methods.control,
  })

  const buildTemplate = () => {
    const templatesCopy: Array<RoleFormType> = structuredClone(TEMPLATES)

    return templatesCopy
      .map((template) => {
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        const twitterRequirementIndex = template.requirements.findIndex(
          (requriement) => requriement.type === "TWITTER_FOLLOW"
        )

        if (twitterRequirementIndex > -1)
          // @ts-expect-error TODO: fix this error originating from strictNullChecks
          template.requirements[twitterRequirementIndex].data.id =
            ID_AFTER_DOMAIN_REGEX.exec(methods.getValues("socialLinks.TWITTER"))

        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        const discordPlatfromIndex = methods
          .getValues("guildPlatforms")
          .findIndex((guildPlatform) => guildPlatform.platformName === "DISCORD")

        if (discordPlatfromIndex > -1)
          template.rolePlatforms = [{ guildPlatformIndex: discordPlatfromIndex }]

        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        const joinDiscordServerRequirementIndex = template.requirements.findIndex(
          (requriement) => requriement.type === "DISCORD_MEMBER_SINCE"
        )

        if (joinDiscordServerRequirementIndex > -1)
          // @ts-expect-error TODO: fix this error originating from strictNullChecks
          template.requirements[joinDiscordServerRequirementIndex].data.serverId =
            // @ts-expect-error TODO: fix this error originating from strictNullChecks
            methods
              .getValues("guildPlatforms")
              .find(
                (guildPlatform) => guildPlatform.platformName === "DISCORD"
              )?.platformGuildId

        return template
      })
      .filter((template) => {
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        const twitterRequirementIndex = template.requirements.findIndex(
          (requriement) => requriement.type === "TWITTER_FOLLOW"
        )
        const hasTwitter = methods.getValues("socialLinks.TWITTER")
        const twitterIsRequired = twitterRequirementIndex > -1

        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        const discordRequirementIndex = template.requirements.findIndex(
          (requriement) => requriement.type === "DISCORD_MEMBER_SINCE"
        )
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        const hasDiscord = methods
          .getValues("guildPlatforms")
          .find((guildPlatform) => guildPlatform.platformName === "DISCORD")
        const discordIsRequired = discordRequirementIndex > -1

        return !(
          (twitterIsRequired && !hasTwitter) ||
          (discordIsRequired && !hasDiscord)
        )
      })
  }

  const toggleTemplate = (roleTemplateName: string) => {
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    const roleIndex = methods
      .getValues("roles")
      .findIndex((role) => role.name === roleTemplateName)

    if (roleIndex > -1) {
      remove(roleIndex)
    } else {
      const originalTemplate = buildTemplate().find(
        (template) => template.name === roleTemplateName
      )

      const templateCopy = structuredClone(originalTemplate)

      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      templateCopy.description = undefined

      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      append(templateCopy)
    }
  }

  const toggleReward = (roleTemplateName: string, guildPlatformIndex: number) => {
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    const roleIndex = methods
      .getValues("roles")
      .findIndex((role) => role.name === roleTemplateName)

    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    const roleClicked: RoleFormType = methods.getValues("roles")[roleIndex]

    const reward = roleClicked.rolePlatforms?.find(
      (rolePlatform) => rolePlatform.guildPlatformIndex === guildPlatformIndex
    )

    if (reward) {
      methods.setValue(
        `roles.${roleIndex}.rolePlatforms`,
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        roleClicked.rolePlatforms.filter(
          (rolePlatform) => rolePlatform.guildPlatformIndex !== guildPlatformIndex
        )
      )
    } else {
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      const guildPlatform = methods.getValues("guildPlatforms")[guildPlatformIndex]
      const currentRolePlatforms = roleClicked.rolePlatforms
        ? roleClicked.rolePlatforms
        : []

      const rolePlatforms = [
        {
          guildPlatformIndex,
          platformRoleId:
            guildPlatform.platformName === "GOOGLE"
              ? // @ts-expect-error TODO: fix this error originating from strictNullChecks
                guildPlatform.platformGuildData.role
              : undefined,
        },
        ...currentRolePlatforms,
      ]

      methods.setValue(`roles.${roleIndex}.rolePlatforms`, rolePlatforms)
    }
  }

  return {
    buildTemplate,
    toggleReward,
    toggleTemplate,
  }
}

export default useTemplate
