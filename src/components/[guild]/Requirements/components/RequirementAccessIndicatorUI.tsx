import {
  Center,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Tag,
  useColorMode,
} from "@chakra-ui/react"
import { FC, PropsWithChildren, useState } from "react"

type Props = {
  colorScheme: string
  icon: FC
  circleBgSwatch?: { light: number; dark: number }
  isAlwaysOpen?: boolean
}

const CIRCLE_SIZE = 2
const CIRCLE_OPEN_STYLES = {
  bg: "unset",
  width: 7,
  height: 7,
  borderRadius: 0,
  "> *": {
    opacity: 1,
  },
}

const RequirementAccessIndicatorUI = ({
  colorScheme,
  icon,
  circleBgSwatch,
  isAlwaysOpen,
  children,
}: PropsWithChildren<Props>) => {
  // blackAlpha.300 on top of gray.700 => #35353A
  // const cardBg = useColorModeValue("var(--chakra-colors-gray-50)", "#35353A")
  const { colorMode } = useColorMode()
  const [openCount, setOpenCount] = useState(0)

  // just an easter egg appreciating the cool morphing animation we have
  const onOpen = () => {
    if (isAlwaysOpen) return

    setOpenCount((count) => {
      const newCount = count + 1
      return newCount
    })
  }

  return (
    <Flex
      width={isAlwaysOpen ? CIRCLE_OPEN_STYLES.width : CIRCLE_SIZE}
      height="full"
      justifyContent={"flex-end"}
      alignItems="center"
    >
      <Center
        pl="6"
        /**
         * Was used so it overlays the requirement text on hover on small screens
         * with a nice fade, instead of just growing on top of it. Removed for now
         * because the requirements are on a lighter background on a non-accessed
         * form page and couldn't handle it nicely, we'll see what to do with it
         * later
         */
        // bg={`linear-gradient(to right, transparent 0px, ${cardBg} var(--chakra-space-4))`}
        height={"full"}
      >
        <Popover placement="left" trigger="hover" closeDelay={100} onOpen={onOpen}>
          {({ isOpen }) => (
            <>
              <PopoverTrigger>
                <Center
                  bg={`${colorScheme}.${circleBgSwatch[colorMode]}`}
                  boxSize={CIRCLE_SIZE}
                  borderRadius={8}
                  transition="all .2s"
                  overflow={"hidden"}
                  pos="relative"
                  fontSize={"md"}
                  sx={{
                    "> *": {
                      opacity: 0,
                      transition: "opacity .2s",
                    },
                    ...(isOpen || isAlwaysOpen ? CIRCLE_OPEN_STYLES : {}),
                  }}
                  _hover={CIRCLE_OPEN_STYLES}
                >
                  <Tag colorScheme={colorScheme} pos="absolute" px="2" py="2">
                    <Icon as={icon} boxSize={3} />
                  </Tag>
                </Center>
              </PopoverTrigger>
              <Portal>
                <PopoverContent width="unset" maxW={{ base: "2xs", md: "xs" }}>
                  {!isAlwaysOpen && [5, 10].includes(openCount) ? (
                    <PopoverHeader border="0">
                      {openCount === 5 ? "👀" : "🙈"}
                    </PopoverHeader>
                  ) : (
                    children
                  )}
                  <PopoverArrow />
                </PopoverContent>
              </Portal>
            </>
          )}
        </Popover>
      </Center>
    </Flex>
  )
}

export default RequirementAccessIndicatorUI
