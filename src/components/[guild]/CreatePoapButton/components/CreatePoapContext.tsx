import { createContext, PropsWithChildren, useContext, useState } from "react"
import { CreatedPoapData, CreatePoapForm } from "types"

// Using CreatePoapForm & CreatedPoapData as a type, because we'll merge the form data and the API response when the POAP is created.

const CreatePoapContext = createContext<{
  poapData: CreatePoapForm & CreatedPoapData
  setPoapData: (newData: CreatePoapForm & CreatedPoapData) => void
}>({
  poapData: null,
  setPoapData: () => {},
})

const CreatePoapProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const [poapData, setPoapData] = useState(null)

  return (
    <CreatePoapContext.Provider value={{ poapData, setPoapData }}>
      {children}
    </CreatePoapContext.Provider>
  )
}

const useCreatePoapContext = () => useContext(CreatePoapContext)

export { CreatePoapProvider, useCreatePoapContext }
