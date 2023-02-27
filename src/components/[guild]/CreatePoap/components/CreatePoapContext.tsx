import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react"
import { CreatedPoapData, CreatePoapForm, Poap } from "types"

type PartialCreatePoapForm = {
  requested_codes?: number
}

const CreatePoapContext = createContext<{
  // Using CreatePoapForm & CreatedPoapData as a type, because we'll merge the form data and the API response when the POAP is created.
  poapData: (CreatePoapForm & CreatedPoapData) | (Poap & PartialCreatePoapForm)
  setPoapData: Dispatch<
    SetStateAction<
      (CreatePoapForm & CreatedPoapData) | (Poap & PartialCreatePoapForm)
    >
  >
}>({
  poapData: null,
  setPoapData: () => {},
})

const CreatePoapProvider = ({ children }: PropsWithChildren<any>): JSX.Element => {
  const [poapData, setPoapData] = useState(null)

  return (
    <CreatePoapContext.Provider
      value={{
        poapData,
        setPoapData,
      }}
    >
      {children}
    </CreatePoapContext.Provider>
  )
}

const useCreatePoapContext = () => useContext(CreatePoapContext)

export { CreatePoapProvider, useCreatePoapContext }
