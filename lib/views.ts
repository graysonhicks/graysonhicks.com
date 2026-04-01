import { getStore } from '@netlify/blobs'

export function getViewsStore() {
  return getStore('page-views')
}
