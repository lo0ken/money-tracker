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

function loadAll() {
  return fetch("http://localhost:8080/accounts")
    .then(res => res.json())
    .then(res => res.map(storageToState))
}

function save(account) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account)
  };

  return fetch('http://localhost:8080/accounts/save', requestOptions)
    .then(response => response)
}

function archive(accountId) {
  return accountsDB()
    .get(accountId)
    .then(doc => accountsDB().put({ ...doc, archived: true }));
}

function mutateBalance({ accountId, currency, amount }) {
  return fetch("http://localhost:8080/accounts/" + accountId)
    .then(res => res.json())


  /*return accountsDB()
    .get(accountId)
    .then(doc => accountsDB().put(mutateAccountBalance(doc, currency, amount)))
    .then(({ rev }) => accountsDB().get(accountId, rev))
    .then(doc => storageToState(doc));*/
}

function remove(accountId) {
  return accountsDB()
    .get(accountId)
    .then(doc => accountsDB().put({ ...doc, _deleted: true }))
    .catch(err => {
      if (err.status !== 404) throw err;
      return true;
    });
}

function updateLastSyncedBalance(accounts) {
  accounts.forEach(account => {
    localStorage.setItem(account.id, JSON.stringify(account.balance));
  });
}
