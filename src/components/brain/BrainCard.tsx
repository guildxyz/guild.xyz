import { Img, Tag, TagLabel, Wrap } from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import Link from "components/common/Link"
import slugify from "slugify"
import { BrainCardData } from "types"
type Props = {
  pageData: BrainCardData
}

const BrainCard = ({ pageData }: Props): JSX.Element => {
  const renderedTags = pageData.tags
    .filter((tag) => tag === "reward" || tag === "requirement")
    .sort((a, b) => a.length - b.length)
  const slugifiedTitle = slugify(pageData.title, { lower: true })

  return (
    <Link
      href={`/brain/${slugifiedTitle}`}
      prefetch={false}
      _hover={{ textDecor: "none" }}
      borderRadius="2xl"
      w="full"
      h="full"
    >
      <DisplayCard image={pageData.icon} title={pageData.title}>
        <Wrap zIndex="1">
          {renderedTags.map((tag, index) => (
            <Tag as="li" key={index}>
              <Img src={`/${tag}.svg`} h="14px" alt="tag icon" mr="2" />
              <TagLabel>{tag}</TagLabel>
            </Tag>
          ))}
        </Wrap>
      </DisplayCard>
    </Link>
  )
}

export default BrainCard
