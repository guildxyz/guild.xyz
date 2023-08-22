import { Box, HStack, useColorModeValue } from "@chakra-ui/react"
import useIsStuck from "hooks/useIsStuck"
import { createContext, PropsWithChildren, useContext } from "react"

type Props = {
  sticky?: boolean
  rightElement?: JSX.Element
}

// button height + padding
export const TABS_HEIGHT =
  "calc(var(--chakra-space-11) + (2 * var(--chakra-space-3)))"
// size: sm button height + padding
export const TABS_HEIGHT_SM =
  "calc(var(--chakra-space-8) + (2 * var(--chakra-space-3)))"

const TabsContext = createContext<{
  isStuck: boolean
}>(null)

const Tabs = ({
  sticky,
  rightElement,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { ref, isStuck } = useIsStuck()

  const bgColor = useColorModeValue("white", "gray.800")

  return (
    <TabsContext.Provider value={{ isStuck }}>
      <HStack
        id="tabs"
        ref={ref}
        justifyContent="space-between"
        alignItems="center"
        position={sticky ? "sticky" : "relative"}
        top={0}
        py={3}
        mt={-3}
        mb={2}
        width="full"
        zIndex={sticky && isStuck ? "banner" : "auto"}
        _before={{
          content: `""`,
          position: "fixed",
          top: 0,
          left: 0,
          width: "full",
          height: sticky && isStuck ? TABS_HEIGHT : 0,
          bgColor: bgColor,
          boxShadow: "md",
          transition: "height .2s",
        }}
      >
        <Box
          position="relative"
          ml={-8}
          minW="0"
          sx={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent)",
          }}
        >
          <HStack
            overflowX="auto"
            px={8}
            sx={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
              button: {
                transition: "all .2s",
              },
            }}
          >
            {children}
          </HStack>
        </Box>
        {rightElement}
      </HStack>
    </TabsContext.Provider>
  )
}

export const useIsTabsStuck = () => useContext(TabsContext)

export default Tabs
