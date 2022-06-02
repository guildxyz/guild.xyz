import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react"
import { CreatedPoapData, CreatePoapForm } from "types"

// Using CreatePoapForm & CreatedPoapData as a type, because we'll merge the form data and the API response when the POAP is created.

const CreatePoapContext = createContext<{
  shouldCreatePoap: boolean
  setShouldCreatePoap: Dispatch<SetStateAction<boolean>>
  poapData: CreatePoapForm & CreatedPoapData
  setPoapData: Dispatch<SetStateAction<CreatePoapForm & CreatedPoapData>>
}>({
  shouldCreatePoap: false,
  setShouldCreatePoap: () => {},
  poapData: null,
  setPoapData: () => {},
})

const CreatePoapProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const [shouldCreatePoap, setShouldCreatePoap] = useState(false)
  const [poapData, setPoapData] = useState(null)

  return (
    <CreatePoapContext.Provider
      value={{ shouldCreatePoap, setShouldCreatePoap, poapData, setPoapData }}
    >
      {children}
    </CreatePoapContext.Provider>
  )
}

const useCreatePoapContext = () => useContext(CreatePoapContext)

export { CreatePoapProvider, useCreatePoapContext }
