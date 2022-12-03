import { MODULE, MODULE_DIR } from "./const.js"; //import the const variables
import { registerSettings, cacheSettings, debug, ftw, ftwConfig } from "./settings.js"; //import settings
import { convertValues, notValidString, removeSpaces, repNames } from "./util.js"
import { FDialog } from "./dialog.js"

// Hook that trigger once when the game is initiated. Register and cache settings.
Hooks.once("init", () => {
    registerSettings();
    cacheSettings();
});

Hooks.once('ready', async function () {
    console.log(" ============================ Faction Tracker Widget ============================ ")
    FTW.toggleAppVis()
});

// This add the control buttons so GM can control 'clear weather effects' or 'apply weather effects'
Hooks.on("getSceneControlButtons", (controls, b, c) => {
    controls
        .find((c) => c.name == "token"/* "notes" */)
        .tools.push({
            name: "toggle-FTW",
            title: "Toggle FTW",
            icon: "fa-solid fa-ring",
            button: true,
            visible: game.user.isGM,
            onClick: () => {
                FTW.toggleAppVis()
            },
        });
});

export class FTW extends FormApplication {
    static _isOpen = true;

    constructor() {
        super();
    }

    async _render(force = false, options = {}) {
        await super._render(force, options);
        FTW._isOpen = true;
    }

    async _updateObject(ev, formData) {
        // console.log(formData)
        this.currentConfig = formData
    }

    static get defaultOptions() {
        this.initialPosition = {
            top: (screen.availHeight - 489) / 4,
            left: (screen.availWidth - 516) / 4
        }
        return mergeObject(super.defaultOptions, {
            classes: ['form'],
            popOut: true,
            submitOnChange: true,
            closeOnSubmit: false,
            minimizable: false,
            template: `${MODULE_DIR}/templates/FTW.html`,
            id: 'ftw',
            title: 'Faction Tracker Widget',
            top: this.initialPosition.top,
            left: this.initialPosition.left,
            heigh: "auto",
        });
    }

    activateListeners(html) {
        super.activateListeners(html);
        let app = ui.activeWindow
        if (!game.modules.get(MODULE).FTW) game.modules.get(MODULE).FTW = app

        Section.renderSections(ftw)
        // $('#ftw-sections').append(sections)
        // let factions = Faction.renderFactions(ftw)


        html.find('button[title="Add Faction"]').on('click', async function (event) {
            let section = event.currentTarget.attributes["data-section"].value
            Faction.addFactionDialog(true, section)
        })
        html.find('button[title="Remove Faction"]').on('click', async function (event) {
            let section = event.currentTarget.attributes["data-section"].value
            Faction.addFactionDialog(false, section)
        })

        html.find('#add-section').on('click', async function (event) {
            Section.addSectionDialog(true)
        })
        html.find('#rm-section').on('click', async function (event) {
            Section.addSectionDialog(false)
        })

        html.find('button[title="Decrease Reputation"]').on('click', async function (event) {
            let secFac = event.currentTarget.id.split(".")
            let index = ftw.findIndex(i => i.class === secFac[0])
            let fIndex = ftw[index].factions.findIndex(i => i.id === secFac[1])
            let newRep = Math.floor(ftw[index].factions[fIndex].reputation) - 1
            if (newRep >= ftwConfig.rep.min) ftw[index].factions[fIndex].reputation = newRep
            else return
            await game.settings.set(MODULE, 'ftw', ftw)
            cacheSettings()
            FTW.toggleAppVis()
        })
        html.find('button[title="Increase Reputation"]').on('click', async function (event) {
            let secFac = event.currentTarget.id.split(".")
            let index = ftw.findIndex(i => i.class === secFac[0])
            let fIndex = ftw[index].factions.findIndex(i => i.id === secFac[1])
            let newRep = Math.floor(ftw[index].factions[fIndex].reputation) + 1
            if (newRep <= ftwConfig.rep.max) ftw[index].factions[fIndex].reputation = newRep
            else return
            await game.settings.set(MODULE, 'ftw', ftw)
            cacheSettings()
            FTW.toggleAppVis()
        })
    }

