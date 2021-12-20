import { state } from '$lib/app';
import { get } from 'svelte/store';

export const commandParser = (cmd) => {
    return cmd.split(' ');
}

export const cd = (cmd, filesystem) => {
    const split = cmd.split(' ');
    const target = split[1];
    const tempState = get(state);
    tempState.pwd = target;
    state.set(tempState);
    const parse = commandParser(cmd);

    return [];
    
    // parse the input
    // see if the target exists in the filesystem
    
}

export const heimdall = () => {

} 
