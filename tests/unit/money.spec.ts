import { describe, expect, it } from 'vitest'
import { formatSgd, parseSgdAmount } from '../../app/services/finance/money.js'

describe('exact SGD input parsing', () => {
  it('converts dollars without floating point errors', () => {
    expect(parseSgdAmount('12.30')).toBe(1230)
    expect(parseSgdAmount('0.01')).toBe(1)
    expect(parseSgdAmount('100')).toBe(10000)
    expect(parseSgdAmount('0')).toBe(0)
  })
  it('rejects negative values, excessive precision and invalid text', () => {
    for (const value of ['-1', '1.001', '1e3', '1,000', 'abc', '']) {
      expect(() => parseSgdAmount(value)).toThrow()
    }
  })
  it('formats money down to the cent', () => {
    expect(formatSgd(1230)).toContain('12.30')
  })
})