    getData() { // Send values to the HTML template.
        return {
            ftw,
            ftwConfig
        }
    }

    // Toggle visibility of the main window.
    static async toggleAppVis() {
        game.modules.get(MODULE).FTW = await new FTW().render(true)
    }
}

class Section {
    constructor({ sectionName } = {}) {
        this.name = sectionName
        this.class = removeSpaces(sectionName)
        this.factions = []
    }

    static async addSection({ add, sectionName } = {}) {
        if (add) {
            let section = new Section({ sectionName })
            ftw.push(section)
            await game.settings.set(MODULE, 'ftw', ftw)
            cacheSettings();
            console.warn(ftw)
            return [section]
        }
        else {
            let index = ftw.findIndex(i => i.name === sectionName)
            console.warn("index", index)
            if (index === -1) return false;
            ftw.splice(index, 1);
            await game.settings.set(MODULE, 'ftw', ftw)
            cacheSettings();
            console.warn(ftw)
            return 'removed'
        }
    }

    static addSectionDialog(add) {
        let contentNotes, title, input;
        if (add) {
            title = "Add Section to the Tracker"
            input = `<input type="text" name="section" value="" data-dtype="String"></input>`
            contentNotes = `<p class="notes">Name of section you would like to add.</p>`
        }
        else {
            title = "Remove Section from the Tracker"
            input = `<select id="section-option">`
            ftw.forEach((section, index) => {
                input += '<option value="' + section.name + '">' + section.name + '</option>';
            })
            input += `</select>`
            contentNotes = '<p class="notes">Name of the section you would like to remove.</p>'
        }
        let content =
            `<div class="form-group">
                <label>Section Name:</label>
                <div class="form-fields">
                    ${input}
                </div>
                ${contentNotes}
            </div>`
        new FDialog({
            title,
            content,
            buttons: {
                save: {
                    icon: '<i class="fas fa-save"></i>',
                    label: "Save",
                    callback: async () => {
                        let sectionName
                        if (add) sectionName = $('input[name="section"]')[0].value
                        else sectionName = $('#section-option').find(":selected").val()
                        if (!sectionName) return notValidString()
                        let secArray = await this.addSection({ add, sectionName })
                        if (secArray === 'removed') FTW.toggleAppVis()
                        else if (!secArray) notValidString()
                        else {
                            let section = this.renderSections(secArray)
                            $('#ftw-sections').append(section)
                            FTW.toggleAppVis()
                        }
                        game.modules.get(MODULE).FTW.setPosition({ height: "auto" });
                    }
                },
                cancel: {
                    icon: "<i class='fas fa-times'></i>",
                    label: "Cancel",
                    callback: async () => {
                        return
                    }
                },
            },
        }).render(true)
    }

    static renderSections(secArray, open = false) {
        let sections = ''
        let factions = ''
        secArray.forEach((section, index) => {
            sections = `<div id="${section.class}" class="section">
                            <div class="ftw-section">
                                <button id="rm-faction" data-section="${section.class}" title="Remove Faction"><i class="fa-solid fa-user-minus"></i></button>
                                <h1>${section.name}</h1>
                                <button id="add-faction" data-section="${section.class}" title="Add Faction"><i class="fa-solid fa-user-plus"></i></button>
                            </div>
                        </div>`

            $('#ftw-sections').append(sections)

            if (section.factions.length > 0) {
                factions = Faction.renderFactions(section.factions)
                // console.warn(faction)
                $(`div[id="${section.class}"]`).append(factions)
            }
        });
        if (!open) return sections/* obj = { sections: sections, factions: factions} */
    }
}

class Faction {
    constructor({ factionName, repValue, section } = {}) {
        this.name = factionName
        this.reputation = repValue
        this.id = removeSpaces(factionName)
        this.section = section
    }

