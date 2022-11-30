import {
  Center,
  Circle,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Tag,
  useColorModeValue,
} from "@chakra-ui/react"
import { FC, PropsWithChildren } from "react"

type Props = {
  colorScheme: string
  icon: FC
  circleBg?: string
}

const CIRCLE_HOVER_STYLES = {
  bg: "unset",
  width: 7,
  height: 7,
  borderRadius: 0,
  "> *": {
    opacity: 1,
  },
}

const RequiementAccessIndicatorUI = ({
  colorScheme,
  icon,
  circleBg,
  children,
}: PropsWithChildren<Props>) => {
  // blackAlpha.300 on top of gray.700 => #35353A
  const cardBg = useColorModeValue("var(--chakra-colors-gray-50)", "#35353A")

  return (
    <Flex width={2} height="full" justifyContent={"flex-end"} alignItems="center">
      <Center
        pl="6"
        bg={`linear-gradient(to right, transparent 0px, ${cardBg} var(--chakra-space-4))`}
        height={"full"}
      >
        <Popover placement="left" trigger="hover" closeDelay={100} strategy="fixed">
          {({ isOpen, onClose }) => (
            <>
              <PopoverTrigger>
                <Circle
                  bg={circleBg ?? `${colorScheme}.300`}
                  size={2}
                  transition="all .2s"
                  overflow={"hidden"}
                  pos="relative"
                  fontSize={"md"}
                  sx={{
                    "> *": {
                      opacity: 0,
                      transition: "opacity .2s",
                    },
                    ...(isOpen ? CIRCLE_HOVER_STYLES : {}),
                  }}
                  _hover={CIRCLE_HOVER_STYLES}
                >
                  <Tag colorScheme={colorScheme} pos="absolute" px="1.5" py="1.5">
                    <Icon as={icon} />
                  </Tag>
                </Circle>
              </PopoverTrigger>
              <PopoverContent width="unset" maxW={{ base: "2xs", md: "xs" }}>
                {children}
                <PopoverArrow />
              </PopoverContent>
            </>
          )}
        </Popover>
      </Center>
    </Flex>
  )
}

export default RequiementAccessIndicatorUI
