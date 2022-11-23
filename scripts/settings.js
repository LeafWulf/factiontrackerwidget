import { MODULE } from "./const.js"

export let debug = false

export function registerSettings() {

    /**********************
    DEBUG
    **********************/
    game.settings.register(MODULE, 'debug', {
        name: 'Enable Debugging',
        hint: `Activate debug to show console logs`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: debug,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });
}

// function that get the settings options and assign to the variables
export function cacheSettings() {
    debug = game.settings.get(MODULE, 'debug');
}
