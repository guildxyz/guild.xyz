import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import useRemoveGuildPlatform from "components/[guild]/AccessHub/hooks/useRemoveGuildPlatform"
import DeleteButton from "components/[guild]/DeleteButton"
import useGuild from "components/[guild]/hooks/useGuild"
import useRole from "components/[guild]/hooks/useRole"
import ConfirmationAlert from "components/create-guild/Requirements/components/ConfirmationAlert"
import { PlatformType, Role } from "types"
import useDeleteRole from "./hooks/useDeleteRole"

type Props = {
  roleId: number
  onDrawerClose: () => void
}

const DeleteRoleButton = ({ roleId, onDrawerClose }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { id } = useGuild()

  const onSuccess = () => {
    onClose()
    onDrawerClose()
  }

  const { onSubmit, isLoading, isSigning } = useDeleteRole(roleId, onSuccess)

  const roleResponse = useRole(id, roleId)
  const role = roleResponse as unknown as Role
  const { guildPlatforms } = useGuild(id)

  const dynamicRolePlatforms = role?.rolePlatforms.filter((rp) => rp.dynamicAmount)

  const tokenRolePlatform = dynamicRolePlatforms.find((rp) => {
    const guildPlatform = guildPlatforms.find((gp) => gp.id === rp.guildPlatformId)
    return !!guildPlatform && guildPlatform.platformId === PlatformType.ERC20
  })

  const { onSubmit: deleteTokenReward, isLoading: tokenRewardDeleteLoading } =
    useRemoveGuildPlatform(tokenRolePlatform?.guildPlatformId, {
      onSuccess: onSubmit,
    })

  const handleDelete = async () => {
    if (tokenRolePlatform) {
      await deleteTokenReward()
      return
    }
    onSubmit()
  }

  return (
    <>
      <DeleteButton label="Delete role" onClick={onOpen} />
      <ConfirmationAlert
        isLoading={isLoading || tokenRewardDeleteLoading}
        loadingText={isSigning && "Check your wallet"}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDelete}
        title="Delete role"
        description={
          !!tokenRolePlatform ? (
            <Alert status="warning">
              <AlertIcon mt={0} />
              <Box>
                <Text fontWeight={"bold"}>Token reward on role</Text>
                <AlertDescription>
                  If you delete the role, the token reward will also be deleted, and
                  you will not be able to withdraw funds from the reward pool through
                  Guild.{" "}
                  <Text fontWeight={"medium"} display="inline">
                    Make sure to withdraw all funds before deletion if needed!
                  </Text>
                  <Text colorScheme={"gray"} fontSize={"sm"} mt={2}>
                    You will be asked for your verifying signature two times, to
                    delete both the reward and the role.
                  </Text>
                </AlertDescription>
              </Box>
            </Alert>
          ) : (
            "Are you sure you want to delete this role?"
          )
        }
        confirmationText="Delete"
      />
    </>
  )
}

export default DeleteRoleButton
