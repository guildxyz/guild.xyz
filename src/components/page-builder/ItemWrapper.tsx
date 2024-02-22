import {
  Box,
  EASINGS,
  GridItem,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  usePopper,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { AnimatePresence, DragHandlers, motion } from "framer-motion"
import { Item } from "pages/page-builder"
import { ArrowsOutSimple, TrashSimple } from "phosphor-react"
import { PropsWithChildren, useState } from "react"

type Props = {
  item: Item
  onDrag: DragHandlers["onDrag"]
  onDragEnd: DragHandlers["onDragEnd"]
  onResize: (
    width: Item["desktop"]["width"],
    height: Item["desktop"]["height"]
  ) => void
  onRemove: () => void
  "data-item-id": string
}

const MotionCard = motion(Card)
const MotionBox = motion(Box)

const motionMountProps = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.1, ease: EASINGS.easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.1, ease: EASINGS.easeIn },
  },
}

const ItemWrapper = ({
  item,
  onDrag,
  onDragEnd,
  onResize,
  onRemove,
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  const x = item.desktop.x
  const y = item.desktop.y

  const [isDragging, setDragging] = useState(false)
  const [shouldDisplayMenu, setShouldDisplayMenu] = useState(false)

  const { referenceRef, getPopperProps } = usePopper({
    placement: "bottom",
    strategy: "absolute",
    offset: [0, -4],
  })

  return (
    <MotionCard
      as={GridItem}
      role="group"
      gridColumnStart={x}
      gridRowStart={y}
      colSpan={typeof item.desktop.width === "number" ? item.desktop.width : 6}
      rowSpan={Number(item.desktop.height)}
      cursor={isDragging ? "grabbing" : "grab"}
      layout
      style={{
        borderRadius: "var(--chakra-radii-2xl)",
      }}
      drag
      onDragStart={() => setDragging(true)}
      onDrag={onDrag}
      onDragEnd={(event, info) => {
        setDragging(false)
        onDragEnd(event, info)
      }}
      whileDrag={{
        boxShadow: "var(--chakra-shadows-xl)",
      }}
      dragSnapToOrigin
      zIndex={isDragging ? "popover" : undefined}
      overflow="visible"
      {...motionMountProps}
      onHoverStart={() => setShouldDisplayMenu(true)}
      onHoverEnd={() => setShouldDisplayMenu(false)}
    >
      {children}

      <Box
        {...rest} // TODO: not sure why doesn't this work if I add it to the GridItem component directly
        w="full"
        h="full"
        position="relative"
        alignItems="center"
        justifyContent="center"
        ref={referenceRef}
      >
        <AnimatePresence>
          {shouldDisplayMenu && !isDragging && (
            <MotionBox
              {...getPopperProps()}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
                transition: { duration: 0.1, ease: EASINGS.easeOut },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.1, ease: EASINGS.easeIn },
              }}
              py={2}
              zIndex="popover"
              isolation="isolate"
            >
              <HStack
                bgColor="gray.900"
                borderRadius="lg"
                p={1}
                boxShadow="md"
                spacing={0}
                cursor="default"
              >
                <SizePopover onResize={onResize} />
                <IconButton
                  aria-label="Remove item"
                  size="sm"
                  icon={<TrashSimple />}
                  borderRadius="md"
                  variant="ghost"
                  onClick={() => onRemove()}
                />
              </HStack>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </MotionCard>
  )
}

const SizePopover = ({ onResize }: { onResize: Props["onResize"] }) => {
  // Would be hot af if we could solve this without an extra state / with just plain CSS
  const [hoveredPosition, setHoveredPosition] = useState<{
    x: number
    y: number
  } | null>(null)

  return (
    <Popover gutter={10}>
      <PopoverTrigger>
        <IconButton
          aria-label="Edit size"
          size="sm"
          icon={<ArrowsOutSimple />}
          borderRadius="md"
          variant="ghost"
        />
      </PopoverTrigger>
      <PopoverContent
        maxW="max-content"
        borderWidth={0}
        borderRadius="lg"
        p={1}
        sx={{
          "--popper-bg": "var(--chakra-colors-gray-900)!important",
          "--popper-arrow-shadow-color": "transparent!important",
        }}
      >
        <PopoverArrow borderColor="red" />
        <PopoverHeader
          borderBottom="none"
          textTransform="uppercase"
          fontSize="xs"
          fontWeight="bold"
          textAlign="center"
          textColor="GrayText"
          pt={1}
          pb={0}
        >
          Size
        </PopoverHeader>
        <PopoverBody padding={1}>
          <SimpleGrid
            spacing={1}
            columns={6}
            onMouseLeave={() => setHoveredPosition(null)}
          >
            {[...Array(18)].map((_, i) => {
              const row = Math.floor(i / 6)
              const column = i % 6

              const x = column + 1
              const y = row + 1

              const isDisabled = column > 2

              return (
                <Box
                  data-x={x}
                  data-y={y}
                  tabIndex={0}
                  key={i}
                  borderWidth={1}
                  borderRadius="sm"
                  bgColor={
                    x <= hoveredPosition?.x && y <= hoveredPosition?.y
                      ? "indigo.500"
                      : "whiteAlpha.100"
                  }
                  boxSize={4}
                  fontSize="xs"
                  // TODO: eliminate any casts
                  onClick={() => onResize(x as any, y as any)}
                  cursor={!isDisabled && "pointer"}
                  borderStyle={isDisabled ? "dashed" : "solid"}
                  opacity={isDisabled ? 0.5 : 1}
                  onMouseOver={
                    isDisabled ? undefined : () => setHoveredPosition({ x, y })
                  }
                />
              )
            })}
          </SimpleGrid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
export default ItemWrapper
