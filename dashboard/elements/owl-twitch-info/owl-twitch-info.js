(function () {
    'use strict';
    
    class OwlTwitchInfo extends Polymer.Element {
        static get is() {
            return 'owl-twitch-info';
        }
        
        ready() {
            super.ready();

        }
    }
    customElements.define(OwlTwitchInfo.is, OwlTwitchInfo);
})();
