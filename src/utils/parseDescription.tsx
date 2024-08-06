import { Anchor } from "@/components/ui/Anchor"

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
      acc.push(curr)
      if (linkMatches[i]) {
        acc.push(
          <Anchor
            key={linkMatches[i][0]}
            href={linkMatches[i][0]}
            // TODO: generate custom (non-Chakra) variables in the theme context
            className="text-[var(--chakra-colors-primary-500)]"
            onClick={(e) => e.stopPropagation()}
          >
            {linkMatches[i][0]}
          </Anchor>
        )
      }

      return acc
    }, [])
  })

  const paragraphComponents = (
    <div className="flex w-full flex-col gap-4">
      {paragraphsWithLinks.map((p, index) => (
        <p key={index}>{p}</p>
      ))}
    </div>
  )

  return paragraphComponents
}

export default parseDescription
