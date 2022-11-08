import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react"

const BATCH_SIZE = 24

const ExplorerContext = createContext<{
  renderedGuildsCount: number
  setRenderedGuildsCount: Dispatch<SetStateAction<number>>
}>(null)

const ExplorerProvider = ({ children }: PropsWithChildren<any>): JSX.Element => {
  const [renderedGuildsCount, setRenderedGuildsCount] = useState(BATCH_SIZE)

  return (
    <ExplorerContext.Provider
      value={{ renderedGuildsCount, setRenderedGuildsCount }}
    >
      {children}
    </ExplorerContext.Provider>
  )
}

const useExplorer = () => useContext(ExplorerContext)

export default ExplorerProvider
export { useExplorer, BATCH_SIZE }
