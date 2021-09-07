import { Box, HStack, Tooltip, useColorMode } from "@chakra-ui/react"
import { PropsWithChildren, useEffect, useRef, useState } from "react"
import PageButton from "./components/PageButton"

type PaginationProps = {
  isAdminPage?: boolean
  isCommunityTabDisabled?: boolean
}

const Pagination = ({
  isAdminPage = false,
  isCommunityTabDisabled = false,
  children,
}: PropsWithChildren<PaginationProps>): JSX.Element => {
  const paginationRef = useRef()
  const [isSticky, setIsSticky] = useState(false)
  const { colorMode } = useColorMode()

  useEffect(() => {
    const handleScroll = () => {
      const current = paginationRef.current || null
      const rect = current?.getBoundingClientRect()

      // When the Pagination component becomes "sticky"...
      setIsSticky(rect?.top === 0)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <HStack
      ref={paginationRef}
      position="sticky"
      top={0}
      py={isSticky ? 2 : 0}
      height={isSticky ? 16 : 12}
      zIndex={isSticky ? "banner" : "auto"}
      _before={{
        content: `""`,
        position: "fixed",
        top: 0,
        left: 0,
        width: "full",
        height: 16,
        bgColor: colorMode === "light" ? "white" : "gray.800",
        boxShadow: "md",
        transition: "0.2s ease",
        visibility: isSticky ? "visible" : "hidden",
        opacity: isSticky ? 1 : 0,
      }}
    >
      <PageButton isAdminPage={isAdminPage} href="">
        Info
      </PageButton>

      <Tooltip
        label="You have to save general info of your token first"
        placement="bottom"
        isDisabled={!isCommunityTabDisabled}
      >
        <Box>
          <PageButton
            isAdminPage={isAdminPage}
            href="community"
            disabled={isCommunityTabDisabled}
          >
            Community
          </PageButton>
        </Box>
      </Tooltip>

      {/* <LinkButton href="twitter-bounty" disabled>
        Twitter bounty
      </LinkButton> */}

      <Box marginInlineStart="auto!important">{children}</Box>
    </HStack>
  )
}

export default Pagination
