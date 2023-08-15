import {
  Box,
  HStack,
  IconButton,
  ModalBody,
  ModalHeader,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react"
import { ArrowLeft } from "phosphor-react"
import { useFormContext } from "react-hook-form"
import { useAddRewardContext } from "../AddRewardContext"
import { CreatePoapProvider } from "./components/CreatePoapContext"
import ImportPoap from "./components/ImportPoap"
import CreatePoapForm from "./components/PoapDataForm/CreatePoapForm"
import { SetupPoapRequirements } from "./components/PoapRequirements/PoapRequirements"

const AddPoapPanel = (): JSX.Element => {
  const { modalRef, setSelection, step, onClose } = useAddRewardContext()
  const { reset } = useFormContext()

  return (
    <>
      <ModalHeader>
        <HStack>
          <IconButton
            rounded="full"
            aria-label="Back"
            size="sm"
            mb="-3px"
            icon={<ArrowLeft size={20} />}
            variant="ghost"
            onClick={() => setSelection(null)}
          />
          <Text>Add POAP</Text>
        </HStack>
      </ModalHeader>

      <ModalBody ref={modalRef}>
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
      </ModalBody>
    </>
  )
}

const AddPoapPanelWrapper = (): JSX.Element => (
  <CreatePoapProvider>
    <AddPoapPanel />
  </CreatePoapProvider>
)

export default AddPoapPanelWrapper
