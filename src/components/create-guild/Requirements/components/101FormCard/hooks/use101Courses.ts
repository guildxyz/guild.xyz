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
        }
      }`,
    },
  }).then((res) => res?.data?.badges.filter((badge) => badge.courses[0]))

const use101Courses = () =>
  useSWRImmutable<Badge101[]>(`https://101.xyz/api/graphql`, fetchBadges)

export default use101Courses
