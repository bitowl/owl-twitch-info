(function () {
    'use strict';
    
    class OwlTwitchInfo extends Polymer.Element {
        static get is() {
            return 'owl-twitch-info';
        }
        
        ready() {
            super.ready();
            const loadedRepl = nodecg.Replicant('dashboard-loaded', {defaultValue: false, persistent: false});
            loadedRepl.value = true;
        }
    }
    customElements.define(OwlTwitchInfo.is, OwlTwitchInfo);
})();
