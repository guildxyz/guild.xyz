import useTokens from "hooks/useTokens"

const useTokenImage = (address: string): string => {
  const { tokens } = useTokens()

  if (!address?.length) return null

  const foundToken = tokens?.find((token) => token.address === address)

  if (!foundToken?.logoURI) return null

  return foundToken.logoURI
}

export default useTokenImage
