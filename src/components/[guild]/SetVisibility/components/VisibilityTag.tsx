import Button from "components/common/Button"
import { Visibility } from "types"
import { VISIBILITY_DATA } from "../visibilityData"

const VisibilityTag = ({ visibility }: { visibility: Visibility }) => {
  const { Icon, title } = VISIBILITY_DATA[visibility]

  return (
    <Button
      size={"xs"}
      colorScheme="blackAlpha"
      bgColor="blackAlpha.300"
      variant="solid"
      leftIcon={<Icon />}
      isDisabled
      opacity={"1 !important"}
    >
      {title}
    </Button>
  )
}

export default VisibilityTag
