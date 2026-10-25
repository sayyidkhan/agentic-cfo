/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [[0,"/"]],
    types: placeholder as Registry['home']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [[0,"signup"]],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [[0,"signup"]],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [[0,"login"]],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [[0,"login"]],
    types: placeholder as Registry['session.store']['types'],
  },
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [[0,"dashboard"]],
    types: placeholder as Registry['dashboard']['types'],
  },
  'cfo.chat': {
    methods: ["GET","HEAD"],
    pattern: '/cfo',
    tokens: [[0,"cfo"]],
    types: placeholder as Registry['cfo.chat']['types'],
  },
  'cfo.message.store': {
    methods: ["POST"],
    pattern: '/cfo/chat',
    tokens: [[0,"cfo"],[0,"chat"]],
    types: placeholder as Registry['cfo.message.store']['types'],
  },
  'cfo.message.clear': {
    methods: ["DELETE"],
    pattern: '/cfo/chat',
    tokens: [[0,"cfo"],[0,"chat"]],
    types: placeholder as Registry['cfo.message.clear']['types'],
  },
  'finance.accounts.store': {
    methods: ["POST"],
    pattern: '/finance/accounts',
    tokens: [[0,"finance"],[0,"accounts"]],
    types: placeholder as Registry['finance.accounts.store']['types'],
  },
  'finance.categories.store': {
    methods: ["POST"],
    pattern: '/finance/categories',
    tokens: [[0,"finance"],[0,"categories"]],
    types: placeholder as Registry['finance.categories.store']['types'],
  },
  'finance.transactions.store': {
    methods: ["POST"],
    pattern: '/finance/transactions',
    tokens: [[0,"finance"],[0,"transactions"]],
    types: placeholder as Registry['finance.transactions.store']['types'],
  },
  'finance.budgets.store': {
    methods: ["POST"],
    pattern: '/finance/budgets',
    tokens: [[0,"finance"],[0,"budgets"]],
    types: placeholder as Registry['finance.budgets.store']['types'],
  },
  'finance.valuations.store': {
    methods: ["POST"],
    pattern: '/finance/valuations',
    tokens: [[0,"finance"],[0,"valuations"]],
    types: placeholder as Registry['finance.valuations.store']['types'],
  },
  'finance.transactions.update': {
    methods: ["PATCH"],
    pattern: '/finance/transactions/:id',
    tokens: [[0,"finance"],[0,"transactions"],[1,"id"]],
    types: placeholder as Registry['finance.transactions.update']['types'],
  },
  'finance.transactions.delete': {
    methods: ["DELETE"],
    pattern: '/finance/transactions/:id',
    tokens: [[0,"finance"],[0,"transactions"],[1,"id"]],
    types: placeholder as Registry['finance.transactions.delete']['types'],
  },
  'finance.valuations.update': {
    methods: ["PATCH"],
    pattern: '/finance/valuations/:id',
    tokens: [[0,"finance"],[0,"valuations"],[1,"id"]],
    types: placeholder as Registry['finance.valuations.update']['types'],
  },
  'finance.valuations.delete': {
    methods: ["DELETE"],
    pattern: '/finance/valuations/:id',
    tokens: [[0,"finance"],[0,"valuations"],[1,"id"]],
    types: placeholder as Registry['finance.valuations.delete']['types'],
  },
  'finance.commitments.store': {
    methods: ["POST"],
    pattern: '/finance/commitments',
    tokens: [[0,"finance"],[0,"commitments"]],
    types: placeholder as Registry['finance.commitments.store']['types'],
  },
  'finance.commitments.paid': {
    methods: ["POST"],
    pattern: '/finance/commitments/:id/paid',
    tokens: [[0,"finance"],[0,"commitments"],[1,"id"],[0,"paid"]],
    types: placeholder as Registry['finance.commitments.paid']['types'],
  },
  'finance.commitments.delete': {
    methods: ["DELETE"],
    pattern: '/finance/commitments/:id',
    tokens: [[0,"finance"],[0,"commitments"],[1,"id"]],
    types: placeholder as Registry['finance.commitments.delete']['types'],
  },
  'finance.goals.store': {
    methods: ["POST"],
    pattern: '/finance/goals',
    tokens: [[0,"finance"],[0,"goals"]],
    types: placeholder as Registry['finance.goals.store']['types'],
  },
  'finance.goals.update': {
    methods: ["PATCH"],
    pattern: '/finance/goals/:id',
    tokens: [[0,"finance"],[0,"goals"],[1,"id"]],
    types: placeholder as Registry['finance.goals.update']['types'],
  },
  'finance.goals.delete': {
    methods: ["DELETE"],
    pattern: '/finance/goals/:id',
    tokens: [[0,"finance"],[0,"goals"],[1,"id"]],
    types: placeholder as Registry['finance.goals.delete']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [[0,"logout"]],
    types: placeholder as Registry['session.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
