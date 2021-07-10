import { Heading, Text, Stack } from "@chakra-ui/react"
import Card from "./Card"

type Props = {
  title: string
  description: string | JSX.Element[]
  children: JSX.Element | JSX.Element[]
}

const ActionCard = ({ title, description, children }: Props): JSX.Element => (
  <Card p={6} h="full">
    <Heading size="sm" mb="2">
      {title}
    </Heading>
    <Text mb="6" fontWeight="medium">
      {description}
    </Text>
    <Stack direction="row" spacing="2" justifyContent="flex-end" mt="auto">
      {children}
    </Stack>
  </Card>
)

export default ActionCard
