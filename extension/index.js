"use strict";

module.exports = function(nodecg) {
  const twitchApi = nodecg.extensions["lfg-twitchapi"];

  if (twitchApi === undefined) {
    nodecg.log.error(
      "The lfg-twitchapi needs to be installed and configured for this bundle to work"
    );
    return;
  }

  const loadedRepl = nodecg.Replicant("dashboard-loaded", {
    defaultValue: false,
    persistent: false
  });
  const statusRepl = nodecg.Replicant("status", {
    defaultValue: "Refresh page to load info...",
    persistent: false
  });
  const gameRepl = nodecg.Replicant("game", {
    defaultValue: "",
    persistent: false
  });
  const liveRepl = nodecg.Replicant("live", {
    defaultValue: false,
    persistent: false
  });
  const streamStartRepl = nodecg.Replicant("start", {
    defaultValue: null,
    persistent: false
  });
  const viewersRepl = nodecg.Replicant("viewers", {
    defaultValue: 0,
    persistent: false
  });
  const viewsRepl = nodecg.Replicant("views", {
    defaultValue: 0,
    persistent: false
  });
  const followersRepl = nodecg.Replicant("followers", {
    defaultValue: 0,
    persistent: false
  });

  var requesting = false;

  loadedRepl.on("change", newVal => {
    if (newVal && !requesting) {
      requesting = true;
      setInterval(getInfo, nodecg.bundleConfig.updateInterval * 1000);
      getInfo();
    }
  });

  function getInfo() {
    twitchApi
      .get("/streams?user_id=" + nodecg.bundleConfig.channelId, {})
      .then(response => {
        if (response.statusCode !== 200) {
          nodecg.log.error(response.body.error, response.body.message);
          return;
        }

        if (response.body.data.length === 0) {
          liveRepl.value = false;
          return;
        }
        var stream = response.body.data[0];

        liveRepl.value = stream.viewer_count;
        streamStartRepl.value = stream.started_at;
        statusRepl.value = stream.title;
      })
      .catch(err => {
        nodecg.log.error("Api error", err);
      });
    twitchApi
      .get("/users?id=" + nodecg.bundleConfig.channelId, {})
      .then(response => {
        if (response.statusCode !== 200) {
          nodecg.log.error(response.body.error, response.body.message);
          return;
        }
        viewsRepl.value = response.body.data[0].view_count;
      })
      .catch(err => {
        nodecg.log.error("Api error", err);
      });

    twitchApi
      .get("/users/follows?to_id=" + nodecg.bundleConfig.channelId, {})
      .then(response => {
        if (response.statusCode !== 200) {
          nodecg.log.error(response.body.error, response.body.message);
          return;
        }
        followersRepl.value = response.body.total;
      })
      .catch(err => {
        nodecg.log.error("Api error", err);
      });
  }
};
