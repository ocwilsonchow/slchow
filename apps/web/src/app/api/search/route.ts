import { searchApi } from "@/lib/search"

export const revalidate = false

export const { staticGET: GET } = searchApi
