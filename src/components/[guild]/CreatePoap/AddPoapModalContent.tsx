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
import { MutableRefObject, useState } from "react"
import { CreatePoapProvider } from "./components/CreatePoapContext"
import ImportPoap from "./components/ImportPoap"
import CreatePoapForm from "./components/PoapDataForm/CreatePoapForm"
import { SetupPoapRequirements } from "./components/PoapRequirements/PoapRequirements"

type Props = {
  modalRef: MutableRefObject<any>
  goBack: () => void
  onSuccess: () => void
}

const AddPoapModalContent = ({
  modalRef,
  goBack,
  onSuccess,
}: Props): JSX.Element => {
  const [step, setStep] = useState("home")

  const scrollToTop = () => modalRef.current?.scrollTo({ top: 0 })

  const handleSetStep = (newStep) => {
    setStep(newStep)
    scrollToTop()
  }

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
            onClick={goBack}
          />
          <Text>Add POAP</Text>
        </HStack>
      </ModalHeader>

      <ModalBody ref={modalRef}>
        {step === "requirements" ? (
          <SetupPoapRequirements onSuccess={onSuccess} />
        ) : (
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
        )}
      </ModalBody>
    </>
  )
}

const AddPoapModalContentWrapper = (props: Props): JSX.Element => (
  <CreatePoapProvider>
    <AddPoapModalContent {...props} />
  </CreatePoapProvider>
)

export default AddPoapModalContentWrapper
