import {
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react"
import { Question } from "phosphor-react"

type Props = {
  header?: string
  body: string | JSX.Element
}

const Hint = ({ header, body }: Props) => (
  <Popover placement="top-end">
    <PopoverTrigger>
      <IconButton
        position="relative"
        top={-2}
        right={-2}
        p={0}
        minWidth="none"
        width={2}
        height={2}
        aria-label="Close hint"
        icon={<Icon as={Question} />}
      />
    </PopoverTrigger>
    <PopoverContent fontSize="sm">
      <PopoverArrow />
      <PopoverCloseButton />
      {header && <PopoverHeader>{header}</PopoverHeader>}
      <PopoverBody>{body}</PopoverBody>
    </PopoverContent>
  </Popover>
)

export default Hint