    static addFactionDialog(add, section) {
        let contentNotes, title, input;
        if (add) {
            title = "Add Faction to the Tracker"
            input = '<input type="text" name="faction" value="" data-dtype="String">'
            contentNotes = `<p class="notes">Name of faction you would like to add.</p>
                                <div class="form-group">
                                <label>Current Reputation</label>
                                <div class="form-fields">
                                    <input type="range" name="current-rep" data-dtype="Number" value=${ftwConfig.rep.neutral} min=${ftwConfig.rep.min} max=${ftwConfig.rep.max}
                                        step="1">
                                    <span class="range-value">${ftwConfig.rep.neutral}</span>
                                </div>
                                <p class="notes">Defines the current reputation value.</p>
                            </div>`
        }
        else {
            title = "Remove Faction from the Tracker"
            input = `<select id="faction-option">`
            let index = ftw.findIndex(i => i.class === section)
            ftw[index].factions.forEach((faction, index) => {
                input += '<option value="' + faction.name + '">' + faction.name + '</option>';
            })
            input += `</select>`
            contentNotes = '<p class="notes">Name of the faction you would like to remove.</p>'
        }
        let content = `<div class="form-group">
                            <label>Faction Name:</label>
                            <div class="form-fields">
                                ${input}
                            </div>
                            ${contentNotes}
                        </div>`
        new FDialog({
            title,
            content,
            buttons: {
                save: {
                    icon: '<i class="fas fa-save"></i>',
                    label: "Save",
                    callback: async () => {
                        let repValue = 0, factionName;
                        if (add) factionName = $('input[name="faction"]')[0].value
                        else factionName = $('#faction-option').find(":selected").val()
                        if (add) repValue = $('input[name="current-rep"]')[0].value
                        if (!factionName) return notValidString()
                        let facArray = await this.addFaction({ add, factionName, repValue, section })
                        if (facArray === 'removed') FTW.toggleAppVis()
                        else if (!facArray) notValidString()
                        else {
                            let faction = this.renderFactions(facArray)
                            $('#' + section).append(faction)
                            // FTW.toggleAppVis()
                        }
                        game.modules.get(MODULE).FTW.setPosition({ height: "auto" });
                    }
                },
                cancel: {
                    icon: "<i class='fas fa-times'></i>",
                    label: "Cancel",
                    callback: async () => {
                        return
                    }
                },
            },
            default: "content",
        }).render(true)
    }

    static async addFaction({ add, section, factionName, repValue } = {}) {
        let faction = []
        let index = ftw.findIndex(i => i.class === section)


        if (add) {
            faction = new Faction({ factionName, repValue, section })
            ftw[index].factions.push(faction)
        }
        else {
            let fIndex = ftw[index].factions.findIndex(i => i.name === factionName)
            if (fIndex === -1) return false;
            ftw[index].factions.splice(fIndex, 1)
        }

        await game.settings.set(MODULE, 'ftw', ftw)
        cacheSettings()
        console.warn(ftw)

        if (add) return [faction]
        else return 'removed'
    }

    static renderFactions(facArray) {
        let factions = ''
        facArray.forEach((faction, index) => {
            factions += `<div class="ftw-faction">
                            <label for="rep">${faction.name}</label>
                            <div>
                                <button id="${faction.section}.${faction.id}" type="button" class="rep-button" title="Decrease Reputation">
                                    <i class="fa-solid fa-minus"></i>
                                </button>
                                <progress id="rep" max="${(convertValues().max)}" value="${convertValues(faction.reputation).current}"> ${convertValues(faction.reputation).current} </progress>
                                <button id="${faction.section}.${faction.id}" class="rep-button" type="button" title="Increase Reputation">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                                <span>${repNames(faction.reputation)} (${faction.reputation})</span>
                            </div>
                        </div>`
        });
        return factions
    }
}