import { createStore, del, get, set } from "idb-keyval"

export type StoredKeyPair = {
  keyPair: CryptoKeyPair
  pubKey: string
}

function getStore() {
  return createStore("guild.xyz", "signingKeyPairs")
}

export function getKeyPairFromIdb(userId: number) {
  return get<StoredKeyPair>(userId, getStore())
}

export function deleteKeyPairFromIdb(userId: number) {
  return userId ? del(userId, getStore()) : null
}

export function setKeyPairToIdb(userId: number, keys: StoredKeyPair) {
  return set(userId, keys, getStore())
}
