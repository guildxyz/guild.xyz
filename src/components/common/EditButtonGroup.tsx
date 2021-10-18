import { Button, Icon, IconButton } from "@chakra-ui/react"
import { Check, Gear } from "phosphor-react"
import { Dispatch } from "react"
import ColorButton from "./ColorButton"

type Props = {
  editMode: boolean
  setEditMode: Dispatch<boolean>
  isLoading?: boolean
  onClick: (data: any) => void
  simple?: boolean
}

const EditButtonGroup = ({
  editMode,
  setEditMode,
  isLoading,
  onClick,
  simple,
}: Props): JSX.Element => {
  if (simple)
    return (
      <>
        {" "}
        {!editMode && (
          <IconButton
            minW={12}
            rounded="2xl"
            onClick={() => setEditMode(true)}
            icon={<Icon as={Gear} />}
            aria-label="Edit"
          />
        )}
        {editMode && (
          <>
            <Button rounded="2xl" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
            <Button
              rounded="2xl"
              isLoading={isLoading}
              onClick={onClick}
              leftIcon={<Icon as={Check} />}
            >
              Save
            </Button>
          </>
        )}
      </>
    )

  return (
    <>
      {!editMode && (
        <ColorButton
          rounded="2xl"
          color="blue.500"
          onClick={() => setEditMode(true)}
        >
          <Icon as={Gear} />
        </ColorButton>
      )}
      {editMode && (
        <>
          <ColorButton
            rounded="2xl"
            color="gray.500"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </ColorButton>
          <ColorButton
            rounded="2xl"
            color="green.500"
            isLoading={isLoading}
            onClick={onClick}
          >
            Save
          </ColorButton>
        </>
      )}
    </>
  )
}

export default EditButtonGroup
