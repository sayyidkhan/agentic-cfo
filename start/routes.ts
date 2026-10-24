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
    router.patch('/finance/transactions/:id', [FinanceController, 'updateTransaction']).as('finance.transactions.update')
    router.delete('/finance/transactions/:id', [FinanceController, 'deleteTransaction']).as('finance.transactions.delete')
    router.patch('/finance/valuations/:id', [FinanceController, 'updateValuation']).as('finance.valuations.update')
    router.delete('/finance/valuations/:id', [FinanceController, 'deleteValuation']).as('finance.valuations.delete')
    router.post('/finance/commitments', [FinanceController, 'storeCommitment']).as('finance.commitments.store')
    router.post('/finance/commitments/:id/paid', [FinanceController, 'markCommitmentPaid']).as('finance.commitments.paid')
    router.delete('/finance/commitments/:id', [FinanceController, 'deleteCommitment']).as('finance.commitments.delete')
    router.post('/finance/goals', [FinanceController, 'storeGoal']).as('finance.goals.store')
    router.patch('/finance/goals/:id', [FinanceController, 'updateGoal']).as('finance.goals.update')
    router.delete('/finance/goals/:id', [FinanceController, 'deleteGoal']).as('finance.goals.delete')
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
