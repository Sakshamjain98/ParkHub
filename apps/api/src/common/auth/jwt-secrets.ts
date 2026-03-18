const MIN_SECRET_LENGTH = 32

const parseSecretList = (value?: string) =>
  (value || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

const assertStrongSecret = (secret: string, label: string) => {
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `${label} must be at least ${MIN_SECRET_LENGTH} characters long.`,
    )
  }
}

const currentSecret =
  process.env.JWT_SECRET_CURRENT || process.env.JWT_SECRET || ''

if (!currentSecret) {
  throw new Error(
    'Missing JWT secret. Set JWT_SECRET_CURRENT (recommended) or JWT_SECRET.',
  )
}

assertStrongSecret(currentSecret, 'JWT_SECRET_CURRENT')

const previousSecrets = parseSecretList(process.env.JWT_SECRET_PREVIOUS)
previousSecrets.forEach((secret, index) => {
  assertStrongSecret(secret, `JWT_SECRET_PREVIOUS[${index}]`)
})

export const jwtSecrets = {
  current: currentSecret,
  previous: previousSecrets,
  allForVerify: [currentSecret, ...previousSecrets],
}
