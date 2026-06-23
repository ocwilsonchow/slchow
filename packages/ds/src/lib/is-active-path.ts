export function isActivePath(
  pathname: string,
  href: string,
  options?: { matchSubpaths?: boolean }
) {
  if (href === "/") {
    return pathname === "/"
  }

  if (pathname === href) {
    return true
  }

  if (options?.matchSubpaths) {
    return pathname.startsWith(`${href}/`)
  }

  return false
}
