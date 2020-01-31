const { db } = require('../../db/pg-adaptor');


const getHomeCollections = (userId) => {
  const collectionSQL = `SELECT collections.id, username, name, title, description, count_recordings, collections.url_image, created_at FROM collections JOIN users ON users.id = collections.id_user_creator WHERE collections.id_user_creator != ${userId}`;
  return db.query(collectionSQL);
};

const getHomeRecordings = (userId) => {
  const recordingSQL = `SELECT recordings.id, username, name, title, description, url_recording, speech_to_text, created_at FROM recordings JOIN users ON users.id = recordings.id_user WHERE published = 'public' AND recordings.id_user != ${userId}`;
  return db.query(recordingSQL);
};

//recently saved queries below
const stageRecentlySaved = async (userId) => {

  const assignContentIds = async (userId) => {
    const collectionSQL = `SELECT id_collection FROM users_saved_collections WHERE id_user = ${userId} ORDER BY created_at`;
    const ids = {
      collectionIds: await db.query(collectionSQL),
    };

    ids.collectionIds = ids.collectionIds.map(id => { return id.id_collection });

    return ids;
  };


  const stageContent = async (ids, userId) => {
    const collectionSQL = `SELECT c.id, title, description, count_recordings, c.url_image, c.created_at, u.username FROM collections as c JOIN users AS u ON u.id = id_user_creator WHERE id_user_creator != ${userId} AND c.id = ANY($1::int[])`;

    const content = [{
      collections: await db.query(collectionSQL, [ids.collectionIds]),
    }]

    return content;
  };

  return assignContentIds(userId)
    .then(ids => {
      return stageContent(ids, userId);
    })
    .catch(err => {
      console.error(err);
      debugger;
    })

};

const getRecentlySaved = (userId) => {
  const content = stageRecentlySaved(userId);
  return content;
};

const getArtists = (userId) => {
  //get all artists that are not user
  const artistSQL = `SELECT * FROM users WHERE id != ${userId} ORDER BY random() LIMIT 5`;
  return db.query(artistSQL);
};

module.exports.getHomeCollections = getHomeCollections;
module.exports.getHomeRecordings = getHomeRecordings;
module.exports.getRecentlySaved = getRecentlySaved;
module.exports.getArtists = getArtists;
