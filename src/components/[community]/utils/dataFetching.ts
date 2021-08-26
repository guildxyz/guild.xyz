import { GetStaticPaths, GetStaticProps } from "next"
import { communities } from "temporaryData/communities"
import tokens from "temporaryData/tokens"
import { Community } from "temporaryData/types"

// Set this to true if you don't want the data to be fetched from backend
const DEBUG = false

const getStaticProps: GetStaticProps = async ({ params, preview }) => {
  const localData =
    communities.find((i) => i.urlName === params.community) ??
    tokens.find((i) => i.urlName === params.community)

  const communityData =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetch(
          `${process.env.NEXT_PUBLIC_API}/community/urlName/${params.community}`
        ).then((response: Response) => (response.ok ? response.json() : localData))

  if (!communityData) {
    return {
      notFound: true,
    }
  }

  return {
    props: { communityData, preview: !!preview },
    revalidate: 10,
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const mapToPaths = (_: Community[]) =>
    _.map(({ urlName: community }) => ({ params: { community } }))

  const pathsFromLocalData = mapToPaths(communities)
  const tokenPaths = mapToPaths(tokens)

  const paths =
    DEBUG && process.env.NODE_ENV !== "production"
      ? pathsFromLocalData
      : await fetch(`${process.env.NEXT_PUBLIC_API}/community`).then((response) =>
          response.ok ? response.json().then(mapToPaths) : pathsFromLocalData
        )

  return {
    paths: [...paths, ...tokenPaths],
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }
