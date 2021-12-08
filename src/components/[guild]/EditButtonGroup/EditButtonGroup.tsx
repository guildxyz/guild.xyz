import {
  Button,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import CtaButton from "components/common/CtaButton"
import { useRouter } from "next/router"
import { ArrowUp, Check, DotsThreeVertical, Pencil } from "phosphor-react"
import { useFormContext } from "react-hook-form"
import CustomizationButton from "./components/CustomizationButton"
import useEdit from "./components/CustomizationButton/hooks/useEdit"

type Props = {
  editMode?: boolean
}

const EditButtonGroup = ({ editMode }: Props): JSX.Element => {
  const router = useRouter()
  const methods = useFormContext()
  const { onSubmit, isLoading, isImageLoading } = useEdit()

  if (!editMode)
    return (
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Settings"
          minW={12}
          rounded="2xl"
          colorScheme="alpha"
        >
          <Icon width="1.25em" height="1.25em" as={DotsThreeVertical} />
        </MenuButton>
        <MenuList border="none" shadow="md">
          <CustomizationButton />
          <MenuItem
            py="2"
            cursor="pointer"
            onClick={() => router.push(`/${router.query.guild}/edit`)}
            icon={<Pencil />}
          >
            Edit guild
          </MenuItem>
          <MenuItem py="2" cursor="pointer" icon={<ArrowUp />}>
            Upgrade to Guild
          </MenuItem>
        </MenuList>
      </Menu>
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
