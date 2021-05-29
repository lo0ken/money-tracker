import {
  transactionsDB,
  remoteTransactionsDB,
  destroyTransactionsDB
} from './pouchdb';
import {
  recentListLimit,
  storageToState,
  stateToStorage
} from '../../entities/Transaction';
import intersection from 'lodash/intersection';

export default {
  sync,
  load,
  getAll,
  loadRecent,
  loadFiltered,
  save,
  remove,
  destroy
};

async function sync(readOnly = true) {
  if (!remoteTransactionsDB()) return;
  const options = { batch_size: 500 };

  await transactionsDB()
    .replicate.from(remoteTransactionsDB(), options)
    .on('change', async update => {
      await Promise.all(update.docs.map(processIncomingTransaction));
    });

  if (!readOnly) {
    await transactionsDB().replicate.to(remoteTransactionsDB(), options);
  }
}

async function processIncomingTransaction(tx) {
  if (tx._id.startsWith('T') && !tx._id.includes('-') && !tx._deleted) {
    await save({
      ...tx,
      id: `T${tx.date}-${tx._id.substr(1)}`,
      date: undefined,
      tags: tx.tags && tx.tags.length ? tx.tags : undefined,
      note: tx.note && tx.note.length ? tx.note : undefined
    });
    await transactionsDB().remove(tx);
  }

  return tx;
}

function load(id) {
  return transactionsDB()
    .get(id)
    .then(storageToState)
    .catch(error => {
      if (error.status !== 404) throw error;
    });
}

async function loadRecent(limit = recentListLimit) {
  return await fetch("http://localhost:8080/transactions/recent?limit=" + limit)
    .then(response => response.json())
    .then(response => response.map(stateToStorage))
}

async function getAll() {
  return transactionsDB()
    .allDocs({
      include_docs: true,
      descending: true,
      startkey: 'T\uffff',
      endkey: 'T'
    })
    .then(response => response.rows.map(row => row.doc))
    .then(docs => docs.map(storageToState));
}

async function loadFiltered(filters = {}) {
  let startDate = "startDate=" + filters.date.start
  let endDate = "endDate=" + filters.date.end

  return await fetch("http://localhost:8080/transactions?" + startDate + "&" + endDate)
    .then(response => response.json())
    .then(docs => filterByAccount(docs, filters.accounts))
    .then(docs => filterByTags(docs, filters.tags))
    .then(docs => docs.map(storageToState))
}

/**
 * Filter transactions by account.
 *
 * @param {array} docs
 * @param {Set} accounts
 * @return {array}
 */
function filterByAccount(docs, accounts) {
  if (Array.isArray(accounts)) accounts = new Set(accounts);
  if (!accounts || !accounts.size) return docs;

  return docs.filter(
    tx => accounts.has(tx.accountId) || accounts.has(tx.linkedAccountId)
  );
}

/**
 * Filter transactions by tag.
 *
 * @param {array} docs
 * @param {array} tags
 * @return {array}
 */
function filterByTags(docs, tags) {
  return tags && tags.length > 0
    ? docs.filter(tx => intersection(tx.tags, tags).length > 0)
    : docs;
}

async function saveTrans(transaction) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  };

  const response = await fetch("http://localhost:8080/transactions/save", requestOptions);
  const body = await response.clone().json()
  return body
}

function save(transaction) {

    return saveTrans(transaction).then(
      result => stateToStorage(result)
    )

  /*return transactionsDB()
    .get(transaction.id)
    .then(doc =>
      transactionsDB().put({
        ...doc,
        ...stateToStorage(transaction)
      })
    )
    .catch(err => {
      if (err.status !== 404) throw err;

      return transactionsDB().put({
        _id: transaction.id,
        ...stateToStorage(transaction)
      });
    });*/
}

async function remove(id) {
  if (!id) return false;

  const requestOptions = {
    method: 'DELETE'
  };
  return fetch("http://localhost:8080/transactions/delete/" + id, requestOptions)
    .then(response => response.json())

  /*return transactionsDB()
    .get(id)
    .then(doc =>
      transactionsDB()
        .put({ ...doc, _deleted: true })
        .then(() => doc)
    )
    .catch(err => {
      if (err.status !== 404) throw err;
      return false;
    });*/
}

function destroy() {
  return destroyTransactionsDB();
}
