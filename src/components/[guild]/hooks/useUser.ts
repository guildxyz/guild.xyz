import { useWeb3React } from "@web3-react/core"
import { useState } from "react"
import useSWR from "swr"
import { User } from "types"

const getlinkedAddressesCount = (addresses: string[] | number) => {
  if (!addresses) return
  if (Array.isArray(addresses)) return addresses.length > 1 && addresses.length - 1
  return addresses > 1 && addresses - 1
}

const useUser = () => {
  const { account, library } = useWeb3React()
  const [validationData, setValidationData] = useState(null)

  const { isValidating, data } = useSWR<User>(
    account ? [`/user/${account}`, { validationData }] : null
  )

  return {
    isLoading: isValidating,
    ...data,
    linkedAddressesCount: getlinkedAddressesCount(data?.addresses),
    verifyAddress: () => setValidationData({ address: account, library }),
  }
}

export default useUser
