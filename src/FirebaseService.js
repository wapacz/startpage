/*
 *   Copyright (c) 2022 
 *   All rights reserved.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useState } from 'react';
import { firebaseConfig, defaultUrl } from "./config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const collectionRefs = {};

const firebaseService = {

    useState: () => {
        const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
        firebaseService.setIsAuth = setIsAuth;
        return isAuth;
    },

    isAuth: () => localStorage.getItem("isAuth"),

    signIn: async () => {
        // if (!firebaseService.isAuth()) {
        const result = await signInWithPopup(auth, provider);
        console.log(result);
        localStorage.setItem("isAuth", true);
        firebaseService.setIsAuth(true);
        window.location.pathname = defaultUrl;
        return result;
        // }
    },

    signOut: async () => {
        await signOut(auth);
        localStorage.clear();
        firebaseService.setIsAuth(false);
        window.location.pathname = defaultUrl;
    },

    getDocs: async (collectionName) => {
        const ref = collectionRefs[collectionName]
            || (collectionRefs[collectionName] = collection(db, collectionName));
        const data = await getDocs(ref);
        return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    },

    deletePost: async (collectionName, id) => {
        const ref = doc(db, collectionName, id);
        await deleteDoc(ref);
    },
};

export { firebaseService };