import { Box, Button, ButtonGroup } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useState } from "react"
import {
  CreatePoapProvider,
  useCreatePoapContext,
} from "./components/CreatePoapContext"
import CreatePoapForm from "./components/CreatePoapForm"
import ImportPoap from "./components/ImportPoap"

type Props = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

type WrapperProps = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  discordServerId: string
}

const AddPoapPanel = ({ isOpen }: Props): JSX.Element => {
  const { poaps } = useGuild()
  const { activeStep, setStep, poapData, shouldCreatePoap } = useCreatePoapContext()
  const [tab, setTab] = useState("new")

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
    </Box>
  )
}

const CreatePoapWrapper = ({
  isOpen,
  onClose,
  onOpen,
  discordServerId,
}: WrapperProps): JSX.Element => (
  <CreatePoapProvider onClose={onClose} discordServerId={discordServerId}>
    <AddPoapPanel {...{ isOpen, onClose, onOpen }} />
  </CreatePoapProvider>
)

export default CreatePoapWrapper
