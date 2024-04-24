const ipfsToGuildGateway = (url: string) =>
  url?.replace("ipfs://", process.env.NEXT_PUBLIC_IPFS_GATEWAY)

export default ipfsToGuildGateway
