const host = process.env.NEXT_PUBLIC_API_HOST || 'localhost'
const credentialKey = process.env.NEXT_PUBLIC_CREDENTIAL_KEY || ''

export { host, credentialKey }