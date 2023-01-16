import { useSteps } from "chakra-ui-steps"
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { GuildFormType, PlatformName as BasePlatformName } from "types"
import capitalize from "utils/capitalize"
import getRandomInt from "utils/getRandomInt"
import BasicInfo from "./BasicInfo"
import ChooseTemplate from "./ChooseTemplate"
import { Template } from "./ChooseTemplate/components/TemplateCard"
import CreateGuildIndex from "./CreateGuildIndex"

type PlatformName = BasePlatformName | "DEFAULT"
type TemplateType = "BASIC" | "GROWTH"

type Step = {
  label: string
  description?: string
  content: JSX.Element
}

const CreateGuildContext = createContext<{
  template: string | undefined
  setTemplate: Dispatch<SetStateAction<string>>
  steps: Step[]
  prevStep: () => void
  nextStep: () => void
  setStep: (step: number) => void
  activeStep: number
  platform?: PlatformName
  setPlatform: Dispatch<SetStateAction<PlatformName>>
  createDiscordRoles: boolean
  setCreateDiscordRoles: Dispatch<SetStateAction<boolean>>
  TEMPLATES: Record<string, Template>
} | null>(null)

const defaultIcon = `/guildLogos/${getRandomInt(286)}.svg`
const basicDefaultValues: GuildFormType = {
  name: "",
  description: "",
  imageUrl: defaultIcon,
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

const CreateGuildProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const [platform, setPlatform] = useState<PlatformName>(null)

  const { prevStep, nextStep, setStep, activeStep } = useSteps({
    initialStep: 0,
  })

  const methods = useForm<GuildFormType>({ mode: "all" })
  const guildName = useWatch({ control: methods.control, name: "name" })

  const [createDiscordRoles, setCreateDiscordRoles] = useState(false)

  const TEMPLATES: Record<TemplateType, Template> = {
    BASIC: {
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
          rolePlatforms: createDiscordRoles
            ? [{ guildPlatformIndex: 1 }]
            : undefined,
        },
      ],
    },
    GROWTH: {
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
      ],
    },
  }

  const [template, setTemplate] = useState<TemplateType>()

  const steps: Step[] = [
    {
      label: "Choose platform",
      description: `${
        platform === "DEFAULT"
          ? "Without platform"
          : capitalize(platform?.toLowerCase() ?? "")
      }${platform !== "DEFAULT" && guildName ? ` - ${guildName}` : ""}`,
      content: <CreateGuildIndex />,
    },
    {
      label: "Choose template",
      description: capitalize(template?.toLowerCase() ?? ""),
      content: <ChooseTemplate />,
    },
    {
      label: "Basic information",
      content: <BasicInfo />,
    },
  ]

  useEffect(() => {
    if (activeStep > 0) return
    methods.reset(defaultValues[platform ?? "DEFAULT"])
    setTemplate(null)
  }, [activeStep, platform])

  return (
    <CreateGuildContext.Provider
      value={{
        steps,
        prevStep,
        nextStep,
        setStep,
        activeStep,
        platform,
        setPlatform,
        template,
        setTemplate,
        createDiscordRoles,
        setCreateDiscordRoles,
        TEMPLATES,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateGuildContext.Provider>
  )
}

const useCreateGuildContext = () => useContext(CreateGuildContext)

export { CreateGuildProvider, useCreateGuildContext }
