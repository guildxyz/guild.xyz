"use server"

import { Schemas } from "@guildxyz/types"
import { revalidateTag } from "next/cache"

export const revalidateProfile = async ({
  username,
}: Pick<Schemas["Profile"], "username">) => {
  revalidateTag(`/v2/profiles/${username}`)
}
