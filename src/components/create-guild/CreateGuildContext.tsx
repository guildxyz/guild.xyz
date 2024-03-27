import { useSteps } from "@chakra-ui/react"
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { FormProvider, useForm } from "react-hook-form"
import { GuildFormType } from "types"
import { TEMPLATES } from "./templates"

const CreateGuildContext = createContext<{
  prevStep: () => void
  nextStep: () => void
  activeStep: number
  setActiveStep: (index: number) => void
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
      roles: [TEMPLATES[0]],
    },
  })

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
        setActiveStep: (step) => {
          setActiveStep(step)
          setPart(0)
        },
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
