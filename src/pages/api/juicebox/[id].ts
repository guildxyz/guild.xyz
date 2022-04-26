import fetcher from "utils/fetcher"

export default async function handler(req, res) {
  const id = req.query.id

  if (!id) return res.status(403).json({})

  const QUERY = `{
    projects(where:{id:${id}}) {
      id
      uri
    }
  }
  `

  const data = await fetcher(process.env.JUICEBOX_API, {
    headers: {
      Accept: "application/json",
    },
    body: { query: QUERY },
  })
  const projects = data?.data?.projects

  if (!Array.isArray(projects) || !projects[0]) {
    res.status(404).json({})
    return
  }

  const [project] = projects
  const mappedData = await fetcher(`${process.env.JUICEBOX_IPFS}/${project.uri}`)
    .then((ipfsProject) => ({
      id: project.id,
      uri: project.uri,
      name: ipfsProject.name,
      logoUri: ipfsProject.logoUri,
    }))
    .catch((_) => ({}))

  res.json(mappedData)
}
