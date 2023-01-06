import { useSteps } from "chakra-ui-steps"
import { useRouter } from "next/router"
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
import { GuildFormType, PlatformName, PlatformType } from "types"
import capitalize from "utils/capitalize"
import getRandomInt from "utils/getRandomInt"
import BasicInfo from "./BasicInfo"
import ChooseLayout from "./ChooseLayout"
import CreateGuildIndex from "./CreateGuildIndex"
import CreateGuildPlatform from "./CreateGuildPlatform"

type Step = {
  label: string
  description?: string
  title?: string
  subtitle?: string
  content: () => JSX.Element
}

const CreateGuildContext = createContext<{
  layout: string | undefined
  setLayout: Dispatch<SetStateAction<string>>
  steps: Step[]
  prevStep: () => void
  nextStep: () => void
  setStep: (step: number) => void
  activeStep: number
  platform?: PlatformName
} | null>(null)

const getPlatformFromQueryParam = (queryParam: string): PlatformName | null => {
  if (!queryParam) return null

  const uppercasePlatform = queryParam.toUpperCase()
  if (PlatformType[uppercasePlatform]) return uppercasePlatform as PlatformName

  return null
}

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
}

const CreateGuildProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const router = useRouter()
  const platform = getPlatformFromQueryParam(router.query.platform?.toString())

  const { prevStep, nextStep, setStep, activeStep } = useSteps({
    initialStep: 0,
  })

  const methods = useForm<GuildFormType>({ mode: "all" })
  const guildName = useWatch({ control: methods.control, name: "name" })

  const [layout, setLayout] = useState<string>()

  const steps: Step[] = [
    {
      label: "Choose platform",
      description: capitalize(platform?.toLowerCase() ?? ""),
      title: "Choose platform",
      subtitle: "You can connect more platforms later",
      content: CreateGuildIndex,
    },
    {
      label: "Create guild",
      description: guildName,
      title: `Create guild${
        platform ? `on ${capitalize(platform?.toLowerCase() ?? "")}` : ""
      }`,
      subtitle:
        platform === "DISCORD"
          ? "Adding the bot and creating the Guild won't change anything on your server"
          : "",
      content: CreateGuildPlatform,
    },
    {
      label: "Choose layout",
      description: capitalize(layout?.toLowerCase() ?? ""),
      content: ChooseLayout,
    },
    {
      label: "Basic information",
      content: BasicInfo,
    },
  ]

  useEffect(() => {
    // Update the stepper
    if (activeStep > 1) return
    if (!platform) setStep(0)
    else setStep(1)

    // Reset the form on platform change
    methods.reset(defaultValues[platform])
  }, [platform])

  return (
    <CreateGuildContext.Provider
      value={{
        steps,
        prevStep,
        nextStep,
        setStep,
        activeStep,
        platform,
        layout,
        setLayout,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateGuildContext.Provider>
  )
}

const useCreateGuildContext = () => useContext(CreateGuildContext)

export { CreateGuildProvider, useCreateGuildContext }
