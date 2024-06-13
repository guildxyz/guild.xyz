const ipfsToGuildGateway = (url: string) =>
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  url?.replace("ipfs://", process.env.NEXT_PUBLIC_IPFS_GATEWAY)

export default ipfsToGuildGateway
