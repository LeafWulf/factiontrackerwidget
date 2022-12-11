<form>
	<style>
		.preview {
			background-color: rgba(0 0 0 / 10%);
			border: 1px solid var(--color-border-light-primary);
			border-radius: 3px;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			padding: 0.5rem;
		}
		.faction {
			background: rgba(255, 255, 240, 0.8);
			border-radius: 3px;
			display: flex;
			gap: 0.5rem;
		}
		.faction * {
			flex: 1;
		}
		.faction button {
			border-radius: 0px;
			border-width: 0px;
			flex: 0;
		}
		.faction button:first-child {
			border-radius: 3px 0px 0px 3px;
		}
		.faction button:last-child {
			border-radius: 3px 0px 0px 3px;
		}

		.faction .form-group {
			display: flex;
			flex-direction: column;
		}
		.faction .form-group label {
			font-weight: bold;
			font-size: 1.15rem;
			padding-top: 0.5rem;
			text-align: center;
		}
		.faction .form-group p.notes {
			flex: 1;
			font-size: 0.75rem;
			margin: 0px;
			text-align: center;
		}
		.faction input[type="range"] { 
			margin: auto;
			-webkit-appearance: none;
			position: relative;
			overflow: hidden;
			height: 20px;
			width: 100%;
			cursor: pointer;
			border-radius: 3px;
			border-width:0px
		}

		.faction input[type="range"]::-webkit-slider-runnable-track {
			background: rgba(0, 0, 0, 0.1);
			border-radius: 0px;
			border-width: 0px;
			box-shadow: none;
			height: auto;
			overflow: hidden;
		}

		.faction input[type="range"]::-webkit-slider-thumb {
			-webkit-appearance: none;
			width: 20px; 
			height: 20px;
			background: var(--color-text-hyperlink);
			box-shadow: -100vw 0 0 100vw var(--color-text-hyperlink);
			border-width: 0px;
		}


		.faction-group header button i,
		.faction button i {
			margin-right: 0px;
		}
	</style>

	<div class="form-group">
		<label>Choose a Section</label>
		<div class="form-fields">
			<select name="core.language" data-dtype="String">
				<option v-for="section of store.sections">{{section.title}}</option>
			</select>
		</div>
		<p class="notes">Sections are groups of Factions, e.g Guilds in a Town.</p>
	</div>

	<div class="form-group">
		<label>Choose a Faction</label>
		<div class="form-fields">
			<select name="core.language" data-dtype="String">
				<option value="none">Edit Section Defaults</option>
				<option v-for="faction of store.factions" :value="faction.id">{{faction.title}}</option>
			</select>
		</div>
		<p class="notes">This is the faction you'd like to update</p>
	</div>

	<hr />

	<section class="preview">
		<div class="faction">
			<button @click="store.onClickPreview" data-adjust="-1"><i class="fa-solid fa-minus"></i></button>
			<div class="form-group">
				<label>Preview Slider</label>
				<input type="range" @input="store.onRangeChange" @change="store.onRangeChange" :value="store.selectedRanges.default" :min="store.selectedRanges.min" :max="store.selectedRanges.max" :step="store.selectedRanges.step">
				<p class="notes">---</p>
			</div>
			<button @click="store.onClickPreview" data-adjust="1"><i class="fa-solid fa-plus"></i></button>
		</div>
	</section>

	<hr/>

	<div class="form-group">
		<label>Minimum Value for Affliation</label>
		<div class="form-fields">
			<input type="number" v-model="store.selectedRanges.min" :value="store.selectedRanges.min" :max="store.selectedRanges.max">
		</div>
		<p class="notes">The lowest value to be used with this affliation.</p>
	</div>

	<div class="form-group">
		<label>Maximum Value for Affliation</label>
		<div class="form-fields">
			<input type="number" v-model="store.selectedRanges.max" :value="store.selectedRanges.max" :min="store.selectedRanges.min">
		</div>
		<p class="notes">The Heights value to be used with this affliation.</p>
	</div>

	<div class="form-group">
		<label>Default Value for Affliation</label>
		<div class="form-fields">
			<input type="number" v-model="store.selectedRanges.default" :value="store.selectedRanges.default" :min="store.selectedRanges.min" :max="store.selectedRanges.max">
		</div>
		<p class="notes">The value used as the default value when a new faction is created.</p>
	</div>

	<hr/>
	<section class="label-group" v-for="label in store.selectedLabels" style="margin-bottom: 1rem;">
		<div class="form-group">
			<label>Display Label</label>
			<div class="form-fields">
				<input type="text" v-model="label.label" :value="label.label" @change="store.updatePreview">
			</div>
		</div>
		<div class="form-group">
			<label>Label Condition</label>
			<div class="form-fields">
				<input type="text" v-model="label.condition" :value="label.condition" @change="store.updatePreview">
			</div>
		</div>
	</section>
	
	<hr/>

	<div class="form-group">
		<button @click="store.addLabel">Add Label</button>
	</div>
</form>