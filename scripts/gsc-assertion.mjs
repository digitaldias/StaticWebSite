// Prints a signed JWT assertion for the Search Console service account in gsc-key.json.
// The dd-desk pane exchanges it for an access token; its own runtime has no RSA signing.
import { createSign } from 'node:crypto'
import { readFileSync } from 'node:fs'

const account = JSON.parse(readFileSync(process.argv[2] ?? 'gsc-key.json', 'utf8'))
const now = Math.floor(Date.now() / 1000)
const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url')
const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
  iss: account.client_email,
  scope: 'https://www.googleapis.com/auth/webmasters.readonly',
  aud: 'https://oauth2.googleapis.com/token',
  iat: now,
  exp: now + 3600,
})}`
const signature = createSign('RSA-SHA256').update(unsigned).sign(account.private_key, 'base64url')

process.stdout.write(`${unsigned}.${signature}`)
