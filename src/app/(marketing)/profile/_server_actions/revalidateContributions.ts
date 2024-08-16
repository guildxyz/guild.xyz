"use server"

import { revalidateTag } from "next/cache"

export async function revalidateContributions() {
  revalidateTag("contributions")
}
