import { useSteps } from "@chakra-ui/react"
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import { GuildFormType, PlatformName, RoleFormType } from "types"
import BasicInfo from "./BasicInfo"
import ChooseTemplate from "./ChooseTemplate"
import CreateGuildIndex from "./CreateGuildIndex"
import { TEMPLATES } from "./templates"

type Step = {
  title: string
  label?: string[] | JSX.Element[]
  description?: string[]
  content: JSX.Element
}

const ID_AFTER_DOMAIN_REGEX = /(?<=com\/).*$/

const CreateGuildContext = createContext<{
  setTemplate: (roleTemplateName: string) => void
  steps: Step[]
  prevStep: () => void
  nextStep: () => void
  activeStep: number
  platform?: PlatformName
  setActiveStep: (index: number) => void
  setPlatform: Dispatch<SetStateAction<PlatformName>>
  getTemplate: () => Array<RoleFormType>
  toggleReward: (roleTemplateName: string, guildPlatformIndex: number) => void
  stepPart: number
  setPart: (part: number) => void
} | null>(null)

const STEPS: Step[] = [
  {
    title: "Set platforms",
    label: [
      "Connect platforms below that you build your community around. We’ll generate templates for your guild based on this",
    ],
    content: <CreateGuildIndex />,
  },
  {
    title: "Customize guild",
    label: [<BasicInfo key={0} />],
    content: <></>,
  },
  {
    title: "Choose template",
    description: ["1/2", "2/2"],
    label: [
      "Your guild consists of roles that the members can satisfy the requirements of to gain access to their rewards. Choose some defaults to get you started!",
      "Choose rewards for the selected roles.",
    ],
    content: <ChooseTemplate />,
  },
  {
    title: "Edit roles",
    content: <></>,
  },
  {
    title: "Finish",
    content: <></>,
  },
]

const CreateGuildProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const [platform, setPlatform] = useState<PlatformName>(null)
  const [stepPart, setPart] = useState(0)

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

        return template
      })
      .filter((template) => {
        const twitterRequirementIndex = template.requirements.findIndex(
          (requriement) => requriement.type === "TWITTER_FOLLOW"
        )
        const hasTwitter = methods.getValues("socialLinks.TWITTER")
        const twitterIsRequired = twitterRequirementIndex > -1

        return !(twitterIsRequired && !hasTwitter)
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
    count: STEPS.length,
  })

  useEffect(() => {
    if (typeof window !== "undefined")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    if (activeStep > 0) return
  }, [activeStep, platform])

  return (
    <CreateGuildContext.Provider
      value={{
        steps: STEPS,
        prevStep: () => {
          prevStep()
          setPart(0)
        },
        nextStep: () => {
          nextStep()
          setPart(0)
        },
        activeStep,
        platform,
        setPlatform,
        setTemplate: toggleTemplate,
        getTemplate: buildTemplate,
        setActiveStep: (step) => {
          setActiveStep(step)
          setPart(0)
        },
        toggleReward,
        setPart,
        stepPart,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateGuildContext.Provider>
  )
}

const useCreateGuildContext = () => useContext(CreateGuildContext)

export { CreateGuildProvider, useCreateGuildContext }
