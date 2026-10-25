import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'cfo.chat': { paramsTuple?: []; params?: {} }
    'cfo.message.store': { paramsTuple?: []; params?: {} }
    'cfo.message.clear': { paramsTuple?: []; params?: {} }
    'finance.accounts.store': { paramsTuple?: []; params?: {} }
    'finance.categories.store': { paramsTuple?: []; params?: {} }
    'finance.transactions.store': { paramsTuple?: []; params?: {} }
    'finance.budgets.store': { paramsTuple?: []; params?: {} }
    'finance.valuations.store': { paramsTuple?: []; params?: {} }
    'finance.transactions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'finance.transactions.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'finance.valuations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'finance.valuations.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'finance.commitments.store': { paramsTuple?: []; params?: {} }
    'finance.commitments.paid': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'finance.commitments.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'finance.goals.store': { paramsTuple?: []; params?: {} }
    'finance.goals.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'finance.goals.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'cfo.chat': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'cfo.chat': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'cfo.message.store': { paramsTuple?: []; params?: {} }
    'finance.accounts.store': { paramsTuple?: []; params?: {} }
    'finance.categories.store': { paramsTuple?: []; params?: {} }
    'finance.transactions.store': { paramsTuple?: []; params?: {} }
    'finance.budgets.store': { paramsTuple?: []; params?: {} }
    'finance.valuations.store': { paramsTuple?: []; params?: {} }
    'finance.commitments.store': { paramsTuple?: []; params?: {} }
    'finance.commitments.paid': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'finance.goals.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'cfo.message.clear': { paramsTuple?: []; params?: {} }
    'finance.transactions.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'finance.valuations.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'finance.commitments.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'finance.goals.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'finance.transactions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'finance.valuations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'finance.goals.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}