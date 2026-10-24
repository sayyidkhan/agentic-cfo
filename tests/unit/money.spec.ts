import { test } from '@japa/runner'
import { formatSgd, parseSgdAmount } from '../../app/services/finance/money.js'

test.group('exact SGD parsing', () => {
  test('converts dollars to integer cents', ({ assert }) => {
    assert.equal(parseSgdAmount('12.30'), 1230)
    assert.equal(parseSgdAmount('0.01'), 1)
    assert.equal(parseSgdAmount('100'), 10000)
    assert.equal(parseSgdAmount('0'), 0)
  })

  test('rejects negative, fractional cent and invalid inputs', ({ assert }) => {
    for (const raw of ['-1', '1.001', '1e3', '1,000', 'abc', '']) {
      assert.throws(() => parseSgdAmount(raw))
    }
  })

  test('formats money', ({ assert }) => {
    assert.include(formatSgd(1230), '12.30')
  })
})
