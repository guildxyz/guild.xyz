import { Box, HStack, useColorModeValue } from "@chakra-ui/react"
import useIsStuck from "hooks/useIsStuck"
import { PropsWithChildren, createContext, useContext } from "react"

type Props = {
  rightElement?: JSX.Element
}

const TabsContext = createContext<{
  isStuck: boolean
}>(null)

const Tabs = ({ rightElement, children }: PropsWithChildren<Props>): JSX.Element => {
  const { ref, isStuck } = useIsStuck()

  const bgColor = useColorModeValue("white", "gray.800")

  return (
    <TabsContext.Provider value={{ isStuck }}>
      <HStack
        ref={ref}
        justifyContent="space-between"
        alignItems={"center"}
        position="sticky"
        top={"-1px"}
        py={2.5}
        mt={-3}
        mb={2}
        width="full"
        zIndex={isStuck ? "banner" : "auto"}
        _before={{
          content: `""`,
          position: "fixed",
          top: 0,
          left: 0,
          width: "full",
          // button height + padding
          height: "calc(var(--chakra-space-11) + (2 * var(--chakra-space-2-5)))",
          bgColor: bgColor,
          boxShadow: "md",
          transition: "opacity 0.2s ease, visibility 0.1s ease",
          visibility: isStuck ? "visible" : "hidden",
          opacity: isStuck ? 1 : 0,
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
