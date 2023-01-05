import { useSteps } from "chakra-ui-steps"
import { useRouter } from "next/router"
import { createContext, PropsWithChildren, useContext, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { GuildFormType, PlatformName, PlatformType } from "types"
import BasicInfo from "./BasicInfo"
import ChooseLayout from "./ChooseLayout"
import CreateGuildIndex from "./CreateGuildIndex"
import CreateGuildPlatform from "./CreateGuildPlatform"

type Step = {
  label: string
  description?: string
  content: () => JSX.Element
}

const CreateGuildContext = createContext<{
  steps: Step[]
  prevStep: () => void
  nextStep: () => void
  setStep: (step: number) => void
  activeStep: number
  platform?: PlatformName
}>({
  steps: [],
  prevStep: () => {},
  nextStep: () => {},
  setStep: () => {},
  activeStep: 0,
})

const getPlatformFromQueryParam = (queryParam: string): PlatformName | null => {
  if (!queryParam) return null

  const uppercasePlatform = queryParam.toUpperCase()
  if (PlatformType[uppercasePlatform]) return uppercasePlatform as PlatformName

  return null
}

const CreateGuildProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const steps: Step[] = [
    {
      label: "Choose platform",
      description: "You can connect more platforms later",
      content: CreateGuildIndex,
    },
    {
      label: "Create guild",
      content: CreateGuildPlatform,
    },
    {
      label: "Choose layout",
      content: ChooseLayout,
    },
    {
      label: "Basic information",
      content: BasicInfo,
    },
  ]

  const router = useRouter()
  const platform = getPlatformFromQueryParam(router.query.platform?.toString())

  const { prevStep, nextStep, setStep, activeStep } = useSteps({
    initialStep: platform ? 1 : 0,
  })

  useEffect(() => {
    if (activeStep > 1) return
    if (!platform) setStep(0)
    else setStep(1)
  }, [activeStep, platform])

  const methods = useForm<GuildFormType>({ mode: "all" })

  return (
    <CreateGuildContext.Provider
      value={{ steps, prevStep, nextStep, setStep, activeStep, platform }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateGuildContext.Provider>
  )
}

const useCreateGuildContext = () => useContext(CreateGuildContext)

export { CreateGuildProvider, useCreateGuildContext }
