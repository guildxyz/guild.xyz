import { Text } from "@chakra-ui/react"
import {
  CreateNftContextType,
  CreateNftProvider,
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

  // TODO: we should automatically create the contract call reward inside the CreateNftForm, save that data in a context, and use it from there (just like we did with the POAP rewards). This way we could use this same component both for adding an existing nft reward to a role and also for creating new nft rewards

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

  return <Text>TODO: select role / create new role using the new reward</Text>
}

const AddContractCallPanelWrapper = ({ onSuccess, platformGuildData }: Props) => (
  <CreateNftProvider initialData={platformGuildData}>
    <AddContractCallPanel onSuccess={onSuccess} />
  </CreateNftProvider>
)

export default AddContractCallPanelWrapper
