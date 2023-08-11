import { Chain } from "connectors"
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react"
import { ContractCallFunction } from "./CreateNftForm/hooks/useCreateNft"

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

const CreateNftProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const [data, setData] = useState<CreateNftContextType["data"]>(defaultValue.data)

  return (
    <CreateNftContext.Provider value={{ data, setData }}>
      {children}
    </CreateNftContext.Provider>
  )
}

const useCreateNftContext = () => useContext(CreateNftContext)

export { CreateNftProvider, useCreateNftContext }
