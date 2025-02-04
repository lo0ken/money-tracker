import { accountsDB, remoteAccountsDB, destroyAccountsDB } from './pouchdb';
import {
  storageToState,
  stateToStorage,
  mutateBalance as mutateAccountBalance
} from '../../entities/Account';

export default {
  sync,
  loadAll,
  save,
  archive,
  mutateBalance,
  remove,
  destroy
};

async function sync(readOnly = false) {
  if (!remoteAccountsDB()) return;
  let accounts;

  const from = await accountsDB().replicate.from(remoteAccountsDB());
  if (from.docs_written > 0) {
    accounts = await loadAll();
    updateLastSyncedBalance(accounts);
  }

  if (readOnly) return;

  const to = await accountsDB().replicate.to(remoteAccountsDB());
  if (to.docs_written > 0) {
    accounts = await loadAll();
    updateLastSyncedBalance(accounts);
  }
}

function destroy() {
  return destroyAccountsDB();
}

async function loadAll() {
  const token = localStorage.token;

  return await fetch("http://localhost:8080/accounts", {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(res => res.map(storageToState))
}

async function save(account) {
  const token = localStorage.token;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(account)
  };

  return await fetch('http://localhost:8080/accounts/save', requestOptions)
    .then(response => response)
}

function archive(accountId) {
  return accountsDB()
    .get(accountId)
    .then(doc => accountsDB().put({ ...doc, archived: true }));
}

function mutateBalance({ accountId, currency, amount }) {
  const token = localStorage.token;

  return fetch("http://localhost:8080/accounts/" + accountId, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())


  /*return accountsDB()
    .get(accountId)
    .then(doc => accountsDB().put(mutateAccountBalance(doc, currency, amount)))
    .then(({ rev }) => accountsDB().get(accountId, rev))
    .then(doc => storageToState(doc));*/
}

function remove(accountId) {
  const token = localStorage.token;

  return fetch("http://localhost:8080/accounts/delete/" + accountId, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  /*return accountsDB()
    .get(accountId)
    .then(doc => accountsDB().put({ ...doc, _deleted: true }))
    .catch(err => {
      if (err.status !== 404) throw err;
      return true;
    });*/
}

function updateLastSyncedBalance(accounts) {
  accounts.forEach(account => {
    localStorage.setItem(account.id, JSON.stringify(account.balance));
  });
}
