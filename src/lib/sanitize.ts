import 'server-only'
import sanitizeHtml from 'sanitize-html'

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'sub', 'sup', 'mark', 'hr', 'div', 'span',
]

export function sanitizePostContent(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href', 'class'],
      img: ['src', 'alt', 'class', 'width', 'height'],
      '*': ['class', 'style'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowedSchemesByTag: {
      img: ['https', 'http', 'data'],
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          href: attribs.href ?? '',
          class: attribs.class ?? '',
          rel: 'noopener noreferrer',
        },
      }),
    },
  })
}

export function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return true
  if (url.startsWith('data:image/')) return true
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

export const ALLOWED_CATEGORIES = [
  'News', 'Advocacy', 'Programmes', 'Governance', 'Leadership', 'Press Release',
] as const
