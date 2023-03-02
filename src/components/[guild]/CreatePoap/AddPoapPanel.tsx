import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { useState } from "react"
import { CreatePoapProvider } from "./components/CreatePoapContext"
import CreatePoapForm from "./components/CreatePoapForm"
import ImportPoap from "./components/ImportPoap"
import { SetupPoapRequirements } from "./components/PoapRequirements/PoapRequirements"

type Props = {
  onSuccess: () => void
  scrollToTop: () => void
}

const AddPoapPanel = ({ onSuccess, scrollToTop }: Props): JSX.Element => {
  const [step, setStep] = useState("home")

  const handleSetStep = (newStep) => {
    setStep(newStep)
    scrollToTop()
  }

  if (step === "requirements") return <SetupPoapRequirements onSuccess={onSuccess} />

  return (
    <Box>
      <Tabs size="sm" isFitted variant="solid" colorScheme="indigo">
        <TabList mb="8">
          <Tab>Create new POAP</Tab>
          <Tab>Import existing</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <CreatePoapForm setStep={handleSetStep} />
          </TabPanel>
          <TabPanel>
            <ImportPoap setStep={handleSetStep} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

const AddPoapPanelWrapper = ({ onSuccess, scrollToTop }: Props): JSX.Element => (
  <CreatePoapProvider>
    <AddPoapPanel {...{ onSuccess, scrollToTop }} />
  </CreatePoapProvider>
)

export default AddPoapPanelWrapper
