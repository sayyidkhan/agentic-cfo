import { test } from '@japa/runner'
import { cfoModelConfigured, resolveCfoModelGateway } from '../../app/services/cfo/model_gateway.js'

test.group('LiteLLM model gateway settings', () => {
  test('routes shared model alias through LiteLLM gateway', ({ assert }) => {
    const cfg = resolveCfoModelGateway({
      LITELLM_BASE_URL: 'https://llm.example.com/v1',
      LITELLM_API_KEY: 'virtual-test-key',
      LITELLM_MODEL: 'agentic-cfo',
    })
    assert.equal(cfg.endpoint, 'https://llm.example.com/v1/chat/completions')
    assert.equal(cfg.model, 'agentic-cfo')
    assert.equal(cfg.source, 'litellm')
    assert.equal(cfg.apiKey, 'virtual-test-key')
  })
  test('prefers complete gateway config to the old direct provider', ({ assert }) => {
    const cfg = resolveCfoModelGateway({
      LITELLM_BASE_URL: 'https://gateway.example.com/v1/',
      LITELLM_API_KEY: 'litellm-key',
      LITELLM_MODEL: 'cfo',
      CFO_AI_API_KEY: 'old-key',
      CFO_AI_MODEL: 'old-model',
    })
    assert.equal(cfg.model, 'cfo')
    assert.equal(cfg.source, 'litellm')
  })
  test('preserves existing direct model configuration', ({ assert }) => {
    const cfg = resolveCfoModelGateway({
      CFO_AI_API_KEY: 'existing-key',
      CFO_AI_MODEL: 'existing-model',
      CFO_AI_BASE_URL: 'https://api.openai.com/v1',
    })
    assert.equal(cfg.source, 'direct')
    assert.equal(cfg.endpoint, 'https://api.openai.com/v1/chat/completions')
  })
  test('rejects HTTP public gateways and credentials in a URL', ({ assert }) => {
    for (const base of ['http://gateway.example.com/v1', 'https://user:pass@gateway.example.com/v1']) {
      assert.throws(() => resolveCfoModelGateway({
        LITELLM_BASE_URL: base, LITELLM_API_KEY: 'key', LITELLM_MODEL: 'cfo',
      }))
    }
  })
  test('allows a local loopback proxy during development', ({ assert }) => {
    assert.equal(resolveCfoModelGateway({
      LITELLM_BASE_URL: 'http://127.0.0.1:4000/v1',
      LITELLM_API_KEY: 'key', LITELLM_MODEL: 'cfo',
    }).endpoint, 'http://127.0.0.1:4000/v1/chat/completions')
  })
  test('requires complete credentials and explicit LiteLLM URL', ({ assert }) => {
    assert.isFalse(cfoModelConfigured({}))
    assert.isTrue(cfoModelConfigured({ LITELLM_BASE_URL: 'https://gateway.example.com/v1', LITELLM_API_KEY: 'test-key', LITELLM_MODEL: 'alias' }))
    assert.isFalse(cfoModelConfigured({ LITELLM_API_KEY: 'test-key', LITELLM_MODEL: 'alias' }))
    assert.throws(() => resolveCfoModelGateway({
      LITELLM_API_KEY: 'key', LITELLM_MODEL: 'alias',
    }))
  })
})
