<script>
    import { onMount } from 'svelte';
    import { state, storeState } from '$lib/app';
    import { cd } from '$lib/cmds';
    
    let input;
    let inputText = '';
    
    $state.pwd = '/root'
    $: console.log($state)
    
    onMount(async() => { input.focus() });

    export const cmds = {
        cat: () => {}, // shit out a file
        // ls : () => files.filter(f => !f.startsWith('.')), // list non-hidden files
        // la: () => files, // list files including hidden,
        argos: () => {},// program for watching
        pwd : () => {}, // find where you currently are
        touch: () => {}, // create file
        mkdir: () => {}, // make directory
        femto: () => {}, // text editor
        cd: () => { return cd(inputText, $state.fs) },
        fzf: () => {}, // search
        help: () => Object.keys(cmds),
        heimdall: () => {}
    }
    
    // User has the terminal open
    // User finds out that someone ran a program which did something catastrophic
    // Contact list
    // ASCII art style output
    // config file?
    // text editing inside the faketerm
    // Would require another buffer entirely, which could be a component that gets rendered inside the window
    // maybe more esoteric names, where is this terminal from?
    // You get hacked at one point...?
    // Monitoring a subsystem
    // You're trying to figure out what happened to a system?? There should be diagnostics views...
    // In which case having separated buffers into component would be ideal
    // Downloading files, or pinging other servers

    // All commands return an array of strings as the output
    // As well, they can modify the state of the terminal
    // Eventually commands can be a bit more expansive
    
    function evaluate(cmd) {
        console.log(cmd)
        return cmds[cmd]()
    }
    
    function keydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // prevents new lines from being drawn
            const cmd = inputText.split(' ')[0];
            if (Object.keys(cmds).includes(cmd)) {
                $state.buffer.push({
                    pwd: $state.pwd,
                    input: inputText,
                    output: evaluate(cmd)
                });
    
            } else {
                $state.buffer.push({
                    pwd: $state.pwd,
                    input: inputText,
                    output: [`Unknown command: ${inputText}`],
                })
            }
            storeState();
        }
    
        if (e.key === 'c' && e.ctrlKey) {
            $state.buffer = [];
            input.innerText = '';
            storeState();
        }
    
        if (e.key === 'l' && e.ctrlKey) {
            $state.buffer = [];
            storeState();
        }
        $state.buffer = $state.buffer; // Force reactivity with svelte
    }
    
    function keyup(e) {
        if (e.key === 'Enter') { // Was what was typed a command?
            input.innerHtml = '';
            input.innerText = '';
        }
    }
    
    function inputHandler(e) {
        inputText = input.innerText.trim()
    }
    
</script>
    
<svelte:window on:click={ ()=> input.focus() } />

<div class='terminal'>
    <div class="history current">
        {#each $state.buffer as hist}
        <div class="pwd">{hist.pwd}</div>
        <div class="input-line">
            <div class='line-mark'>></div>
            <div class='input' spellcheck={ false }>{hist.input}</div>
        </div>
        
        <div class="output">
            {#each hist.output as output}
            <div>{output}</div>
            {/each}
        </div>
        <br>
        {/each}
        
    </div>
    <div class="current">
        <div class="pwd">{$state.pwd}</div>
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