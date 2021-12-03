import { Button, Icon, IconButton } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { Check, Gear } from "phosphor-react"
import { useFormContext } from "react-hook-form"
import useEdit from "../[guild]/CustomizationButton/hooks/useEdit"
import CtaButton from "./CtaButton"

type Props = {
  editMode?: boolean
}

const EditButtonGroup = ({ editMode }: Props): JSX.Element => {
  const router = useRouter()
  const methods = useFormContext()
  const { onSubmit, isLoading, isImageLoading } = useEdit(null, "role")

  if (!editMode)
    return (
      <IconButton
        minW={12}
        rounded="2xl"
        colorScheme="alpha"
        onClick={() => router.push(`/${router.query.guild}/edit`)}
        icon={<Icon as={Gear} />}
        aria-label="Edit"
      />
    )

  return (
    <>
      <Button rounded="2xl" colorScheme="alpha" onClick={() => router.back()}>
        Cancel
      </Button>
      <CtaButton
        isLoading={isLoading || isImageLoading}
        colorScheme="green"
        variant="solid"
        onClick={methods.handleSubmit(onSubmit)}
        leftIcon={<Icon as={Check} />}
      >
        Save
      </CtaButton>
    </>
  )
}

export default EditButtonGroup
