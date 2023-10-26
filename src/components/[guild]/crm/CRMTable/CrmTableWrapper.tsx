import { Flex, Table, useColorModeValue } from "@chakra-ui/react"
import Card, { useCardBg } from "components/common/Card"
import useScrollEffect from "hooks/useScrollEffect"
import { PropsWithChildren, memo, useEffect, useRef, useState } from "react"
import { TABS_HEIGHT_SM, TABS_SM_BUTTONS_STYLES } from "../../Tabs/Tabs"
import { IDENTITIES_COLLAPSED_STYLE } from "../IdentitiesExpansionToggle"

type Props = {
  isValidating: boolean
  setSize: any
}

const HEADER_HEIGHT = "61px"
const CHECKBOX_COLUMN_WIDTH = 45

const CrmTableWrapper = memo(
  ({ isValidating, setSize, children }: PropsWithChildren<Props>) => {
    const cardBg = useCardBg()
    const theadBoxShadow = useColorModeValue("md", "xl")

    /**
     * Observing if we've scrolled to the bottom of the page. The table has to be the
     * last element anyway so we can't scroll past it, and it works more reliable
     * than useIsStucked
     */
    const [isStuck, setIsStuck] = useState(false)
    useScrollEffect(() => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        setIsStuck(true)
      } else setIsStuck(false)
    }, [])

    const scrollContainerRef = useRef(null)
    const [isIdentityStuck, setIsIdentityStuck] = useState(false)
    useScrollEffect(
      () => {
        const { scrollLeft, scrollTop, scrollHeight, clientHeight } =
          scrollContainerRef.current

        if (scrollLeft > CHECKBOX_COLUMN_WIDTH) setIsIdentityStuck(true)
        else setIsIdentityStuck(false)

        if (scrollTop + clientHeight >= scrollHeight - 300 && !isValidating) {
          setSize((prevSize) => prevSize + 1)
        }
      },
      [scrollContainerRef.current, isValidating],
      null,
      scrollContainerRef.current
    )

    /** "100vw without scrollbar" solution, so the tables sides doesn't get cut off */
    useEffect(() => {
      const setVw = () => {
        const vw = document.documentElement.clientWidth / 100
        document.documentElement.style.setProperty("--vw", `${vw}px`)
      }
      setVw()
      window.addEventListener("resize", setVw)

      return () => {
        window.removeEventListener("resize", setVw)
      }
    }, [])

    return (
      <Flex justifyContent={"center"} position="relative" zIndex="banner">
        {/**
         * Handling scroll based styles with pure css, so it's performant. Passing isStuck &
         * isIdentityStuck props before to style with CSS in JS caused to rerender everything
         * on change and was really laggy with huge data
         */}
        <style>
          {/* not using overflow-y: hidden just hiding the scrollbar, so it's possible
        to scroll back at the top and get out of the stucked state */}
          {isStuck &&
            `body::-webkit-scrollbar {display: none !important; scrollbar-width: none; -webkit-appearance: none;}
           #tabs::before {height: calc(${TABS_HEIGHT_SM} + ${HEADER_HEIGHT}); background-color: ${cardBg}}
           ${TABS_SM_BUTTONS_STYLES}
           thead {box-shadow: var(--chakra-shadows-${theadBoxShadow})}
           th {border-radius: 0 !important}`}
          {isIdentityStuck &&
            `.identityTd {background: ${cardBg}}
              @media only screen and (max-width: 600px) {
                ${IDENTITIES_COLLAPSED_STYLE}
                .identitiesToggle {display: none}
                .identityTd {max-width: 130px}
              }`}
          {/* the table is elevated to be above the headers shadow, and the popovers need to be elevated above that */}
          {`.chakra-popover__popper { z-index: var(--chakra-zIndices-banner) !important }
          body {overflow-x: hidden !important}`}
        </style>
        <Flex
          ref={scrollContainerRef}
          w={isStuck ? "100vw" : "calc(var(--vw, 1vw) * 100)"}
          flex="1 0 auto"
          h={`calc(100vh - ${TABS_HEIGHT_SM})`}
          overflowY={isStuck ? "auto" : "hidden"}
        >
          <Card overflow="visible" h="fit-content" mx="auto" mb="2">
            <Table
              borderColor="whiteAlpha.300"
              minWidth={{
                base: "container.sm",
                sm: "700px",
                md: "880px",
                lg: "calc(var(--chakra-sizes-container-lg) - calc(var(--chakra-space-10) * 2))",
              }}
              // needed so the Th elements can have border
              sx={{ borderCollapse: "separate", borderSpacing: 0 }}
            >
              {children}
            </Table>
          </Card>
        </Flex>
      </Flex>
    )
  }
)

export default CrmTableWrapper
