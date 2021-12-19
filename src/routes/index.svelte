<script>
import { onMount } from 'svelte';

let input;
let inputText = '';
let buffer = [];

onMount(async() => {
	const storedBuffer = JSON.parse(
		localStorage.getItem('mystery-terminal-history')
	)
	
	buffer = storedBuffer != null ? storedBuffer : []; 
	input.focus();
})

let pwd = '/root';

function storeHistory() {
	localStorage.setItem('mystery-terminal-history', JSON.stringify(buffer));
}


const files = ['hello.txt', 'words.doc', 'foo.md', '.config'];

const filesystem = {
	'root' : {
		'.config': {
			'term.cfg' : null,
		}
	}
}

// User has the terminal open
// User finds out that someone ran a program which did something catastrophic
// Contact list
// ASCII art style output
// config file?
// text editing inside the faketerm
// Would require another buffer entirely, which could be a component that gets rendered inside the window
// maybe more esoteric names, where is this terminal from?

// All commands return an array of strings as the output
// As well, they can modify the state of the terminal
// Eventually commands can be a bit more expansive

const cmds = {
	ls : () => files.filter(f => !f.startsWith('.')), // list non-hidden files
	la: () => files, // list files including hidden
	pwd : () => {}, // find where you currently are
	touch: () => {}, // create file
	mkdir: () => {}, // make directory
	femto: () => {}, // text editor
	cd: () => {}, // change directory
	fzf: () => {}, // search
	help: () => Object.keys(cmds)
}

function evaluate(cmd) {
	return cmds[inputText]()
}


function keydown(e) {
	if (e.key === 'Enter') {
		e.preventDefault(); // prevents new lines from being drawn

		if (Object.keys(cmds).includes(inputText)) {
			buffer.push({
				input: inputText,
				output: evaluate(inputText)
			});

		} else {
			buffer.push({
				input: inputText,
				output: [`Unknown command: ${inputText}`]
			})
		}
		buffer = buffer; // Force reactivity with svelte
		storeHistory()
	}

	if (e.key === 'c' && e.ctrlKey) {
		buffer = [];
		input.innerText = '';
		storeHistory()
	}

	if (e.key === 'l' && e.ctrlKey) {
		buffer = [];
		storeHistory()
	}
}

function keyup(e) {
	if (e.key === 'Enter') {
		// Was what was typed a command
		input.innerHtml = '';
		input.innerText = '';
	}
}

function inputHandler(e) {
	inputText = input.innerText.trim()
}

</script>

<div class='terminal'>
	{#each buffer as hist}
	<div class="input-line">
		<div class='line-mark'>></div>
		<div class='input' spellcheck={ false }>{hist.input}</div>
	</div>

	<div class="output">
		{#each hist.output as output}
		<div>{output}</div>
		{/each}
	</div>
	{/each}

	<div class="input-line">
		<div class='line-mark'>></div>
		<div class='input' 
			contenteditable={ true } 
			spellcheck={ false }
			bind:this={ input }
			on:input={ inputHandler }
			on:keyup={ keyup }
			on:keydown={ keydown }
		/>
	</div>
</div>



<style>
	.terminal {
		color: rgb(13, 188, 0);
		font-size: 24px;
		display: flex;
		flex-direction: column;
	}

	.input-line {
		display: flex;
		flex-direction: row;
	}

	.line-mark {
		padding-right: 0.3em;
	}

	.input {
		width: 100vw
	}

	[contenteditable] {
		outline: 0px solid transparent;
	}


</style>