export default async function handler(req, res) {
  const dataJSON = await fetch(process.env.JUICEBOX_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: req.body,
  })
  const data = await dataJSON.json()
  const projects = data?.data?.projects

  if (!Array.isArray(projects)) {
    res.json([])
    return
  }

  const projectPromises = projects.map((project) =>
    fetch(`${process.env.JUICEBOX_IPFS}/${project.uri}`)
      .then((ipfsRes) => ipfsRes.json())
      .then((ipfsProject) => ({
        id: project.id,
        uri: project.uri,
        name: ipfsProject.name,
        logoUri: ipfsProject.logoUri,
      }))
  )

  const mappedData = await Promise.all(projectPromises)

  res.json(Array.isArray(mappedData) ? mappedData : [])
}
