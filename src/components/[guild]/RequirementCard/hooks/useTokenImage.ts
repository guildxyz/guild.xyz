import useTokens from "hooks/useTokens"

const useTokenImage = (address: string): string => {
  if (!address?.length) return null

  const tokens = useTokens()
  const foundToken = tokens?.find((token) => token.address === address)

  if (!foundToken?.logoURI) return null

  return foundToken.logoURI
}

export default useTokenImage
