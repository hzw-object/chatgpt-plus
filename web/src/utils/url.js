/**
 * URL utility functions
 */

export function sanitizeUrl(url, options = {}) {
  if (!url) return ''

  // If it's already a valid absolute URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // If it's a relative URL and relative is allowed
  if (url.startsWith('/') && options.allowRelative) {
    return url
  }

  // If it's a data URL and data is allowed
  if (url.startsWith('data:') && options.allowDataUrl) {
    return url
  }

  // Default: return as-is for internal routes
  return url
}

export function isExternalUrl(url) {
  if (!url) return false
  return url.startsWith('http://') || url.startsWith('https://')
}

export function getDomain(url) {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return ''
  }
}