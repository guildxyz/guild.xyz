import {
  Circle,
  Icon,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Tag,
} from "@chakra-ui/react"
import { FC, PropsWithChildren } from "react"

type Props = {
  colorScheme: string
  icon: FC
  circleBg?: string
  popoverWidth?: string
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
  popoverWidth,
  children,
}: PropsWithChildren<Props>) => (
  <Popover placement="left" trigger="hover" closeDelay={100} openDelay={200}>
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
        <PopoverContent width={popoverWidth}>
          {children}
          <PopoverArrow />
        </PopoverContent>
      </>
    )}
  </Popover>
)

export default RequiementAccessIndicatorUI
