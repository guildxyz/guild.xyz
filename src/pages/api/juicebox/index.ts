import fetcher from "utils/fetcher"

const QUERY = `{
  projects(first:1000) {
    id
    uri
  }
}
`

export default async function handler(_, res) {
  const data = await fetcher(process.env.JUICEBOX_API, {
    headers: {
      Accept: "application/json",
    },
    body: { query: QUERY },
  })
  const projects = data?.data?.projects

  if (!Array.isArray(projects)) {
    res.json([])
    return
  }

  const projectPromises = projects.map((project) =>
    fetcher(`${process.env.JUICEBOX_IPFS}/${project.uri}`).then((ipfsProject) => ({
      id: project.id,
      uri: project.uri,
      name: ipfsProject.name,
      logoUri: ipfsProject.logoUri,
    }))
  )

  const mappedData = await Promise.all(projectPromises)

  res.json(Array.isArray(mappedData) ? mappedData : [])
}
