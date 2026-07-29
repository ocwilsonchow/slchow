import Image from "next/image"
import { getTranslations } from "next-intl/server"

const designs = [
  "https://cdn.dribbble.com/userupload/11805771/file/original-7bb39a62d126222bfad827c8c192c4d7.png",
  "https://cdn.dribbble.com/userupload/23227623/file/original-34135a4774466aaa4d8db430d44bb662.png?format=webp&resize=640x480&vertical=center",
  "https://cdn.dribbble.com/userupload/48307574/file/eb4883d59d5a0e929f515ee4a369f2ed.png?format=webp&resize=640x480&vertical=center",
  "https://cdn.dribbble.com/userupload/46060812/file/ff5418ec6195815726c1658595d1ccda.jpg?format=webp&resize=640x480&vertical=center",
  "https://cdn.dribbble.com/userupload/21534386/file/original-d6e2364fc4f1234d3edf81ce34de9014.png?format=webp&resize=640x480&vertical=center",
]

export const ListDesigns = async () => {
  const t = await getTranslations("navigation")

  return (
    <div className="space-y-4">
      <h2>
        {t("designs")} <sup>{designs.length}</sup>
      </h2>
      <ul className="grid grid-cols-5 gap-2.5 max-w-prose">
        {designs.map((item) => {
          return (
            <li key={item} className="aspect-13/10 w-full relative">
              <Image
                src={item}
                alt={t("designs")}
                fill
                className="object-cover rounded"
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
