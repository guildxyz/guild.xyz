import fetcher from "utils/fetcher"

export default async function handler(req, res) {
  const data = await fetcher(process.env.JUICEBOX_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: req.body,
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
