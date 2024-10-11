import { accountModalAtom } from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Separator } from "@/components/ui/Separator"
import { useUserPublic } from "@/hooks/useUserPublic"
import useUser from "components/[guild]/hooks/useUser"
import { useAtom } from "jotai"
import { deleteKeyPairFromIdb } from "utils/keyPair"
import { Account } from "./components/Account"
import { AccountConnections } from "./components/AccountConnections"
import { AccountGuildProfile } from "./components/AccountGuildProfile"
import { UsersGuildPins } from "./components/UsersGuildPins"

const AccountModal = () => {
  const { address, disconnect } = useWeb3ConnectionManager()
  const [isOpen, setIsOpen] = useAtom(accountModalAtom)

  const { id, guildProfile } = useUser()
  const { deleteKeys } = useUserPublic()

  const handleLogout = () => {
    const keysToRemove = Object.keys({ ...window.localStorage }).filter((key) =>
      /^dc_auth_[a-z]*$/.test(key)
    )

    keysToRemove.forEach((key) => {
      window.localStorage.removeItem(key)
    })

    deleteKeyPairFromIdb(id)
      ?.catch(() => null)
      .finally(() => {
        setIsOpen(false)
        disconnect()
        deleteKeys()
      })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent scrollBody>
        <DialogCloseButton />

        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>

        <DialogBody scroll>
          {address ? (
            <>
              {guildProfile ? (
                <AccountGuildProfile
                  handleLogout={handleLogout}
                  onClose={() => setIsOpen(false)}
                />
              ) : (
                <Account handleLogout={handleLogout} />
              )}

              <AccountConnections />

              <Separator className="my-6" />

              <UsersGuildPins />
            </>
          ) : (
            <p className="mb-6 font-semibold text-2xl">Not connected</p>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

export { AccountModal }
