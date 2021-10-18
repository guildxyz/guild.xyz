import { Button, Icon, IconButton } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { Check, Gear } from "phosphor-react"
import { useFormContext } from "react-hook-form"
import ColorButton from "./ColorButton"
import useEdit from "./CustomizationButton/hooks/useEdit"

type Props = {
  editMode?: boolean
  simple?: boolean
}

const EditButtonGroup = ({ editMode, simple }: Props): JSX.Element => {
  const router = useRouter()
  const methods = useFormContext()
  const { onSubmit, isLoading } = useEdit()

  if (simple)
    return (
      <>
        {!editMode && (
          <IconButton
            minW={12}
            rounded="2xl"
            onClick={() => router.push(`${router.asPath}/edit`)}
            icon={<Icon as={Gear} />}
            aria-label="Edit"
          />
        )}
        {editMode && (
          <>
            <Button rounded="2xl" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              rounded="2xl"
              isLoading={isLoading}
              onClick={methods.handleSubmit(onSubmit)}
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
          onClick={() => router.push(`${router.asPath}/edit`)}
        >
          <Icon as={Gear} />
        </ColorButton>
      )}
      {editMode && (
        <>
          <ColorButton rounded="2xl" color="gray.500" onClick={() => router.back()}>
            Cancel
          </ColorButton>
          <ColorButton
            rounded="2xl"
            color="green.500"
            isLoading={isLoading}
            onClick={methods.handleSubmit(onSubmit)}
          >
            Save
          </ColorButton>
        </>
      )}
    </>
  )
}

export default EditButtonGroup
