import fetcher from "utils/fetcher"

export default async function handler(req, res) {
  const id = req.query.id

  if (!id) return res.status(403).json({})

  const QUERY = `{
    project(id:"${id}") {
      id
      metadataUri
    }
  }
  `

  const data = await fetcher(process.env.JUICEBOX_API, {
    headers: {
      Accept: "application/json",
    },
    body: { query: QUERY },
  })
  const project = data?.data?.project

  if (!project) {
    res.status(404).json({})
    return
  }

  const mappedData = await fetcher(
    `${process.env.JUICEBOX_IPFS}/${project.metadataUri}`
  )
    .then((ipfsProject) => ({
      id: project.id,
      uri: project.metadataUri,
      name: ipfsProject.name,
      logoUri: ipfsProject.logoUri,
    }))
    .catch((_) => ({}))

  res.json(mappedData)
}
