const ipc = require('electron').ipcRenderer


document.getElementById('btn').addEventListener('click', ()=>{
    ipc.send('show-update', 'prajwal')
})

ipc.on('res', (event, arg)=>{
    console.log(arg)
})

ipc.on('check-update', (event, arg)=>{
    console.log(arg)
})

ipc.on('update-available-not', (event, arg)=>{
console.log(arg)
})

ipc.on('update-available', (event, arg)=>{
    console.log(arg)
})

ipc.on('update-error', (event, arg)=>{
    console.log(arg)
})

ipc.on('update-download-progress', (event, arg)=>{
    console.log(arg)
})

ipc.on('update-download-done', (event, arg)=>{
    console.log(arg)
})





