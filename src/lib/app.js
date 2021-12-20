import { writable, get } from 'svelte/store';

// function loadState() {
//     const state = localStorage.getItem('hunter-terminal');
//     if (!state) {

//     } else {

//     }
// }

export const state = writable({
    pwd: '/root',
    fs: {
        'root' : {
            '.config': {
                'conch.cfg' : {
                    contents: 'config', // null will eventually be a string for the file
                    write: true
                }
            },
            'hello.txt' : {
                contents: 'hello there and welcome',
                write: false
            }
        }
    },
    history : [],
    buffer : []
})

export const storeState = () => {
    localStorage.setItem('hunter-terminal', JSON.stringify(get(state)))
}