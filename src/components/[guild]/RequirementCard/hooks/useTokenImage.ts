import useTokens from "hooks/useTokens"

const useTokenImage = (chain: string, address: string): string => {
  const { tokens } = useTokens(chain)

  if (!address?.length) return null

  const foundToken = tokens?.find((token) => token.address === address)

  if (!foundToken?.logoURI) return null

  return foundToken.logoURI
}

export default useTokenImage
