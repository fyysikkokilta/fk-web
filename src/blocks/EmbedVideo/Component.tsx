import type { EmbedVideoBlock as EmbedVideoBlockType } from '@/payload-types'

interface EmbedVideoProps {
  block: EmbedVideoBlockType
}

export const EmbedVideo = ({ block }: EmbedVideoProps) => {
  let embedUrl = ''
  // Handle YouTube URLs
  if (block.videoUrl.includes('youtube.com') || block.videoUrl.includes('youtu.be')) {
    const videoId = block.videoUrl.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    )?.[1]
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}`
    }
  }
  // Handle Vimeo URLs
  else if (block.videoUrl.includes('vimeo.com')) {
    const videoId = block.videoUrl.match(/vimeo\.com\/([0-9]+)/)?.[1]
    if (videoId) {
      embedUrl = `https://player.vimeo.com/video/${videoId}`
    }
  }

  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-4/3',
    '1:1': 'aspect-square'
  }

  return (
    <div
      className={`relative ${aspectRatioClasses[block.aspectRatio]} w-full overflow-hidden rounded-lg`}
    >
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="bg-fk-gray-lightest absolute inset-0 flex items-center justify-center">
          <p className="text-fk-gray-light">{'Invalid video URL'}</p>
        </div>
      )}
    </div>
  )
}
