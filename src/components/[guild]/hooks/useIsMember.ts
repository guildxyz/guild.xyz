import useMembership from "components/explorer/hooks/useMemberships"

const useIsMember = (): boolean => {
  const { membership, roleIds } = useMembership()

  if (membership === undefined) return undefined

  return roleIds?.length > 0
}

export default useIsMember
