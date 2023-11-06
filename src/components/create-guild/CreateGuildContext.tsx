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
import { PlatformName as BasePlatformName, GuildFormType, RoleFormType } from "types"
import getRandomInt from "utils/getRandomInt"
import BasicInfo from "./BasicInfo"
import ChooseTemplate from "./ChooseTemplate"
import CreateGuildIndex from "./CreateGuildIndex"

type PlatformName = BasePlatformName | "DEFAULT"
type TemplateType = "VERIFIED" | "MEMBER" | "SUPPORTER" | "OG_MEMBER"

type Step = {
  title: string
  label?: string | JSX.Element
  description?: string
  content: JSX.Element
}

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
  TEMPLATES: Array<RoleFormType>
  toggleReward: (roleTemplateName: string, guildPlatformIndex: number) => void
} | null>(null)

const defaultIcon = `/guildLogos/${getRandomInt(286)}.svg`
const basicDefaultValues: GuildFormType = {
  name: "",
  description: "",
  imageUrl: defaultIcon,
  contacts: [{ type: "EMAIL", contact: "" }],
}
export const defaultValues: Partial<Record<PlatformName, GuildFormType>> = {
  DISCORD: {
    ...basicDefaultValues,
    guildPlatforms: [
      {
        platformName: "DISCORD",
        platformGuildId: "",
      },
    ],
  },
  TELEGRAM: {
    ...basicDefaultValues,
    guildPlatforms: [
      {
        platformName: "TELEGRAM",
        platformGuildId: "",
      },
    ],
  },
  GITHUB: {
    ...basicDefaultValues,
    guildPlatforms: [
      {
        platformName: "GITHUB",
        platformGuildId: "",
      },
    ],
  },
  GOOGLE: {
    ...basicDefaultValues,
    guildPlatforms: [
      {
        platformName: "GOOGLE",
        platformGuildId: "",
      },
    ],
  },
  DEFAULT: basicDefaultValues,
}

const TEMPLATES: Array<RoleFormType> = [
  {
    name: "Member",
    logic: "AND",
    description: "Default role without special requirements",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "FREE",
      },
    ],
  },
  {
    name: "Verified member",
    description: "Basic anti-bot member verification",

    logic: "AND",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "COIN",
        chain: "ETHEREUM",
        address: "0x0000000000000000000000000000000000000000",
        data: {
          minAmount: 0.001,
        },
      },
      {
        type: "DISCORD_JOIN_FROM_NOW",
        data: {
          memberSince: 31536000000,
        },
      },
    ],
  },
  {
    name: "Twitter fam",
    description: "Basic anti-bot member verification",
    logic: "AND",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "TWITTER_FOLLOW",
        data: {
          id: "{your_twitter_handle}",
        },
      },
      {
        type: "TWITTER_FOLLOWER_COUNT",
        data: {
          minAmount: 50,
        },
      },
    ],
  },
]

const CreateGuildProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const [platform, setPlatform] = useState<PlatformName>(null)

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
    const newTemplates: Array<RoleFormType> = JSON.parse(JSON.stringify(TEMPLATES))

    return newTemplates.map((template) => {
      const twitterRequirementIndex = template.requirements.findIndex(
        (requriement) => requriement.type === "TWITTER_FOLLOW"
      )

      const idAfterDomain = /(?<=com\/).*$/

      //template.rolePlatforms = methods.getValues("guildPlatforms")

      if (twitterRequirementIndex > -1)
        template.requirements[twitterRequirementIndex].data.id = idAfterDomain.exec(
          methods.getValues("socialLinks.TWITTER")
        )

      return template
    })
  }

  const toggleTemplate = (roleTemplateName: string) => {
    const roleIndex = methods
      .getValues("roles")
      .findIndex((role) => role.name === roleTemplateName)

    if (roleIndex > -1) {
      remove(roleIndex)
    } else {
      append(buildTemplate().find((template) => template.name === roleTemplateName))
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

  const steps: Step[] = [
    {
      title: "Set platforms",
      label:
        "Connect platforms below that you build your community around. We’ll generate templates for your guild based on this",
      content: <CreateGuildIndex />,
    },
    {
      title: "Customize guild",
      label: <BasicInfo />,
      content: <></>,
    },
    {
      title: "Choose template",
      description: "1/2",
      label:
        "Your guild consists of roles that the members can satisfy the requirements of to gain access to their rewards. Choose some defaults to get you started!",
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

  const {
    goToPrevious: prevStep,
    goToNext: nextStep,
    activeStep,
    setActiveStep,
  } = useSteps({
    index: 0,
    count: steps.length,
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
        steps,
        prevStep,
        nextStep,
        activeStep,
        platform,
        setPlatform,
        setTemplate: toggleTemplate,
        getTemplate: buildTemplate,
        setActiveStep,
        toggleReward,
        TEMPLATES,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateGuildContext.Provider>
  )
}

const useCreateGuildContext = () => useContext(CreateGuildContext)

export { CreateGuildProvider, useCreateGuildContext, type TemplateType }
