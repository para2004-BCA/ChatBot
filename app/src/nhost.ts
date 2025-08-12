import { NhostClient } from '@nhost/nhost-js'

const base = import.meta.env.VITE_NHOST_BACKEND_URL as string

if (!base) {
  // eslint-disable-next-line no-console
  console.warn('VITE_NHOST_BACKEND_URL is not set. Auth and GraphQL will not work until it is configured.')
}

const normalize = (url?: string) => (url ? url.replace(/\/$/, '') : '')
const backend = normalize(base)

export const nhost = new NhostClient({
  authUrl: `${backend}/v1/auth`,
  graphqlUrl: `${backend}/v1/graphql`,
  storageUrl: `${backend}/v1/storage`,
  functionsUrl: `${backend}/v1/functions`,
  autoRefreshToken: true,
  autoSignIn: true,
})

export default nhost