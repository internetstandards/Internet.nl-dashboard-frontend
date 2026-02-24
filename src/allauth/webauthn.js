function unwrapPublicKeyOptions(value, kind) {
  const options = value?.publicKey ? value.publicKey : value
  if (!options || typeof options !== 'object' || !options.challenge) {
    throw new Error(`Invalid WebAuthn ${kind} options payload.`)
  }
  return options
}

export function getCreationOptionsJSON(data) {
  return unwrapPublicKeyOptions(data?.creation_options, 'creation')
}

export function getRequestOptionsJSON(data) {
  return unwrapPublicKeyOptions(data?.request_options, 'request')
}
