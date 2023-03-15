import { Tag } from "@chakra-ui/react"

type Props = {
  role: string
}

const RoleTag = ({ role }: Props): JSX.Element => (
  <Tag colorScheme="blackalpha">{role}</Tag>
)

export default RoleTag
