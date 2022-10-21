import nacl from "tweetnacl"

const readNacl = (signedBase64Token: string) => {
  const u8Public = new Uint8Array(Buffer.from(process.env.NACL_PUBLIC, "base64url"))
  const signedU8Token = new Uint8Array(Buffer.from(signedBase64Token, "base64url"))
  const opened = nacl.sign.open(signedU8Token, u8Public)
  const token = Buffer.from(opened).toString("utf8")

  return token
}

export default readNacl
