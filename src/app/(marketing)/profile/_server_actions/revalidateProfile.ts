"use server"

import { revalidateTag } from "next/cache"

export const revalidateProfile = async () => {
  revalidateTag("profile")
}
