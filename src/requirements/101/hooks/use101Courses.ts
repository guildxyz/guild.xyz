import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

type Badge101 = {
  id: string
  onChainId: number
  imageUri: string
  courses: {
    id: string
    title: string
    creator: {
      image: string
    }
  }[]
  contract: {
    address
    chainId
  }
}

const fetchBadges = (endpoint: string) =>
  fetcher(endpoint, {
    headers: {
      Accept: "application/json",
    },
    body: {
      query: `{
        badges {
          id
          onChainId
          imageUri
          courses {
            id
            title
            creator {
              image
            }
          }
          contract {
            address
            chainId
          }
        }
      }`,
    },
  }).then((res) =>
    res?.data?.badges.filter(
      (badge) =>
        (badge.contract.chainId === 137 || badge.contract.chainId === 42220) &&
        badge.courses[0] &&
        // Temporarily filtering out [Testnet] and [archive] badges so we don't get duplicate IDs here
        !badge.courses[0].title?.toLowerCase()?.includes("[testnet]") &&
        !badge.courses[0].title?.toLowerCase()?.includes("[archive]")
    )
  )

const use101Courses = () =>
  useSWRImmutable<Badge101[]>(`https://101.xyz/api/graphql`, fetchBadges)

export default use101Courses
