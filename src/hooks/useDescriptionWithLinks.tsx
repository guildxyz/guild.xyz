import Link from "next/link"
import { useMemo } from "react"

const LINK_REGEX =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g

const useDescriptionWithLinks = (description?: string) => {
  const linkMatches = useMemo(
    () => (!description ? undefined : [...description.matchAll(LINK_REGEX)]),
    [description]
  )

  if (!linkMatches) return description

  return description.split(LINK_REGEX).reduce((acc, curr, i) => {
    acc.push(curr)
    if (linkMatches[i]) {
      acc.push(
        <Link key={linkMatches[i][0]} href={linkMatches[i][0]}>
          <a target="_blank">{linkMatches[i][0]}</a>
        </Link>
      )
    }

    return acc
  }, [])
}

export default useDescriptionWithLinks
