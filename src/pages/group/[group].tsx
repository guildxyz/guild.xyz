import { Stack } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import CategorySection from "components/index/CategorySection"
import { GetStaticPaths, GetStaticProps } from "next"
import groups from "temporaryData/groups"
import { Group } from "temporaryData/types"

type Props = {
  groupData: Group
}

const GroupPage = ({ groupData }: Props): JSX.Element => {
  return (
    <Layout title={groupData.name}>
      <Stack spacing="12">
        <CategorySection title="Guilds in this group" fallbackText="">
          TODO
        </CategorySection>
      </Stack>
    </Layout>
  )
}

const getStaticProps: GetStaticProps = async ({ params }) => {
  const localData = groups.find((i) => i.urlName === params.group)

  // TODO: fetch data from the API
  const groupData = localData

  if (!groupData) {
    return {
      notFound: true,
    }
  }

  return {
    props: { groupData },
    revalidate: 10,
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const mapToPaths = (_: Group[]) =>
    _.map(({ urlName: group }) => ({ params: { group } }))

  const pathsFromLocalData = mapToPaths(groups)

  // TODO: fetch data from the API
  const paths = pathsFromLocalData

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default GroupPage
