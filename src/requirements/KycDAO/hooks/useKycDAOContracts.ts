import useSWRImmutable from "swr/immutable"

const useKycDAOContracts = (): {
  kycDAOContracts: {
    label: string
    value: string
  }[]
  isLoading: boolean
  error: any
} => {
  const {
    data,
    isValidating: isLoading,
    error,
  } = useSWRImmutable("https://kycdao.xyz/api/public/status")

  const polygonData: Record<
    string,
    { address: string; payment_discount_percent: string }
  > = data?.smart_contracts_info?.PolygonMainnet ?? {}

  const kycDAOContracts = []

  for (const [key, value] of Object.entries(polygonData)) {
    kycDAOContracts.push({
      label: key,
      value: value?.address,
    })
  }

  return {
    isLoading,
    kycDAOContracts,
    error,
  }
}

export default useKycDAOContracts
