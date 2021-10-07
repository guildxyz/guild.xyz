export default async function handler(req, res) {
  const { address } = req.query

  const dataJSON = await fetch(
    `${process.env.NEXT_PUBLIC_OPENSEA_API}/assets?asset_contract_address=${address}`
  )
  const data = await dataJSON.json()

  // Returning it in the same format as we're returning NFTs on the `/metadata/info` API endpoint
  const nft = data?.assets?.[0]
    ? {
        name: data.assets[0].asset_contract.name,
        slug: data.assets[0].collection.slug,
        logoUri: data.assets[0].image_thumbnail_url,
        address: data.assets[0].asset_contract.address,
        type: "OPENSEA",
      }
    : null

  res.json(nft)
}
