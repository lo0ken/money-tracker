import { tagsDB, remoteTagsDB, destroyTagsDB } from './pouchdb';

export default {
  sync,
  load,
  updateUsage,
  destroy
};

async function sync(readOnly = false) {
  let hasChanges = false;
  if (!remoteTagsDB()) return hasChanges;

  const from = await tagsDB().replicate.from(remoteTagsDB());
  if (from.docs_written > 0) hasChanges = true;
  if (readOnly) return hasChanges;

  await tagsDB().replicate.to(remoteTagsDB());

  return hasChanges;
}

function destroy() {
  return destroyTagsDB();
}

function load(kind) {

  return fetch("http://localhost:8080/tags?typeId=" + kind)
    .then(response => response.json())
    .then(response => response.map(row => ({
        tag: row.name,
      })))
    .then(tags => tags.map(tag => tag.tag))
}

function updateUsage(kind, tag, delta) {
  const id = `t${kind}/${tag}`;
  return tagsDB()
    .get(id)
    .then(doc =>
      tagsDB().put({ ...doc, usage: parseInt(doc.usage, 10) + delta })
    )
    .catch(err => {
      if (err.status !== 404) throw err;

      return tagsDB().put({ _id: id, usage: 1 });
    });
}
