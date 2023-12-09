import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCDb9Dj5UbMk80uATaDo2461_lxX-OFNf8",
    authDomain: "banking-app-b30cb.firebaseapp.com",
    projectId: "banking-app-b30cb",
    storageBucket: "banking-app-b30cb.appspot.com",
    messagingSenderId: "118941066027",
    appId: "1:118941066027:web:da157d18e40c6d49699b6e",
};

const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp);

export { storage };