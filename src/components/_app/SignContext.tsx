import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react"

const SignContext = createContext<{
  isSigning: boolean
  setIsSigning: Dispatch<SetStateAction<boolean>>
}>({ isSigning: false, setIsSigning: null })

const SignProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [isSigning, setIsSigning] = useState<boolean>(false)

  return (
    <SignContext.Provider value={{ isSigning, setIsSigning }}>
      {children}
    </SignContext.Provider>
  )
}

const useSign = () => useContext(SignContext)

export { SignProvider, useSign }
