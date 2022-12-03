import { MODULE, MODULE_DIR } from "./const.js"; //import the const variables
import { registerSettings, cacheSettings, debug, ftw, ftwConfig } from "./settings.js"; //import settings

export function notValidString() {
    new Dialog({
        title: "FTW | Not Valid String!",
        content: '<p>The name you typed is not valid</p>',
        buttons: {
            yes: {
                icon: "<i class='fas fa-check'></i>",
                label: "OK",
                callback: async () => {
                    return
                }
            },
        },
        default: "yes",
    }).render(true);
}

export function removeSpaces(string) {
    string = string.replace(/[\s+]/g, '-').toLowerCase()
    return string
}

export function repNames(number) {
    if (number <= -3) return 'Enemy'
    else if (number < 0) return 'Outsider'
    else if (number == 0) return 'Neutral'
    else if (number == 1) return 'Acquaintance'
    else if (number == 2) return 'Friend'
    else if (number == 3) return 'Friend'
    else if (number == 4) return 'Ally'
    else if (number == 5) return 'Kindred'
}

export function convertValues(number = 0) {
    let max = ftwConfig.rep.max, min = ftwConfig.rep.min, neutral = ftwConfig.rep.neutral;
    let obj = {
        max: max - min,
        neutral: (max - min) / 2,
        min: 0,
    }
    obj.current = (number-min)
    return obj
}