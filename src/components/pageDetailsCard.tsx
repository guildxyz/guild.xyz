import { Box, Image, Tag, TagLabel, TagLeftIcon, Wrap } from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import Link from "components/common/Link"
import { Users } from "phosphor-react"
import { PageDetailsCardData } from "types"

type Props = {
  pageData: PageDetailsCardData // TODO: PageCardBase type
}

const EMBED_IMAGE_SIZE = "30px"

const PageDetailsCard = ({ pageData }: Props): JSX.Element => (
  <Link
    href={`/help/${pageData.id}`}
    prefetch={false}
    _hover={{ textDecor: "none" }}
    borderRadius="2xl"
    w="full"
    h="full"
  >
    <DisplayCard title={pageData.title}>
      <Box m={1} boxSize={EMBED_IMAGE_SIZE}>
        {/* TODO: handle if there is no image */}
        <Image src={pageData.icon} alt="Card image" />
      </Box>
      <Wrap zIndex="1">
        {pageData.tags.map((tag, index) => (
          <Tag as="li" key={index}>
            <TagLeftIcon as={Users} />
            <TagLabel>{tag}</TagLabel>
          </Tag>
        ))}
      </Wrap>
    </DisplayCard>
  </Link>
)

export default PageDetailsCard
