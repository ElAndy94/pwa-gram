let deferredPrompt;
let enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
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
        swreg.showNotification('Successfully subscribed!', options);
      });
  }
}

configurePushSub = () => {
  if (!('serviceWorker' in navigator)) {
    return;
  } 

  let reg;

  navigator.serviceWorker.ready
    .then((swreg) => {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then((sub) => {
      if (sub === null) {
        let vapidPublicKey = 'BFHlHeAmKo7yxJ3N9PhMZe0DjW3BTTbM9ccxNbF_EQjwvJDAvyBSwqMhn-j3WjnWZsr9BBClbwH0BPNHgfS0LsI';
        let convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);

        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey
        });
      } else {
        // We have a subscription
      }
    })
    .then((newSub) => {
      return fetch('https://pwagram-684eb.firebaseio.com/subscriptions.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newSub)
      })
    })
    .then((res) => {
      if (res.ok) {
        displayConfirmNotification();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

askForNotificationPermission = () => {
  Notification.requestPermission((result) => {
    console.log('User Choice', result);
    if (result !== 'granted') {
      console.log('No notification permission granted!');
    } else {
      configurePushSub();
    }
  });
}

if ('Notification' in window && 'serviceWorker' in navigator) {
  for (let i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
}