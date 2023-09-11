import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react"

type State = { userId: number | null; address: string }

const AddressLinkContext = createContext<{
  addressLinkParams: State
  setAddressLinkParams: Dispatch<SetStateAction<State>>
}>(undefined)

const AddressLinkProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const [addressLinkParams, setAddressLinkParams] = useState<State>()

  return (
    <AddressLinkContext.Provider value={{ addressLinkParams, setAddressLinkParams }}>
      {children}
    </AddressLinkContext.Provider>
  )
}

const useAddressLinkContext = () => useContext(AddressLinkContext)

export { AddressLinkProvider, useAddressLinkContext }
