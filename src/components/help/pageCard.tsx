import { Divider, Tag, TagLabel, TagLeftIcon, Wrap } from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import Link from "components/common/Link"
import { Users } from "phosphor-react"

type Props = {
  pageData: any // TODO: PageCardBase type
  echosystem?: boolean
}

const PageCard = ({ pageData }: Props): JSX.Element => (
  <Link
    href={`/help/${pageData.id}`}
    prefetch={false}
    _hover={{ textDecor: "none" }}
    borderRadius="2xl"
    w="full"
    h="full"
  >
    <DisplayCard title={pageData.properties.title.title[0].plain_text}>
      <Wrap zIndex="1">
        <Tag as="li" key={pageData.id}>
          <TagLeftIcon as={Users} />
          <TagLabel>{pageData.properties.kind.select?.name}</TagLabel>
        </Tag>
        <Divider />
        {pageData.properties.tags.multi_select.map((tag) => (
          <Tag as="li" key={tag.id}>
            <TagLeftIcon as={Users} />
            <TagLabel>{tag.name}</TagLabel>
          </Tag>
        ))}
      </Wrap>
    </DisplayCard>
  </Link>
)

export default PageCard
