import { Box, Button, ButtonGroup } from "@chakra-ui/react"
import { useState } from "react"
import { CreatePoapProvider } from "./components/CreatePoapContext"
import CreatePoapForm from "./components/CreatePoapForm"
import ImportPoap from "./components/ImportPoap"
import PoapRequirements from "./components/PoapRequirements"

type Props = {
  onSuccess: () => void
  scrollToTop: () => void
}

const AddPoapPanel = ({ onSuccess, scrollToTop }: Props): JSX.Element => {
  const [tab, setTab] = useState("new")
  const [step, setStep] = useState("home")

  const handleSetStep = (newStep) => {
    setStep(newStep)
    scrollToTop()
  }

  if (step === "requirements") return <PoapRequirements onSuccess={onSuccess} />

  return (
    <CreatePoapProvider>
      <Box>
        {/* TODO: use Tabs */}
        <ButtonGroup size="sm" w="full" mb="8">
          <Button
            w="full"
            borderRadius="md"
            onClick={() => setTab("new")}
            colorScheme={tab === "new" ? "indigo" : null}
          >
            Create new POAP
          </Button>

          <Button
            w="full"
            borderRadius="md"
            onClick={() => setTab("existing")}
            colorScheme={tab === "existing" ? "indigo" : null}
          >
            Import existing
          </Button>
        </ButtonGroup>

        {tab === "new" ? (
          <CreatePoapForm setStep={handleSetStep} />
        ) : (
          <ImportPoap setStep={handleSetStep} />
        )}
      </Box>
    </CreatePoapProvider>
  )
}

export default AddPoapPanel
