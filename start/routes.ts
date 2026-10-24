/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

const FinanceController = () => import('#controllers/finance_controller')

router.on('/').renderInertia('home', {}).as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.get('/dashboard', [FinanceController, 'index']).as('dashboard')
    router.post('/finance/accounts', [FinanceController, 'storeAccount']).as('finance.accounts.store')
    router.post('/finance/categories', [FinanceController, 'storeCategory']).as('finance.categories.store')
    router.post('/finance/transactions', [FinanceController, 'storeTransaction']).as('finance.transactions.store')
    router.post('/finance/budgets', [FinanceController, 'storeBudget']).as('finance.budgets.store')
    router.post('/finance/valuations', [FinanceController, 'storeValuation']).as('finance.valuations.store')
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
