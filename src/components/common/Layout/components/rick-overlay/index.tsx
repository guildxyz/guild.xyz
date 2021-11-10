import {
  Button,
  Center,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react"
import { MusicNotes } from "phosphor-react"
import React from "react"
const RickOverlay = (): JSX.Element => (
  <Popover>
    <PopoverTrigger>
      <Button m={2} variant="ghost">
        <MusicNotes />
      </Button>
    </PopoverTrigger>
    <Portal>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader fontWeight="bold" align="center">
          Gotcha!
        </PopoverHeader>
        <PopoverBody>
          <Center>
            <Image
              src="https://media.giphy.com/media/lU7ROEKyZjLt752Rod/giphy.gif"
              alt=""
              style={{ height: "60vh" }}
            />
          </Center>
        </PopoverBody>
      </PopoverContent>
    </Portal>
  </Popover>
)

export default RickOverlay
