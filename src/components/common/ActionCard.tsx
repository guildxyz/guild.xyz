import { Heading, Text, Wrap } from "@chakra-ui/react"
import Card from "./Card"

type Props = {
  title: string
  description: string | JSX.Element[]
  children: JSX.Element | JSX.Element[]
}

const ActionCard = ({ title, description, children }: Props): JSX.Element => (
  <Card isFullWidthOnMobile p={6} h="full">
    <Heading size="sm" mb="2">
      {title}
    </Heading>
    <Text mb="6" fontWeight="medium">
      {description}
    </Text>
    <Wrap spacing="2" justify="flex-end" mt="auto" shouldWrapChildren>
      {children}
    </Wrap>
  </Card>
)

export default ActionCard
