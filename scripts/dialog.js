

export class FDialog extends Dialog {

    activateListeners(html) {
        super.activateListeners(html);
        if (this.options.activateAdditionalListeners !== undefined) {
            this.options.activateAdditionalListeners(html, this);
        }
        // else alert('activate listeners')
        html.on("change", "input,select,textarea", this._onChangeInput.bind(this));

    }

    async _onChangeInput(event) {
        // Do not fire change listeners for form inputs inside text editors.
        if (event.currentTarget.closest(".editor")) return;

        // Handle changes to specific input types
        const el = event.target;
        if ((el.type === "color") && el.dataset.edit) this._onChangeColorPicker(event);
        else if (el.type === "range") this._onChangeRange(event);

        // Maybe submit the form
        if (this.options.submitOnChange) {
            return this._onSubmit(event);
        }
    }

    _onChangeRange(event) {
        console.warn(event)
        const field = event.target.parentElement.querySelector(".range-value");
        if (field) {
            if (field.tagName === "INPUT") field.value = event.target.value;
            else field.innerHTML = event.target.value;
        }
    }

}