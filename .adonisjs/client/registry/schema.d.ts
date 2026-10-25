/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractRawResponse, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
      rawResponse: ExtractRawResponse<unknown>
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['index']>>>
    }
  }
  'cfo.chat': {
    methods: ["GET","HEAD"]
    pattern: '/cfo'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cfo_chat_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cfo_chat_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/cfo_chat_controller').default['index']>>>
    }
  }
  'cfo.message.store': {
    methods: ["POST"]
    pattern: '/cfo/chat'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/cfo_chat').cfoMessageValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/cfo_chat').cfoMessageValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cfo_chat_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cfo_chat_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/cfo_chat_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'cfo.message.clear': {
    methods: ["DELETE"]
    pattern: '/cfo/chat'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cfo_chat_controller').default['clear']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cfo_chat_controller').default['clear']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/cfo_chat_controller').default['clear']>>>
    }
  }
  'finance.accounts.store': {
    methods: ["POST"]
    pattern: '/finance/accounts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/finance').createAccountValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/finance').createAccountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeAccount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeAccount']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeAccount']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'finance.categories.store': {
    methods: ["POST"]
    pattern: '/finance/categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/finance').createCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/finance').createCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeCategory']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeCategory']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'finance.transactions.store': {
    methods: ["POST"]
    pattern: '/finance/transactions'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/finance').createTransactionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/finance').createTransactionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeTransaction']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeTransaction']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeTransaction']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'finance.budgets.store': {
    methods: ["POST"]
    pattern: '/finance/budgets'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/finance').upsertBudgetValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/finance').upsertBudgetValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeBudget']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeBudget']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeBudget']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'finance.valuations.store': {
    methods: ["POST"]
    pattern: '/finance/valuations'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/finance').createValuationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/finance').createValuationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeValuation']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeValuation']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeValuation']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'finance.transactions.update': {
    methods: ["PATCH"]
    pattern: '/finance/transactions/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/finance').createTransactionValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/finance').createTransactionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['updateTransaction']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['updateTransaction']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['updateTransaction']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'finance.transactions.delete': {
    methods: ["DELETE"]
    pattern: '/finance/transactions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['deleteTransaction']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['deleteTransaction']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['deleteTransaction']>>>
    }
  }
  'finance.valuations.update': {
    methods: ["PATCH"]
    pattern: '/finance/valuations/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/finance').createValuationValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/finance').createValuationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['updateValuation']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['updateValuation']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['updateValuation']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'finance.valuations.delete': {
    methods: ["DELETE"]
    pattern: '/finance/valuations/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['deleteValuation']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['deleteValuation']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['deleteValuation']>>>
    }
  }
  'finance.commitments.store': {
    methods: ["POST"]
    pattern: '/finance/commitments'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/finance').createCommitmentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/finance').createCommitmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeCommitment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeCommitment']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeCommitment']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'finance.commitments.paid': {
    methods: ["POST"]
    pattern: '/finance/commitments/:id/paid'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['markCommitmentPaid']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['markCommitmentPaid']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['markCommitmentPaid']>>>
    }
  }
  'finance.commitments.delete': {
    methods: ["DELETE"]
    pattern: '/finance/commitments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['deleteCommitment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['deleteCommitment']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['deleteCommitment']>>>
    }
  }
  'finance.goals.store': {
    methods: ["POST"]
    pattern: '/finance/goals'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/finance').createGoalValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/finance').createGoalValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeGoal']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeGoal']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['storeGoal']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'finance.goals.update': {
    methods: ["PATCH"]
    pattern: '/finance/goals/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/finance').createGoalValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/finance').createGoalValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['updateGoal']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['updateGoal']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['updateGoal']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'finance.goals.delete': {
    methods: ["DELETE"]
    pattern: '/finance/goals/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['deleteGoal']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['deleteGoal']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/finance_controller').default['deleteGoal']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
}
