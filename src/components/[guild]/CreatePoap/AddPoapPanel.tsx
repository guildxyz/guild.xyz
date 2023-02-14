import { Box, Button, ButtonGroup, Flex } from "@chakra-ui/react"
import { useState } from "react"
import {
  CreatePoapProvider,
  useCreatePoapContext,
} from "./components/CreatePoapContext"
import CreatePoapForm from "./components/CreatePoapForm"
import ImportPoap from "./components/ImportPoap"
import usePoapLinks from "./hooks/usePoapLinks"

type Props = {
  onSuccess: () => void
}

const AddPoapPanel = ({ onSuccess }: Props): JSX.Element => {
  const { poapData } = useCreatePoapContext()
  const [showSetReqs, setShowSetReqs] = useState(false)
  const { poapLinks } = usePoapLinks(poapData?.id)
  const [tab, setTab] = useState("new")

  if (showSetReqs)
    return (
      <Box>
        Set requirements
        <Flex justifyContent={"right"} mt="2">
          <Button
            colorScheme="green"
            isDisabled={!poapData || (tab === "existing" && !poapLinks)}
            onClick={onSuccess}
          >
            Done
          </Button>
        </Flex>
      </Box>
    )

  return (
    <Box>
      {/* TODO: use Tabs */}
      <ButtonGroup size="sm" w="full" mb="8" /* variant="subtle" */>
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
          onClick={() => setShowSetReqs(true)}
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
