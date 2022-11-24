import { Image, Tag, TagLabel, Wrap } from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import Link from "components/common/Link"
import { PageDetailsCardData } from "types"

type Props = {
  pageData: PageDetailsCardData
}

const PageDetailsCard = ({ pageData }: Props): JSX.Element => (
  <Link
    href={`/brain/${pageData.id}`}
    prefetch={false}
    _hover={{ textDecor: "none" }}
    borderRadius="2xl"
  >
    <DisplayCard title={pageData.title}>
      {pageData.icon ? (
        <Image
          referrerPolicy="origin"
          src={pageData.icon}
          alt="Card image"
          w="100px"
          position="absolute"
          right="5%"
          top="19%"
          z-index="0"
        />
      ) : null}
      <Wrap zIndex="1">
        {pageData.tags?.map((tag, index) => (
          <Tag as="li" key={index}>
            <TagLabel>{tag}</TagLabel>
          </Tag>
        ))}
      </Wrap>
    </DisplayCard>
  </Link>
)

export default PageDetailsCard
