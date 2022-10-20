import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

type Course101 = {
  id: string
  title: string
  creator: {
    image: string
  }
  badge: {
    id: string
    onChainId: number
    imageUri: string
  }
}

const fetchBadges = (endpoint: string) =>
  fetcher(endpoint, {
    headers: {
      Accept: "application/json",
    },
    body: {
      query: `{
        courses {
          id
          title
          creator {
            image
          }
          badge {
            id
            onChainId
            imageUri
          }
        }
      }`,
    },
  }).then((res) => res?.data?.courses)

const use101Courses = () =>
  useSWRImmutable<Course101[]>(`https://101.xyz/api/graphql`, fetchBadges)

export default use101Courses
