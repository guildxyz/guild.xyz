import useTokens from "hooks/useTokens"

const useTokenImage = (
  chain: string,
  address: string
): { tokenImage: string; isLoading: boolean } => {
  const { tokens, isLoading } = useTokens(chain)

  if (!address?.length) return { tokenImage: null, isLoading: false }

  const foundToken = tokens?.find((token) => token.address === address)

  if (!foundToken?.logoURI) return { tokenImage: null, isLoading: false }

  return { tokenImage: isLoading ? "" : foundToken.logoURI, isLoading }
}

export default useTokenImage
