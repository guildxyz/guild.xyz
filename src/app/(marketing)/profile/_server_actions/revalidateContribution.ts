"use server"

import { revalidateTag } from "next/cache"

export async function revalidateContribution() {
  revalidateTag("contributions")
}
