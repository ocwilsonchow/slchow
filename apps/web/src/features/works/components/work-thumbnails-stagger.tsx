export const WorkThumbnailsStagger = () => {
  return (
    <div className="size">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="size-20 aspect-square">
          {index}
        </div>
      ))}
    </div>
  )
}
