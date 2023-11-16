import { useSteps } from "@chakra-ui/react"
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import { GuildFormType, PlatformName, RoleFormType } from "types"
import { TEMPLATES } from "./templates"

const ID_AFTER_DOMAIN_REGEX = /(?<=com\/).*$/

const CreateGuildContext = createContext<{
  setTemplate: (roleTemplateName: string) => void
  prevStep: () => void
  nextStep: () => void
  activeStep: number
  platform?: PlatformName
  setActiveStep: (index: number) => void
  removePlatform: (platformName) => void
  getTemplate: () => Array<RoleFormType>
  toggleReward: (roleTemplateName: string, guildPlatformIndex: number) => void
  stepPart: number
  setPart: (part: number) => void
  nextStepIsDisabled: boolean
  setDisabled: (value: boolean) => void
} | null>(null)

const CreateGuildProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const [stepPart, setPart] = useState(0)
  const [nextStepIsDisabled, setDisabled] = useState(false)

  const methods = useForm<GuildFormType>({
    mode: "all",
    defaultValues: {
      guildPlatforms: [],
      contacts: [{ type: "EMAIL", contact: "" }],
      theme: {
        color: "#71717a",
      },
      roles: [],
    },
  })

  const { append, remove } = useFieldArray({
    name: "roles",
    control: methods.control,
  })

  const removePlatform = (platformName: PlatformName) => {
    const guildPlatforms = JSON.parse(
      JSON.stringify(methods.getValues("guildPlatforms"))
    )

    methods.setValue(
      "guildPlatforms",
      guildPlatforms.filter(
        (guildPlatform) => guildPlatform.platformName !== platformName
      )
    )
  }

  const buildTemplate = () => {
    const templatesCopy: Array<RoleFormType> = JSON.parse(JSON.stringify(TEMPLATES))

    return templatesCopy
      .map((template) => {
        const twitterRequirementIndex = template.requirements.findIndex(
          (requriement) => requriement.type === "TWITTER_FOLLOW"
        )

        if (twitterRequirementIndex > -1)
          template.requirements[twitterRequirementIndex].data.id =
            ID_AFTER_DOMAIN_REGEX.exec(methods.getValues("socialLinks.TWITTER"))

        const discordPlatfromIndex = methods
          .getValues("guildPlatforms")
          .findIndex((guildPlatform) => guildPlatform.platformName === "DISCORD")

        if (discordPlatfromIndex > -1)
          template.rolePlatforms = [{ guildPlatformIndex: discordPlatfromIndex }]

        const joinDiscordServerRequirementIndex = template.requirements.findIndex(
          (requriement) => requriement.type === "DISCORD_MEMBER_SINCE"
        )

        if (joinDiscordServerRequirementIndex > -1)
          template.requirements[joinDiscordServerRequirementIndex].data.serverId =
            methods
              .getValues("guildPlatforms")
              .find(
                (guildPlatform) => guildPlatform.platformName === "DISCORD"
              )?.platformGuildId

        return template
      })
      .filter((template) => {
        const twitterRequirementIndex = template.requirements.findIndex(
          (requriement) => requriement.type === "TWITTER_FOLLOW"
        )
        const hasTwitter = methods.getValues("socialLinks.TWITTER")
        const twitterIsRequired = twitterRequirementIndex > -1

        const discordRequirementIndex = template.requirements.findIndex(
          (requriement) => requriement.type === "DISCORD_MEMBER_SINCE"
        )
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
    const roleIndex = methods
      .getValues("roles")
      .findIndex((role) => role.name === roleTemplateName)

    if (roleIndex > -1) {
      remove(roleIndex)
    } else {
      const originalTemplate = buildTemplate().find(
        (template) => template.name === roleTemplateName
      )

      const templateCopy = JSON.parse(JSON.stringify(originalTemplate))

      templateCopy.description = undefined

      append(templateCopy)
    }
  }

  const toggleReward = (roleTemplateName: string, guildPlatformIndex: number) => {
    const roleIndex = methods
      .getValues("roles")
      .findIndex((role) => role.name === roleTemplateName)

    const roleClicked: RoleFormType = methods.getValues("roles")[roleIndex]

    const reward = roleClicked.rolePlatforms?.find(
      (rolePlatform) => rolePlatform.guildPlatformIndex === guildPlatformIndex
    )

    if (reward) {
      methods.setValue(
        `roles.${roleIndex}.rolePlatforms`,
        roleClicked.rolePlatforms.filter(
          (rolePlatform) => rolePlatform.guildPlatformIndex !== guildPlatformIndex
        )
      )
    } else {
      const guildPlatform = methods.getValues("guildPlatforms")[guildPlatformIndex]
      const currentRolePlatforms = roleClicked.rolePlatforms
        ? roleClicked.rolePlatforms
        : []

      const rolePlatforms = [
        {
          guildPlatformIndex,
          platformRoleId:
            guildPlatform.platformName === "GOOGLE"
              ? guildPlatform.platformGuildData.role
              : undefined,
        },
        ...currentRolePlatforms,
      ]

      methods.setValue(`roles.${roleIndex}.rolePlatforms`, rolePlatforms)
    }
  }

  const {
    goToPrevious: prevStep,
    goToNext: nextStep,
    activeStep,
    setActiveStep,
  } = useSteps({
    index: 0,
    count: 5,
  })

  useEffect(() => {
    if (typeof window !== "undefined")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    if (activeStep > 0) return
  }, [activeStep])

  return (
    <CreateGuildContext.Provider
      value={{
        prevStep: () => {
          prevStep()
          setPart(0)
        },
        nextStep: () => {
          nextStep()
          setPart(0)
        },
        activeStep,
        removePlatform,
        setTemplate: toggleTemplate,
        getTemplate: buildTemplate,
        setActiveStep: (step) => {
          setActiveStep(step)
          setPart(0)
        },
        toggleReward,
        setPart,
        stepPart,
        nextStepIsDisabled,
        setDisabled,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateGuildContext.Provider>
  )
}

const useCreateGuildContext = () => useContext(CreateGuildContext)

export { CreateGuildProvider, useCreateGuildContext }
