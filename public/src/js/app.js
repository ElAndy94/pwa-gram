let deferredPrompt;

if (!window.Promise) {
    window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
            .then(() => {
                console.log('Service Worker Registerd!');
            })
            .catch((err) => {
                console.log(err);
            });
}

window.addEventListener('beforeinstallprompt', (event) => {
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});


fetch('https://httpbin.org/ip')
    .then((res) => {
        console.log(res);
        return res.json();
    })
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    })

fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify({message: 'Does this work?'})
})
    .then((res) => {
        console.log(res);
        return res.json();
    })
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    })

// let promise = new Promise((resolve, reject) => {
//     setTimeout()
// });

// promise.then((text) => {

// })