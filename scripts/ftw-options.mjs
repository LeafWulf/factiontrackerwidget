// GET REQUIRED LIBRARIES
import { VueApplication } from './lib/fvtt-petite-vue.mjs';

// GET MODULE CORE
import { MODULE } from './const.js';

class FTW extends VueApplication {
    constructor(data) {
		super(data);

		this.data = data;
    }

	static get defaultOptions() {
      	return mergeObject(
			super.defaultOptions, {
			title: MODULE.TITLE,
			id: `${MODULE.ID}-dialog-ftw`,
			classes: [],
			template: `modules/${MODULE.ID}/templates/ftw.vue`,
			width: window.innerWidth > 500 ? 500 : window.innerWidth - 300,
			height: window.innerHeight > 700 ? 700 : window.innerHeight - 100
		});
    }

	getData(options={}) {
		const data = [{
			id: randomID(),
			title: 'Section 1',
			min: -10, max: 10, default: 0, step: 1,
			labels: [
				{
					condition: '${value} <= -5',
					label: 'Enemy'
				}, {
					condition: '${value} >= 5',
					label: 'Friend'
				}, {
					condition: '${value} > -5 && ${value} < 5',
					label: 'Neutral'
				}
			],
			factions: [
				{
					id: randomID(),
					title: 'Faction 1',
				}, {
					id: randomID(),
					title: 'Solider 1 Rank',
					min: 1, max: 3, default: 1,
					labels: [
						{
							condition: '${value} == 1',
							label: 'recrute'
						},
						{
							condition: '${value} == 2',
							label: 'soldier'
						},
						{
							condition: '${value} == 3',
							label: 'sargent'
						}
					]
				}
			]
		}];

		return {
			sections: data,
			factions: data[0].factions,
			selectedDetails: data[0].factions[0],

			selectedRanges: {
				default: data[0]?.factions[0]?.default ?? data[0].default,
				min: data[0]?.factions[0]?.min ?? data[0].min,
				max: data[0]?.factions[0]?.max ?? data[0].max,
				step: data[0]?.factions[0]?.step ?? data[0].step
			}, 

			selectedLabels: data[0]?.factions[0]?.labels ?? data[0]?.labels ?? [],

			addLabel: this._addLabel,
			updatePreview: this._updatePreview,
			onClickPreview: this._modifyPreview,
			onRangeChange: this._onRangeChange
		}
	}

	_addLabel = (event) => {
		event.preventDefault();
		
		this._vue.store.selectedLabels.push({
			label: 'New Label',
			condition: '${value} == false'
		});
	}

	_updatePreview = (event) => {
		const elem = event.target.closest('form');
		const input = elem.querySelector('section.preview input[type="range"]');
		
		input.dispatchEvent(new Event('change', { 'bubbles': true }));
	}

	_onRangeChange = (event) => {
		if (!(event.target.closest('input[type="range"]'))) return;
		const elem = event.target.closest('.form-group');
		const value = event.target.value;

		let label = this._vue.store.selectedLabels.find(searchLabel => eval((searchLabel?.condition ?? '').replaceAll('${value}', value)));

		MODULE.log(label, this._vue.store.selectedLabels)
		elem.querySelector('p.notes').innerHTML = `${label?.label ?? 'UNKNOWN CONDITION'} (${value})`
	}

	_modifyPreview = (event) => {
		event.preventDefault();
		if (!(event.target.closest('button[data-adjust]'))) return;
		
		// Get Elements
		const button = event.target.closest('button');
		const elem = button.closest('.faction');
		const input = elem.querySelector('input[type="range"]');
		const value = parseInt(button.dataset.adjust);

		input.value = parseInt(input.value) + value;
		input.dispatchEvent(new Event('change', { 'bubbles': true }));
	}

	activateListeners(html) {
		
	}
}

// DEFINE MODULE CLASS
export default class CORE {

	static installAPI = () => {

	}

	static init = () => {
		this.installAPI();

		//new DunGenDialog({}).render(true);
		new FTW({}).render(true);
	}
}