import Currency from '../entities/Currency';
import { type } from 'os';

type BalanceAsCentsT = {
  [currency: string]: number;
};

type BalanceAsInputStringT = {
  [currency: string]: string;
};

interface AccountBaseT {
  group: AccountGroupT;
  name: string;
  currencies: string[];
  on_dashboard: boolean;
  archived?: boolean;
}

export interface AccountStateT extends AccountBaseT {
  id: string;
  balance: BalanceAsCentsT;
}

export interface AccountStorageT extends AccountBaseT {
  _id: string;
  _rev?: string;
  _conflicts?: string[];
  balance: BalanceAsCentsT;
}

export interface AccountFormT extends AccountBaseT {
  id?: string;
  balance: BalanceAsInputStringT;
  completed?: boolean;
  isModalOpen?: boolean;
  isDeleteRequest?: boolean;
  isDeleteRunning?: boolean;
  itemsToProcess?: number;
  itemsProcessed?: number;
}

export enum AccountGroupT {
  Cash = 'cash',
  Bank = 'bank',
  Deposit = 'deposit',
  Credit = 'credit',
  Asset = 'asset'
}

export enum DeleteStrategyT {
  Archive,
  Cleanup,
  Move
}


type AccountGroupType = {
  [code: string]: string
}
let GroupToTextMap: AccountGroupType = {}

loadAccountGroups()

function loadAccountGroups() {
  return fetch("http://localhost:8080/accountGroups")
    .then(res => res.json())
    .then(res => res.reduce(function(acc: { [x: string]: {}; }, obj: any) {
      acc[obj.code] = obj.name

      return acc
    }, {}))
    .then(res => setAccountGroups(res))
}

function setAccountGroups(obj: any) {
  GroupToTextMap = obj
}

export const defaultGroup = AccountGroupT.Cash;
export const defaultDeleteStrategy = DeleteStrategyT.Archive;

export function getGroupName(code: AccountGroupT) {
  return GroupToTextMap[code.toString()];
}
export function getAccountGroupOptions() {
  return Object.entries(GroupToTextMap).map(([code, text]) => ({
    key: code,
    value: code,
    text
  }));
}

export function getDeleteStartegyOptions(hasMultipleAccounts = false) {
  const stratgies = [
    {
      key: DeleteStrategyT.Archive,
      value: DeleteStrategyT.Archive,
      text: 'Archive account, keep transactions as is'
    },
    {
      key: DeleteStrategyT.Cleanup,
      value: DeleteStrategyT.Cleanup,
      text: 'Delete transactions with account'
    }
  ];
  if (hasMultipleAccounts) {
    stratgies.push({
      key: DeleteStrategyT.Move,
      value: DeleteStrategyT.Move,
      text: 'Move transactions to another account'
    });
  }

  return stratgies;
}

export function formTostate({
  id,
  balance,
  name,
  group,
  currencies,
  on_dashboard,
  archived
}: AccountFormT): AccountStateT {
  return {
    id: id || `A${Date.now()}`,
    balance: Object.keys(balance).reduce(
      (acc: BalanceAsCentsT, code: string) => {
        acc[code] = Currency.numberToCents(
          balance[code] !== '' ? balance[code] : '0',
          code
        );
        return acc;
      },
      {}
    ),
    name,
    group,
    currencies,
    on_dashboard: true,
    archived: false
  };
}

export function stateToForm(account: AccountStateT): AccountFormT {
  return {
    ...account,
    balance: Object.keys(account.balance).reduce(
      (acc: BalanceAsInputStringT, code: string) => {
        acc[code] = Currency.centsToString(account.balance[code], code, false);
        return acc;
      },
      {}
    )
  };
}

export function storageToState({
  _id,
  name,
  group,
  balance,
  currencies,
  on_dashboard,
  archived
}: AccountStorageT): AccountStateT {
  return {
    id: _id,
    name,
    group,
    balance,
    currencies,
    on_dashboard: true,
    archived: false
  };
}

export function stateToStorage({
  name,
  group,
  balance,
  currencies,
  on_dashboard,
  archived
}: AccountStateT) {
  return { name, group, balance, currencies, on_dashboard: true, archived: false };
}

export function mutateBalance(
  account: AccountStorageT,
  currency: string,
  amount: number
): AccountStorageT {
  return {
    ...account,
    currencies: [...new Set([...account.currencies, currency])],
    balance: {
      ...account.balance,
      [currency]: parseInt(`${account.balance[currency] || 0}`, 10) + amount
    }
  };
}
