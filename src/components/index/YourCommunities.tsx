import { GridItem, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Link from "components/common/Link"
import { MutableRefObject, useEffect, useState } from "react"
import IntegrateCommunityCard from "./IntegrateCommunityCard"

type Props = {
  refAccess: MutableRefObject<HTMLDivElement>
}

const YourCommunities = ({ refAccess }: Props) => {
  const { account } = useWeb3React()
  /**
   * Since the CommunityCards are mounted into the category via Portal which doesn't
   * cause a rerender, we need to sync in a state if the category has communities or
   * not, so we can show the placeholder in case of emptiness
   */
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    // MutationObserver will fire the callback every time the element's childList changes
    const observer = new MutationObserver((records) => {
      setIsEmpty(records[0].target.childNodes.length < 2)
    })
    if (refAccess) observer.observe(refAccess.current, { childList: true })

    return () => observer.disconnect()
  }, [refAccess])

  if (!account) return <Text>Wallet not connected</Text>

  if (isEmpty)
    return (
      <GridItem colSpan={2}>
        <Text>
          You don't hold any social tokens that's on Agora.{" "}
          <Link href="register" colorScheme="blue">
            Integrate your token
          </Link>
        </Text>
      </GridItem>
    )

  return <IntegrateCommunityCard />
}

export default YourCommunities
