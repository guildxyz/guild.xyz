import { Link } from "@chakra-ui/next-js"
import { Stack, Text } from "@chakra-ui/react"

const LINK_REGEX =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,8}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g

const parseDescription = (description?: string) => {
  if (typeof description !== "string" || typeof description?.matchAll !== "function")
    return

  const paragraphs = description.split("\n").filter(Boolean)

  const paragraphsWithLinks = paragraphs.map((p) => {
    const linkMatches = [...p.matchAll(LINK_REGEX)]

    if (!linkMatches) return p

    return p.split(LINK_REGEX).reduce((acc, curr, i) => {
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      acc.push(curr)
      if (linkMatches[i]) {
        acc.push(
          // @ts-expect-error TODO: fix this error originating from strictNullChecks
          <Link
            key={linkMatches[i][0]}
            href={linkMatches[i][0]}
            colorScheme={"primary"}
            isExternal
            display={"unset"}
            onClick={(e) => e.stopPropagation()}
          >
            {linkMatches[i][0]}
          </Link>
        )
      }

      return acc
    }, [])
  })

  const paragraphComponents = (
    <Stack spacing={4}>
      {paragraphsWithLinks.map((p, index) => (
        <Text key={index}>{p}</Text>
      ))}
    </Stack>
  )

  return paragraphComponents
}

export default parseDescription
