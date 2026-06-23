import Link from "next/link"

const NotFound = async () => {
  return (
    <div className="grid place-items-center h-screen w-full gap-2">
      <div className="text-center">
        <h1 className="text-lg font-medium text-content-ink">Page not found</h1>
        <Link href="/">Go back to home</Link>
      </div>
    </div>
  )
}

export default NotFound
