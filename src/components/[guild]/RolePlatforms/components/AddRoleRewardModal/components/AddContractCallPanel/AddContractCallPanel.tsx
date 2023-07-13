import { Text } from "@chakra-ui/react"
import { useState } from "react"
import CreateNftForm from "./components/CreateNftForm"

type Props = {
  onSuccess: () => void
}

const AddContractCallPanel = ({ onSuccess }: Props) => {
  const [contractAddress, setContractAddress] = useState<string>()

  // TODO: we should automatically create the contract call reward inside the CreateNftForm, save that data in a context, and use it from there (just like we did with the POAP rewards). This way we could use this same component both for adding an existing nft reward to a role and also for creating new nft rewards

  if (!contractAddress) return <CreateNftForm onSuccess={setContractAddress} />

  return <Text>TODO: select role / create new role using the new reward</Text>
}

export default AddContractCallPanel
