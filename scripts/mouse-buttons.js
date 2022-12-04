// Handle Button Clicks
const buttonClick = (event) => {
	if (!(event.target.closest('button[data-adjust]'))) return;
	const button = event.target.closest('button');
	const elem = button.closest('.faction');
	const input = elem.querySelector('input[type="range"]');
	const value = parseInt(button.dataset.adjust);
	
	console.log(input.value, button.dataset.adjust, value);
	input.value = parseInt(input.value) + value;
	input.dispatchEvent(new Event('change', { 'bubbles': true }));
}

document.body.addEventListener('click', buttonClick);


// Handle Range Events
const updateRange = (event) => {
	if (!(event.target.closest('input[type="range"]'))) return;
	const elem = event.target.closest('.form-group');
	const value = event.target.value;
	let labelType = 'Neutral';
	
	if (value <= -5) labelType = "Enemy";
	else if (value >= 5) labelType = "Friend";
	
	elem.querySelector('p.notes').innerHTML = `${labelType} (${value})`;
}

document.body.addEventListener('change', updateRange);
document.body.addEventListener('input', updateRange);

document.querySelectorAll('.window-app input[type="range"]').forEach(elem => {
	elem.dispatchEvent(new Event('change', { 'bubbles': true }));
})