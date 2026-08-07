const DELETE_CONFIRMATION_SUPPRESSION_MS = 60 * 60 * 1000
const DELETE_CONFIRMATION_STORAGE_PREFIX = 'internetnl:domain-delete-confirmation-suppressed-until:list:'

export const domainDeleteConfirmationStorageKey = (listId) =>
  `${DELETE_CONFIRMATION_STORAGE_PREFIX}${listId}`

export const isDomainDeleteConfirmationSuppressed = (listId) => {
  const storageKey = domainDeleteConfirmationStorageKey(listId)

  try {
    const suppressedUntil = Number(window.localStorage.getItem(storageKey))

    if (Number.isFinite(suppressedUntil) && suppressedUntil > Date.now()) {
      return true
    }

    window.localStorage.removeItem(storageKey)
  } catch {
    // Storage can be unavailable in privacy modes; confirmation remains enabled.
  }

  return false
}

export const suppressDomainDeleteConfirmationForOneHour = (listId) => {
  try {
    window.localStorage.setItem(
      domainDeleteConfirmationStorageKey(listId),
      String(Date.now() + DELETE_CONFIRMATION_SUPPRESSION_MS),
    )
  } catch {
    // Deletion still works when storage is unavailable.
  }
}
