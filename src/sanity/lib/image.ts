import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

export function getImageUrl(image: any) {
  if (!image) return ''
  if (typeof image === 'string') return image
  try {
    return urlFor(image).url() || ''
  } catch (e) {
    return ''
  }
}

export function getOptimizedImageUrl(image: any, width: number = 600, height?: number) {
  if (!image) return ''
  if (typeof image === 'string') return image
  try {
    let b = urlFor(image).width(width).quality(75).auto('format')
    if (height) {
      b = b.height(height).fit('crop')
    }
    return b.url() || ''
  } catch (e) {
    return ''
  }
}
