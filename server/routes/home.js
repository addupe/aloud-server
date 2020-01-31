// home (explore) routes
const express = require('express');
const { getHomeRecordings, getHomeCollections, getRecentlySaved, getArtists } = require('../db/helpers/home');
const homeRouter = express.Router();

homeRouter.get('/:userId', (req, res) => {
  const { userId } = req.params;

  const homeContent = [{
    collections: [],
    recordings: [],
    users: []
  }];

  getHomeRecordings(userId)
  .then(rows => {
    homeContent[0].recordings = rows;
    getHomeCollections(userId)
    .then(rows => {
      homeContent[0].collections = rows;
      getArtists(userId)
      .then(rows => {
        homeContent[0].users = rows;
        res.send(homeContent);
      })
    });
  })
  .catch(err => {
    debugger;
    res.sendStatus(404);
  });

})

module.exports = homeRouter;