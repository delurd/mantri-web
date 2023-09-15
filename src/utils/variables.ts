const host = process.env.NEXT_PUBLIC_API_HOST || 'localhost'
const credentialKey = process.env.NEXT_PUBLIC_CREDENTIAL_KEY || ''
const iotCredentialKey = process.env.NEXT_PUBLIC_IOT_CREDENTIAL_KEY || ''

export { host, credentialKey, iotCredentialKey }