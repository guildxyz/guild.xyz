import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { useAddRewardContext } from "../AddRewardContext"
import { CreatePoapProvider } from "./components/CreatePoapContext"
import ImportPoap from "./components/ImportPoap"
import CreatePoapForm from "./components/PoapDataForm/CreatePoapForm"
import { SetupPoapRequirements } from "./components/PoapRequirements/PoapRequirements"

const AddPoapPanel = (): JSX.Element => {
  const { step, onClose } = useAddRewardContext()
  const { reset } = useFormContext()

  return (
    <>
      {step === "ROLES_REQUIREMENTS" ? (
        <SetupPoapRequirements
          onSuccess={() => {
            reset()
            onClose()
          }}
        />
      ) : (
        <Box>
          <Tabs size="sm" isFitted variant="solid" colorScheme="indigo">
            <TabList mb="8">
              <Tab>Create new POAP</Tab>
              <Tab>Import existing</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <CreatePoapForm />
              </TabPanel>
              <TabPanel>
                <ImportPoap />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </>
  )
}

const AddPoapPanelWrapper = (): JSX.Element => (
  <CreatePoapProvider>
    <AddPoapPanel />
  </CreatePoapProvider>
)

export default AddPoapPanelWrapper
