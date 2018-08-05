'use strict';

module.exports = function (nodecg) {
    const twitchApi = nodecg.extensions['lfg-twitchapi'];

    if (twitchApi === undefined) {
        nodecg.log.error('The lfg-twitchapi needs to be installed and configured for this bundle to work');
        return;
    }

    const loadedRepl = nodecg.Replicant('dashboard-loaded', {defaultValue: false, persistent: false});
    const statusRepl = nodecg.Replicant('status', {defaultValue: 'Refresh page to load info...', persistent: false});
    const gameRepl = nodecg.Replicant('game', {defaultValue: '', persistent: false});
    const liveRepl = nodecg.Replicant('live', {defaultValue: false, persistent: false});
    const streamStartRepl = nodecg.Replicant('start', {defaultValue: null, persistent: false});
    const viewersRepl = nodecg.Replicant('viewers', {defaultValue: 0, persistent: false});
    const viewsRepl = nodecg.Replicant('views', {defaultValue: 0, persistent: false});
    const followersRepl = nodecg.Replicant('followers', {defaultValue: 0, persistent: false});

    var requesting = false;

    loadedRepl.on('change', newVal => {
        if (newVal && !requesting) {
            requesting = true;
            setInterval(getInfo, nodecg.bundleConfig.updateInterval * 1000);
            getInfo();
        }
    });

    

    function getInfo() {
        twitchApi.get('/streams/{{username}}', {}).then(response => {
            if (response.statusCode !== 200) {
                nodecg.log.error(response.body.error, response.body.message);
                return;
            }
            var stream = response.body.stream;

            if (stream == null) {
                liveRepl.value = false;
                return;
            }

            liveRepl.value = stream.viewers;
            streamStartRepl.value = stream.created_at;
        }).catch(err => {
            nodecg.log.error('Api error', err);
        });
        twitchApi.get('/channels/{{username}}', {}).then(response => {
            if (response.statusCode !== 200) {
                nodecg.log.error(response.body.error, response.body.message);
                return;
            }

            statusRepl.value = response.body.status;
            viewsRepl.value = response.body.views;
            followersRepl.value = response.body.followers;

        }).catch(err => {
            nodecg.log.error('Api error', err);
        });
    }
};
