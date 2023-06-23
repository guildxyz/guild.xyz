import useSWRImmutable from "swr/immutable"

const CONFIG_ITEM_NAME = "v2Addresses"

const useV2Addresses = () => {
  const { data: v2Addresses } = useSWRImmutable<string[]>([
    `https://edge-config.vercel.com/${process.env.NEXT_PUBLIC_EDGE_CONFIG_ID}/item/${CONFIG_ITEM_NAME}`,
    ,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_EDGE_CONFIG_READ_ACCESS_TOKEN}`,
      },
    },
  ])

  return new Set(v2Addresses ?? [])
}

export default useV2Addresses
