import {
  Box,
  EASINGS,
  Flex,
  GridItem,
  HStack,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { AnimatePresence, motion } from "framer-motion"
import { Item } from "pages/page-builder"
import { ArrowsOutSimple, TrashSimple } from "phosphor-react"
import { DragEventHandler, forwardRef, useState } from "react"

type Props = {
  item: Item
  onDrag: DragEventHandler
  onDragEnd: DragEventHandler
  "data-item-id": string
}

const MotionCard = motion(Card)
const MotionFlex = motion(Flex)

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

const ItemWrapper = forwardRef(
  ({ item, onDrag, onDragEnd, ...rest }: Props, ref) => {
    const x = item.desktop.x
    const y = item.desktop.y

    const [isDragging, setDragging] = useState(false)
    const [shouldDisplayMenu, setShouldDisplayMenu] = useState(false)

    return (
      <GridItem
        ref={ref}
        as={MotionCard}
        role="group"
        gridColumnStart={x}
        gridRowStart={y}
        colSpan={typeof item.desktop.width === "number" ? item.desktop.width : 6}
        rowSpan={Number(item.desktop.height)}
        cursor="pointer"
        layout
        drag
        onDragStart={() => setDragging(true)}
        onDrag={onDrag}
        onDragEnd={(e) => {
          setDragging(false)
          onDragEnd(e)
        }}
        dragSnapToOrigin
        zIndex={isDragging ? 1001 : 11}
        overflow="visible"
        {...motionMountProps}
        onHoverStart={() => setShouldDisplayMenu(true)}
        onHoverEnd={() => setShouldDisplayMenu(false)}
      >
        <Flex
          {...rest} // TODO: not sure why doesn't this work if I add it to the GridItem component directly
          w="full"
          h="full"
          position="relative"
          alignItems="center"
          justifyContent="center"
        >
          Card
          <AnimatePresence>
            {shouldDisplayMenu && !isDragging && (
              <MotionFlex
                {...motionMountProps}
                position="absolute"
                left={0}
                right={0}
                bottom={-11}
                zIndex="popover"
              >
                <HStack
                  mx="auto"
                  bgColor="gray.900"
                  borderRadius="lg"
                  p={1}
                  boxShadow="md"
                  spacing={0}
                >
                  <SizePopover />
                  <IconButton
                    aria-label="Remove item"
                    size="sm"
                    icon={<TrashSimple />}
                    borderRadius="md"
                    variant="ghost"
                  />
                </HStack>
              </MotionFlex>
            )}
          </AnimatePresence>
        </Flex>
      </GridItem>
    )
  }
)

const SizePopover = () => (
  <Popover>
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
      background="gray.900"
      borderWidth={0}
      borderRadius="lg"
      padding={0}
    >
      <PopoverHeader
        borderBottom="none"
        textTransform="uppercase"
        fontSize="xs"
        fontWeight="semibold"
        textAlign="center"
        textColor="GrayText"
        pt={1}
        pb={0}
      >
        Size
      </PopoverHeader>
      <PopoverBody padding={1}>
        <SimpleGrid spacing={1} columns={6}>
          {[...Array(18)].map((_, i) => {
            const row = Math.floor(i / 6)
            const column = i % 6
            return (
              <Box
                tabIndex={0}
                key={i}
                borderWidth={1}
                borderRadius="sm"
                bgColor="whiteAlpha.100"
                boxSize={4}
                fontSize="xs"
                onClick={() => console.log(row, column)}
              />
            )
          })}
        </SimpleGrid>
      </PopoverBody>
    </PopoverContent>
  </Popover>
)
export default ItemWrapper
