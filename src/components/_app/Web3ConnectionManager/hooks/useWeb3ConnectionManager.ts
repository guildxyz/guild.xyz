import { useContext } from "react"
import { Web3ConnectionManagerContext } from "../Web3ConnectionManager"

const useWeb3ConnectionManager = () => useContext(Web3ConnectionManagerContext)

export default useWeb3ConnectionManager
