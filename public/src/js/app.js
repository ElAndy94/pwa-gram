let deferredPrompt;
let enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

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

displayConfirmNotification = () => {
    if ('serviceWorker' in navigator) {
        const options = {
            body: 'You successfully subscribed to our Notification Service',
            icon: '/src/images/icons/app-icon-96x96.png',
            image: '/src/images/sf-boat.jpg',
            dir: 'ltr',
            lang: 'en-US', // Must be BCP 47
            vibrate: [100, 50, 200],
            badge: '/src/images/icons/app-icon-96x96.png',
            tag: 'confirm-notification',
            renotify: true,
            actions: [
                { actions: 'confirm', title: 'Okay', icon: '/src/images/icons/app-icon-96x96.png' },
                { actions: 'cancel', title: 'Cancel', icon: '/src/images/icons/app-icon-96x96.png' }
            ]
        };

        navigator.serviceWorker.ready
            .then((swreg) => {
                swreg.showNotification('Successfully subscribed! (from SW)', options);
            });
    }
}

askForNotificationPermission = () => {
    Notification.requestPermission((result) => {
        console.log('User Choice', result);
        if (result !== 'granted') {
            console.log('No notification permission granted!');
        } else {

        }
    });
}

if ('Notification' in window) {
    for (let i = 0; i < enableNotificationsButtons.length; i++) {
        enableNotificationsButtons[i].style.display = 'inline-block';
        enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
    }
}