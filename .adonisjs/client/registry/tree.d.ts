/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  dashboard: typeof routes['dashboard']
  cfo: {
    chat: typeof routes['cfo.chat']
    message: {
      store: typeof routes['cfo.message.store']
      clear: typeof routes['cfo.message.clear']
    }
  }
  finance: {
    accounts: {
      store: typeof routes['finance.accounts.store']
    }
    categories: {
      store: typeof routes['finance.categories.store']
    }
    transactions: {
      store: typeof routes['finance.transactions.store']
      update: typeof routes['finance.transactions.update']
      delete: typeof routes['finance.transactions.delete']
    }
    budgets: {
      store: typeof routes['finance.budgets.store']
    }
    valuations: {
      store: typeof routes['finance.valuations.store']
      update: typeof routes['finance.valuations.update']
      delete: typeof routes['finance.valuations.delete']
    }
    commitments: {
      store: typeof routes['finance.commitments.store']
      paid: typeof routes['finance.commitments.paid']
      delete: typeof routes['finance.commitments.delete']
    }
    goals: {
      store: typeof routes['finance.goals.store']
      update: typeof routes['finance.goals.update']
      delete: typeof routes['finance.goals.delete']
    }
  }
}
