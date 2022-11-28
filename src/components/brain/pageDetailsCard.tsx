import { Image, Tag, TagLabel, Wrap } from "@chakra-ui/react"
import DisplayBrainCard from "components/common/DisplayBrainCard"
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
    <DisplayBrainCard title={pageData.title}>
      {pageData.backgroundImage && (
        <Image
          src={pageData.backgroundImage}
          alt="background image"
          w="100%"
          top={-2}
          position="absolute"
          opacity="80%"
          _before={{
            content: `""`,
            opacity: "100%",
            position: "absolute",
            transition: "opacity 0.2s",
          }}
          _hover={{
            _before: {
              opacity: "100%",
            },
          }}
          _active={{
            _before: {
              opacity: "100%",
            },
          }}
        />
      )}
      {pageData.icon ? (
        <Image
          referrerPolicy="origin"
          src={pageData.icon}
          alt="Card image"
          w="100px"
          position="absolute"
          right="12px"
          bottom="0"
          pb="12px"
          z-index="0"
        />
      ) : null}
      <Wrap zIndex="1" maxW="190px" pl="16px">
        {pageData.tags?.map((tag, index) => (
          <Tag as="li" background="rgba(0, 0, 0, 0.77)" key={index}>
            <TagLabel>{tag}</TagLabel>
          </Tag>
        ))}
      </Wrap>
    </DisplayBrainCard>
  </Link>
)

export default PageDetailsCard
