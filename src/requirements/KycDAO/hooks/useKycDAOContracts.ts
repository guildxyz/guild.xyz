import useSWRImmutable from "swr/immutable"

const useKycDAOContracts = (): {
  kycDAOContracts: {
    label: string
    value: string
  }[]
  isLoading: boolean
} => {
  const { data, isValidating: isLoading } = useSWRImmutable(
    "https://kycdao.xyz/api/public/status"
  )

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
  }
}

export default useKycDAOContracts
