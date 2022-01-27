import { CloseButton } from "@chakra-ui/react"

const CustomClearIndicator = ({ innerProps }): JSX.Element => (
  <CloseButton {...innerProps} size="sm" mx={1} rounded="full" tabIndex={-1} />
)

export default CustomClearIndicator
