import Link from "next/link"
import { useMemo } from "react"

const LINK_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g

const useDescriptionWithLinks = (description?: string) => {
  const linkMatches = useMemo(
    () => (!description ? undefined : [...description.matchAll(LINK_REGEX)]),
    [description]
  )

  if (!linkMatches) return description

  return description.split(LINK_REGEX).reduce((acc, curr, i, array) => {
    if (curr === undefined) {
      const undefinedIndex = array
        .slice(0, i)
        .reduce((a, c) => a + (c === undefined ? 1 : 0), 0)
      acc.push(
        <Link
          key={linkMatches[undefinedIndex][0]}
          href={linkMatches[undefinedIndex][0]}
        >
          <a target="_blank">{linkMatches[undefinedIndex][0]}</a>
        </Link>
      )
    } else {
      acc.push(curr)
    }

    return acc
  }, [])
}

export default useDescriptionWithLinks
