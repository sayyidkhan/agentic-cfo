/**
 * Shared AI gateway settings for Zo's Node app and a future Sites-compatible backend.
 *
 * LiteLLM runs as a separate gateway. This code is only its OpenAI-compatible
 * HTTP client configuration — it does not run Python LiteLLM inside AdonisJS.
 */
export interface CfoModelGateway {
  endpoint: string
  model: string
  apiKey: string
  source: 'litellm' | 'direct'
}

const nonEmpty = (value: string | undefined): string | undefined => value?.trim() || undefined

/**
 * A LiteLLM proxy is preferred when configured. Legacy direct-provider variables
 * remain supported so existing setups don't break.
 */
export function cfoModelConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(
    (nonEmpty(env.LITELLM_BASE_URL) && nonEmpty(env.LITELLM_API_KEY) && nonEmpty(env.LITELLM_MODEL)) ||
    (nonEmpty(env.CFO_AI_API_KEY) && nonEmpty(env.CFO_AI_MODEL))
  )
}

export function resolveCfoModelGateway(env: NodeJS.ProcessEnv = process.env): CfoModelGateway {
  const useLiteLLM = Boolean(nonEmpty(env.LITELLM_BASE_URL) && nonEmpty(env.LITELLM_API_KEY) && nonEmpty(env.LITELLM_MODEL))
  const apiKey = useLiteLLM ? nonEmpty(env.LITELLM_API_KEY) : nonEmpty(env.CFO_AI_API_KEY)
  const model = useLiteLLM ? nonEmpty(env.LITELLM_MODEL) : nonEmpty(env.CFO_AI_MODEL)
  if (!apiKey || !model) throw new Error('CFO model credentials are not configured')

  const rawBase = useLiteLLM
    ? nonEmpty(env.LITELLM_BASE_URL)
    : (nonEmpty(env.CFO_AI_BASE_URL) || 'https://api.openai.com/v1')

  if (!rawBase) throw new Error('Model gateway base URL must be configured')
  let parsed: URL
  try {
    parsed = new URL(rawBase)
  } catch {
    throw new Error('Model gateway base URL is invalid')
  }
  const local = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname === '::1'
  if ((parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && local)) ||
      parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error('Model gateway must be HTTPS, except for local loopback development')
  }
  const pathname = parsed.pathname.replace(/\/+$/, '')
  // Do not silently append /v1 twice; callers must supply an API root.
  const root = parsed.origin + (pathname || '')
  return {
    apiKey, model,
    endpoint: root + '/chat/completions',
    source: useLiteLLM ? 'litellm' : 'direct',
  }
}
