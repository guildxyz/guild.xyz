import { Box, Button, ButtonGroup, Flex } from "@chakra-ui/react"
import { useState } from "react"
import {
  CreatePoapProvider,
  useCreatePoapContext,
} from "./components/CreatePoapContext"
import CreatePoapForm from "./components/CreatePoapForm"
import ImportPoap from "./components/ImportPoap"
import PoapRequirements from "./components/PoapRequirements"
import usePoapLinks from "./hooks/usePoapLinks"

type Props = {
  onSuccess: () => void
}

const AddPoapPanel = ({ onSuccess }: Props): JSX.Element => {
  const { poapData } = useCreatePoapContext()
  const { poapLinks } = usePoapLinks(poapData?.id)

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

      {tab === "new" ? <CreatePoapForm /> : <ImportPoap />}

      <Flex justifyContent={"right"} mt="2">
        <Button
          colorScheme="indigo"
          isDisabled={!poapData || (tab === "existing" && !poapLinks)}
          onClick={() => setStep("requirements")}
        >
          Next
        </Button>
      </Flex>
    </Box>
  )
}

const AddPoapPanelWrapper = ({ onSuccess }: Props): JSX.Element => (
  <CreatePoapProvider>
    <AddPoapPanel {...{ onSuccess }} />
  </CreatePoapProvider>
)

export default AddPoapPanelWrapper
