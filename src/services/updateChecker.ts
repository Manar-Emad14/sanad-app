export const CURRENT_VERSION = '1.0.0'

export interface RemoteVersionData {
  latestVersion: string
  minRequiredVersion?: string
  downloadUrl: string
  releaseNotes: string
}

export interface UpdateInfo {
  hasUpdate: boolean
  latestVersion: string
  currentVersion: string
  minRequiredVersion?: string
  isMandatory: boolean
  downloadUrl: string
  releaseNotes: string
}

const REMOTE_VERSION_URL =
  'https://raw.githubusercontent.com/Manar-Emad14/sanad-app/main/public/version.json'

/**
 * Compare two semver version strings (e.g., '1.0.1' > '1.0.0')
 */
export function isNewerVersion(remoteVersion: string, currentVersion: string): boolean {
  const parseParts = (v: string) =>
    v
      .trim()
      .replace(/^[vV]/, '')
      .split('.')
      .map((num) => parseInt(num, 10) || 0)

  const remoteParts = parseParts(remoteVersion)
  const currentParts = parseParts(currentVersion)
  const maxLength = Math.max(remoteParts.length, currentParts.length)

  for (let i = 0; i < maxLength; i++) {
    const r = remoteParts[i] || 0
    const c = currentParts[i] || 0
    if (r > c) return true
    if (r < c) return false
  }

  return false
}

/**
 * Fetch and check for updates from the remote GitHub repository
 */
export async function checkForUpdate(): Promise<UpdateInfo | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 7000)

    const response = await fetch(`${REMOTE_VERSION_URL}?t=${Date.now()}`, {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return null
    }

    const data: RemoteVersionData = await response.json()
    if (!data || !data.latestVersion) {
      return null
    }

    const hasUpdate = isNewerVersion(data.latestVersion, CURRENT_VERSION)
    if (!hasUpdate) {
      return null
    }

    const isMandatory = data.minRequiredVersion
      ? isNewerVersion(data.minRequiredVersion, CURRENT_VERSION)
      : false

    return {
      hasUpdate: true,
      latestVersion: data.latestVersion,
      currentVersion: CURRENT_VERSION,
      minRequiredVersion: data.minRequiredVersion,
      isMandatory,
      downloadUrl:
        data.downloadUrl ||
        'https://github.com/Manar-Emad14/sanad-app/releases/latest',
      releaseNotes:
        data.releaseNotes || 'تحسينات عامة وإصلاحات وإضافات جديدة في تطبيق سند.',
    }
  } catch (err) {
    console.warn('[UpdateChecker] Non-blocking update check note:', err)
    return null
  }
}
