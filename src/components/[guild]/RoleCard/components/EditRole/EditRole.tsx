import { Icon, IconButton, IconButtonProps, useDisclosure } from "@chakra-ui/react"
import { PencilSimple } from "@phosphor-icons/react"
import useGuild from "components/[guild]/hooks/useGuild"

import dynamic from "next/dynamic"
import { useState } from "react"

const DynamicEditRole = dynamic(
  () =>
    import("./components/EditRoleDrawer").then((module) => module.EditRoleDrawer),
  {
    ssr: false,
    loading: () => <EditRoleButton isLoading />,
  }
)

const EditRoleButton = ({
  isLoading,
  onClick,
}: Pick<IconButtonProps, "isLoading" | "onClick">) => (
  <IconButton
    size="sm"
    rounded="full"
    aria-label="Edit role"
    isLoading={isLoading}
    onClick={onClick}
    icon={<Icon as={PencilSimple} />}
  />
)

type Props = { roleId: number }

const EditRoleWrapper = ({ roleId }: Props) => {
  const { isDetailed } = useGuild()
  const [hasClicked, setHasClicked] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!isDetailed) return <EditRoleButton isLoading />

  if (!hasClicked)
    return (
      <EditRoleButton
        onClick={() => {
          setHasClicked(true)
          onOpen()
        }}
      />
    )

  return (
    <DynamicEditRole
      roleId={roleId}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    />
  )
}

export default EditRoleWrapper
