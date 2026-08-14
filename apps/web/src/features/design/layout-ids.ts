export function designImageLayoutId(slug: string, name: string) {
  return `design-image-${slug}-${name}`
}

/** Homepage featured stack/overlay only — must not share IDs with `/design`. */
export function featuredImageLayoutId(slug: string, name: string) {
  return `featured-image-${slug}-${name}`
}
