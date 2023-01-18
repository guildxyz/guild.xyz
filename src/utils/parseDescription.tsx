import Link from "components/common/Link"

const LINK_REGEX =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g

const parseDescription = (description?: string) => {
  if (typeof description !== "string" || typeof description?.matchAll !== "function")
    return

  const linkMatches = [...description.matchAll(LINK_REGEX)]

  if (!linkMatches) return description

  return description.split(LINK_REGEX).reduce((acc, curr, i) => {
    acc.push(curr)
    if (linkMatches[i]) {
      acc.push(
        <Link
          key={linkMatches[i][0]}
          href={linkMatches[i][0]}
          colorScheme={"primary"}
          isExternal
          display={"unset"}
        >
          {linkMatches[i][0]}
        </Link>
      )
    }

    return acc
  }, [])
}

export default parseDescription
