const ipfsToGuildGateway = (url: string) =>
  process.env.NEXT_PUBLIC_IPFS_GATEWAY
    ? url.replace("ipfs://", process.env.NEXT_PUBLIC_IPFS_GATEWAY)
    : url

export default ipfsToGuildGateway
