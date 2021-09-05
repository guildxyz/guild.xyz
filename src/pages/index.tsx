import {
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useColorMode,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import CategorySection from "components/index/CategorySection"
import CommunityCard from "components/index/CommunityCard"
import IntegrateCommunityCard from "components/index/IntegrateCommunityCard"
import { GetStaticProps } from "next"
import Head from "next/head"
import { MagnifyingGlass } from "phosphor-react"
import React, { useMemo, useRef, useState } from "react"
import type { Community } from "temporaryData/communities"
import { communities as communitiesJSON } from "temporaryData/communities"
import tokens from "temporaryData/tokens"

// Set this to true if you don't want the data to be fetched from backend
const DEBUG = false

type Props = {
  communities: Community[]
}

/**
 * Instead of loopig through communities and building 3 arrays categorizing them then
 * rendering CommunityCards of those arrys in the CategorySection components, we just
 * render all CommunityCards here and mount them into the appropriate section via
 * Portals, because this way we can use our existing hooks for the logic of where
 * they belong to.
 */
const AllCommunities = ({ communities }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const refAccess = useRef<HTMLDivElement>(null)
  const [searchInput, setSearchInput] = useState("")
  const inputTimeout = useRef(null)
  const filteredCommunities = useMemo(
    () =>
      communities.filter(({ name }) =>
        name.toLowerCase().includes(searchInput.toLowerCase())
      ),
    [communities, searchInput]
  )

  const { colorMode } = useColorMode()

  const handleOnChange = async ({ target: { value } }) => {
    window.clearTimeout(inputTimeout.current)
    inputTimeout.current = setTimeout(() => setSearchInput(value), 300)
  }

  return (
    <>
      <Head>
        <meta
          property="og:image"
          content="https://app.agora.space/explorer_thumbnail.png"
        />
      </Head>
      <Layout
        title="Social token explorer"
        description="Find all existing social tokens in the explorer from your favourite communities."
      >
        <InputGroup size="lg" mb={16} maxW="600px">
          <InputLeftElement>
            <MagnifyingGlass color="#858585" size={20} />
          </InputLeftElement>
          <Input
            placeholder="Search for communities, DAOs or creators"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            colorScheme="primary"
            borderRadius="15px"
            bg={colorMode === "light" ? "white" : "gray.900"}
            onChange={handleOnChange}
          />
        </InputGroup>

        <Stack spacing={12}>
          <CategorySection
            title="Your communities"
            placeholder="You don't have access to any communities"
            ref={refAccess}
          >
            {account && <IntegrateCommunityCard />}
          </CategorySection>
          <CategorySection
            title="Other tokenized communities"
            placeholder="There aren't any other communities"
          >
            {filteredCommunities.map((community) => (
              <CommunityCard
                community={community}
                key={community.id}
                refAccess={refAccess}
              />
            ))}
          </CategorySection>
        </Stack>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const communities =
    DEBUG && process.env.NODE_ENV !== "production"
      ? communitiesJSON
      : await fetch(`${process.env.NEXT_PUBLIC_API}/community`).then((response) =>
          response.ok ? response.json() : communitiesJSON
        )

  return {
    props: { communities: [...communities, ...tokens] },
    revalidate: 10,
  }
}

export default AllCommunities
