import { Button, Icon, IconButton } from "@chakra-ui/react"
import { Check, Gear } from "phosphor-react"
import { Dispatch } from "react"
import CtaButton from "./CtaButton"

type Props = {
  editMode: boolean
  setEditMode: Dispatch<boolean>
  isLoading?: boolean
  onClick: (data: any) => void
}

const EditButtonGroup = ({
  editMode,
  setEditMode,
  isLoading,
  onClick,
}: Props): JSX.Element => {
  if (!editMode)
    return (
      <IconButton
        minW={12}
        rounded="2xl"
        colorScheme="alpha"
        onClick={() => setEditMode(true)}
        icon={<Icon as={Gear} />}
        aria-label="Edit"
      />
    )

  return (
    <>
      <Button rounded="2xl" colorScheme="alpha" onClick={() => setEditMode(false)}>
        Cancel
      </Button>
      <CtaButton
        rounded="2xl"
        isLoading={isLoading}
        onClick={onClick}
        leftIcon={<Icon as={Check} />}
      >
        Save
      </CtaButton>
    </>
  )
}

export default EditButtonGroup
