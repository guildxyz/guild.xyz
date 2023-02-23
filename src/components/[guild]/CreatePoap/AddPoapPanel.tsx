import { Box, Button, ButtonGroup } from "@chakra-ui/react"
import { useState } from "react"
import { CreatePoapProvider } from "./components/CreatePoapContext"
import CreatePoapForm from "./components/CreatePoapForm"
import ImportPoap from "./components/ImportPoap"
import PoapRequirements from "./components/PoapRequirements"

type Props = {
  onSuccess: () => void
}

const AddPoapPanel = ({ onSuccess }: Props): JSX.Element => {
  const [tab, setTab] = useState("new")
  const [step, setStep] = useState("home")

  if (step === "requirements") return <PoapRequirements onSuccess={onSuccess} />

  return (
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
        <CreatePoapForm setStep={setStep} />
      ) : (
        <ImportPoap setStep={setStep} />
      )}
    </Box>
  )
}

const AddPoapPanelWrapper = ({ onSuccess }: Props): JSX.Element => (
  <CreatePoapProvider>
    <AddPoapPanel {...{ onSuccess }} />
  </CreatePoapProvider>
)

export default AddPoapPanelWrapper
