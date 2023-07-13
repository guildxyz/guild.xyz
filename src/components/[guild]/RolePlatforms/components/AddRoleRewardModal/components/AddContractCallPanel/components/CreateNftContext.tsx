import { Chain } from "connectors"
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react"

enum ContractCallFunction {
  SIMPLE_CLAIM = "function claim(address payToken, address receiver, bytes calldata signature) payable",
}

export type CreateNftContextType = {
  data: {
    chain: Chain
    contractAddress: string
    function: ContractCallFunction
    argsToSign: string[]
    description: string
  }
  setData: Dispatch<SetStateAction<CreateNftContextType["data"]>>
}

const defaultValue: CreateNftContextType = {
  data: {
    chain: undefined,
    contractAddress: undefined,
    function: undefined,
    argsToSign: [],
    description: undefined,
  },
  setData: () => {},
}

const CreateNftContext = createContext<CreateNftContextType>(defaultValue)

type Props = {
  initialData?: CreateNftContextType["data"]
}

const CreateNftProvider = ({
  initialData,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const [data, setData] = useState<CreateNftContextType["data"]>(
    initialData ?? defaultValue.data
  )

  return (
    <CreateNftContext.Provider value={{ data, setData }}>
      {children}
    </CreateNftContext.Provider>
  )
}

const useCreateNftContext = () => useContext(CreateNftContext)

export { CreateNftProvider, useCreateNftContext }
