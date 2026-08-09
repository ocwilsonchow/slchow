import { getDesigns } from "../get-designs"
import { DesignGallery } from "./design-gallery"

export function ListDesigns() {
  return <DesignGallery designs={getDesigns()} />
}
