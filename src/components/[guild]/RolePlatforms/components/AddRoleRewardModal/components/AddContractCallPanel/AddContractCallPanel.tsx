import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import {
  CreateNftContextType,
  useCreateNftContext,
} from "./components/CreateNftContext"
import CreateNftForm from "./components/CreateNftForm"

type Props = {
  onSuccess: () => void
  platformGuildData: CreateNftContextType["data"]
}

const AddContractCallPanel = ({ onSuccess }: Omit<Props, "platformGuildData">) => {
  const {
    data: { contractAddress },
    setData,
  } = useCreateNftContext()

  if (!contractAddress)
    return (
      <CreateNftForm
        onSuccess={(deployedContractAddress) =>
          setData((prevData) => ({
            ...prevData,
            contractAddress: deployedContractAddress,
          }))
        }
      />
    )

  return (
    <Tabs size="sm" isFitted variant="solid" colorScheme="indigo">
      <TabList mb="8">
        <Tab>Add to existing role(s)</Tab>
        <Tab>Create new role (add requirements)</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Add to existing role(s) - TODO</TabPanel>
        <TabPanel>Create new role (add requirements) - TODO</TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default AddContractCallPanel
