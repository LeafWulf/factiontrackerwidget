import { MODULE } from "./const.js"

export let debug = false
export let ftw = []
/* {
    section: {
        name: 'default',
        factions: {
        }
    }
} */
export let ftwConfig = {
    rep: {
        min: -5,
        max: 5,
        neutral: 0,
        names: ['Enemy', 'Outsider', 'Neutral', 'Acquaintance', 'Friend', 'Ally', 'Kindred']
    }
}

export function registerSettings() {

    // game.settings.registerMenu(MODULE, "ftwConfig", {
    //     name: "FTW Configuration",
    //     label: "FTW Configuration",
    //     hint: "",
    //     icon: 'fas fa-cogs',
    //     type: ConfigApp,
    //     restricted: true
    // });

    /**********************
    GLOBAL VARIABLES
    **********************/
    game.settings.register(MODULE, 'ftwConfig', {
        name: 'ftwConfig object',
        hint: ``,
        scope: 'world',
        config: false,
        type: Object,
        default: ftwConfig,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });
    game.settings.register(MODULE, 'ftw', {
        name: 'factions object',
        hint: ``,
        scope: 'world',
        config: false,
        type: Array,
        default: ftw,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

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
    ftw = game.settings.get(MODULE, 'ftw');
}
