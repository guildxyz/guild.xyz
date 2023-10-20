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
import { FormProvider, useForm } from "react-hook-form"
import { PlatformName as BasePlatformName, GuildFormType } from "types"
import getRandomInt from "utils/getRandomInt"
import BasicInfo from "./BasicInfo"
import ChooseTemplate from "./ChooseTemplate"
import { Template } from "./ChooseTemplate/components/TemplateCard"
import CreateGuildIndex from "./CreateGuildIndex"

type PlatformName = BasePlatformName | "DEFAULT"
type TemplateType = "VERIFIED" | "MEMBER" | "SUPPORTER" | "OG_MEMBER"

type Step = {
  title: string
  label?: string
  description?: string
  content: JSX.Element
}

const CreateGuildContext = createContext<{
  setTemplate: (id: TemplateType, role: any) => void
  steps: Step[]
  prevStep: () => void
  nextStep: () => void
  activeStep: number
  platform?: PlatformName
  setActiveStep: (index: number) => void
  setPlatform: Dispatch<SetStateAction<PlatformName>>
  getTemplate: () => Partial<Record<TemplateType, Template>>
  TEMPLATES: Partial<Record<TemplateType, Template>>
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

const TEMPLATES: Partial<Record<TemplateType, Template>> = {
  MEMBER: {
    name: "Start from scratch",
    description: "Default role without special requirements",
    roles: [
      {
        name: "Member",
        logic: "AND",
        imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
        requirements: [
          {
            type: "FREE",
          },
        ],
      },
    ] as any[],
  },
  VERIFIED: {
    name: "Growth",
    description: "Basic anti-bot member verification",
    roles: [
      {
        name: "Verified member",
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
    ] as any[],
  },
  SUPPORTER: {
    name: "Growth",
    description: "Basic anti-bot member verification",
    roles: [
      {
        name: "Twitter fam",
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
    ] as any[],
  },
}

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

  const buildTemplate = () => {
    const newTemplates = JSON.parse(JSON.stringify(TEMPLATES))

    Object.entries(newTemplates).forEach(([id], index) => {
      newTemplates[id].roles[0].rolePlatforms = methods.getValues("guildPlatforms")
    })

    return newTemplates
  }

  const toggleTemplate = (id: TemplateType, roleToSend: any) => {
    const isSlected = methods
      .getValues("roles")
      .find((role) => role.name === TEMPLATES[id].roles[0].name)

    if (isSlected) {
      methods.setValue(
        "roles",
        methods
          .getValues("roles")
          .filter((role) => role.name !== TEMPLATES[id].roles[0].name) as any
      )
    } else {
      methods.setValue("roles", [roleToSend, ...methods.getValues("roles")])
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
      content: <BasicInfo />,
    },
    {
      title: "Choose template",
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
        TEMPLATES,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateGuildContext.Provider>
  )
}

const useCreateGuildContext = () => useContext(CreateGuildContext)

export { CreateGuildProvider, useCreateGuildContext, type TemplateType }
