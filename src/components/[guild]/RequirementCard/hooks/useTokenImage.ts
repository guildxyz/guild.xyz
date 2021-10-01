import useTokensList from "hooks/useTokensList"

const useTokenImage = (address: string): string => {
  if (!address.length) return null

  const tokens = useTokensList()
  const foundToken = tokens?.find((token) => token.address === address)

  if (!foundToken?.logoURI) return null

  return foundToken.logoURI
}

export default useTokenImage
