import useGuild from "components/[guild]/hooks/useGuild"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { GuildFormType } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"

type Props = {
  onSuccess?: () => void
  guildId?: string | number
}

const countFalsy = <Item>(arr: Array<Item>) => arr.filter((req) => !req).length

const useEditGuild = ({ onSuccess, guildId }: Props = {}) => {
  const guild = useGuild(guildId)

  const matchMutate = useMatchMutate()

  const showErrorToast = useShowErrorToast()
  const router = useRouter()
  const fetcherWithSign = useFetcherWithSign()

  const id = guildId ?? guild?.id

  const submit = async (data: GuildFormType) => {
    const existingFeatureFlags = guild?.featureFlags ?? []
    const existingContacts = guild?.contacts ?? []
    const existingAdmins = guild?.admins ?? []
    const { admins = [], featureFlags = [], contacts = [], ...guildData } = data

    const adminsToCreate = admins.filter((admin) => !admin.id)
    const adminsToDelete = existingAdmins.filter(
      (existingAdmin) =>
        !existingAdmin?.isOwner &&
        !admins.some((admin) => admin.id === existingAdmin.id)
    )

    const contactsToUpdate = contacts.filter((contact) => {
      if (!contact.id) return false
      const prevContact = existingContacts?.find((ec) => ec.id === contact.id)
      if (!prevContact) return false
      return (
        !!contact.id &&
        !(
          contact.id === prevContact.id &&
          contact.contact === prevContact.contact &&
          contact.type === prevContact.type
        )
      )
    })
    const contactsToCreate = contacts.filter((contact) => !contact.id)
    const contactsToDelete = existingContacts.filter(
      (existingContact) =>
        !contacts.some((contact) => contact.id === existingContact.id)
    )

    const featureFlagsToCreate = featureFlags.filter(
      (flag) => !existingFeatureFlags.includes(flag)
    )
    const featureFlagsToDelete = existingFeatureFlags.filter(
      (existingFlag) => !featureFlags.includes(existingFlag)
    )

    const shouldUpdateBaseGuild = guildData && Object.keys(guildData).length > 0

    const adminCreations = Promise.all(
      adminsToCreate.map((adminToCreate) =>
        fetcherWithSign([
          `/v2/guilds/${id}/admins`,
          { method: "POST", body: adminToCreate },
        ]).catch(() => null)
      )
    )

    const adminDeletions = Promise.all(
      adminsToDelete.map((adminToDelete) =>
        fetcherWithSign([
          `/v2/guilds/${id}/admins/${adminToDelete.id}`,
          { method: "DELETE" },
        ])
          .then(() => ({ id: adminToDelete.id }))
          .catch(() => null)
      )
    )

    const contactCreations = Promise.all(
      contactsToCreate.map((contactToCreate) =>
        fetcherWithSign([
          `/v2/guilds/${id}/contacts`,
          { method: "POST", body: contactToCreate },
        ]).catch(() => null)
      )
    )

    const contactUpdates = Promise.all(
      contactsToUpdate.map((contactToUpdate) =>
        fetcherWithSign([
          `/v2/guilds/${id}/contacts/${contactToUpdate.id}`,
          { method: "PUT", body: contactToUpdate },
        ]).catch(() => null)
      )
    )

    const contactDeletions = Promise.all(
      contactsToDelete.map((contactToDelete) =>
        fetcherWithSign([
          `/v2/guilds/${id}/contacts/${contactToDelete.id}`,
          { method: "DELETE" },
        ])
          .then(() => ({ id: contactToDelete.id }))
          .catch(() => null)
      )
    )

    const featureFlagCreations = Promise.all(
      featureFlagsToCreate.map((featureFlagToCreate) =>
        fetcherWithSign([
          `/v2/guilds/${id}/feature-flags`,
          { method: "POST", body: { featureType: featureFlagToCreate } },
        ]).catch(() => null)
      )
    )

    const featureFlagDeletions = Promise.all(
      featureFlagsToDelete.map((featureFlagToDelete) =>
        fetcherWithSign([
          `/v2/guilds/${id}/feature-flags/${featureFlagToDelete}`,
          { method: "DELETE" },
        ])
          .then(() => ({ flagType: featureFlagToDelete }))
          .catch(() => null)
      )
    )

    const baseGuildUpdate = shouldUpdateBaseGuild
      ? fetcherWithSign([
          `/v2/guilds/${id}`,
          { method: "PUT", body: guildData },
        ]).catch(() => null)
      : new Promise<void>((resolve) => resolve())

    const [
      adminCreationResults,
      adminDeleteResults,
      contactCreationResults,
      contactUpdateResults,
      contactDeleteResults,
      featureFlagCreationResults,
      featureFlagDeletionResults,
      guildUpdateResult,
    ] = await Promise.all([
      adminCreations,
      adminDeletions,
      contactCreations,
      contactUpdates,
      contactDeletions,
      featureFlagCreations,
      featureFlagDeletions,
      baseGuildUpdate,
    ])

    return {
      admin: {
        creations: {
          success: adminCreationResults.filter(Boolean),
          failedCount: countFalsy(adminCreationResults),
        },
        deletions: {
          success: adminDeleteResults.filter(Boolean),
          failedCount: countFalsy(adminDeleteResults),
        },
      },

      contacts: {
        creations: {
          success: contactCreationResults.filter(Boolean),
          failedCount: countFalsy(contactCreationResults),
        },
        updates: {
          success: contactUpdateResults.filter(Boolean),
          failedCount: countFalsy(contactUpdateResults),
        },
        deletions: {
          success: contactDeleteResults.filter(Boolean),
          failedCount: countFalsy(contactDeleteResults),
        },
      },

      featureFlags: {
        creations: {
          success: featureFlagCreationResults.filter(Boolean),
          failedCount: countFalsy(featureFlagCreationResults),
        },
        deletions: {
          success: featureFlagDeletionResults.filter(Boolean),
          failedCount: countFalsy(featureFlagDeletionResults),
        },
      },

      guildUpdateResult,
    } as const
  }

  const toast = useToast()

  const useSubmitResponse = useSubmit(submit, {
    onSuccess: ({ admin, contacts, featureFlags, guildUpdateResult }) => {
      if (onSuccess) onSuccess()

      // Show success / error toasts
      if (
        admin.creations.failedCount <= 0 &&
        admin.deletions.failedCount <= 0 &&
        contacts.creations.failedCount <= 0 &&
        contacts.updates.failedCount <= 0 &&
        contacts.deletions.failedCount <= 0 &&
        featureFlags.creations.failedCount <= 0 &&
        featureFlags.deletions.failedCount <= 0 &&
        !guildUpdateResult
      ) {
        toast({
          title: `Guild successfully updated!`,
          status: "success",
        })
      } else {
        if (admin.creations.failedCount > 0) {
          showErrorToast("Failed to create some admins")
        }
        if (admin.deletions.failedCount > 0) {
          showErrorToast("Failed to delete some admins")
        }

        if (contacts.creations.failedCount > 0) {
          showErrorToast("Failed to create some contacts")
        }
        if (contacts.updates.failedCount > 0) {
          showErrorToast("Failed to update some contacts")
        }
        if (contacts.deletions.failedCount > 0) {
          showErrorToast("Failed to delete some contacts")
        }

        if (featureFlags.creations.failedCount > 0) {
          showErrorToast("Failed to create some feature flags")
        }
        if (featureFlags.deletions.failedCount > 0) {
          showErrorToast("Failed to delete some feature flags")
        }

        if (guildUpdateResult === null) {
          showErrorToast("Failed to update guild data")
        }
      }

      guild.mutateGuild(
        (prev) => {
          const oldAdminsThatHaventBeenDeleted = (prev.admins ?? []).filter(
            (prevAdmin) =>
              !admin.deletions.success.some(
                (deletedAdmin) => deletedAdmin.id === prevAdmin.id
              )
          )

          const oldContactsThatHaventBeenDeletedNorUpdated = (
            prev.contacts ?? []
          ).filter(
            (prevContact) =>
              !contacts.deletions.success.some(
                (deletedContact) => deletedContact.id === prevContact.id
              ) &&
              !contacts.updates.success.some(
                (updatedContact) => updatedContact.id === prevContact.id
              )
          )

          const oldFeatureFlagsThatHaventBeenDeleted = (
            prev.featureFlags ?? []
          ).filter(
            (prevFeatureFlag) =>
              !featureFlags.deletions.success.some(
                (deletedFlag) => deletedFlag.featureType === prevFeatureFlag
              )
          )

          return {
            ...prev,
            ...(guildUpdateResult ?? {}),
            admins: [...oldAdminsThatHaventBeenDeleted, ...admin.creations.success],
            contacts: [
              ...oldContactsThatHaventBeenDeletedNorUpdated,
              ...contacts.updates.success,
              ...contacts.creations.success,
            ],
            featureFlags: [
              ...oldFeatureFlagsThatHaventBeenDeleted,
              featureFlags.creations.success.map(
                (createdFlag) => createdFlag.featureType
              ),
            ],
          }
        },
        {
          revalidate: false,
        }
      )

      matchMutate(/^\/guild\/address\//)
      matchMutate(/^\/guild\?order/)
      if (
        guildUpdateResult?.urlName &&
        guildUpdateResult.urlName !== guild?.urlName
      ) {
        router.push(guildUpdateResult.urlName)
      }
    },
    onError: (err) => showErrorToast(err),
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) =>
      useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer))),
  }
}

export default useEditGuild
