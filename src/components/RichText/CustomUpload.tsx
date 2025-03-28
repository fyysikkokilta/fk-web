import { SerializedUploadNode } from '@payloadcms/richtext-lexical'
import Image from 'next/image'

import { BlockLink } from '../BlockLink'

export const CustomUpload = ({ node }: { node: SerializedUploadNode }) => {
  if (node.relationTo === 'media') {
    const uploadDoc = node.value
    if (typeof uploadDoc !== 'object') {
      return null
    }
    const { alt, blurDataUrl, height, url, width } = uploadDoc

    return (
      <Image
        src={url ?? ''}
        alt={alt ?? ''}
        blurDataURL={blurDataUrl}
        placeholder="blur"
        height={height ?? 0}
        width={width ?? 0}
        className="object-contain"
      />
    )
  }
  if (node.relationTo === 'documents') {
    const uploadDoc = node.value
    if (typeof uploadDoc !== 'object') {
      return null
    }
    return <BlockLink type="file" document={uploadDoc} />
  }

  return null
}
