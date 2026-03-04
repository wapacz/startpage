/*
 *   Copyright (c) 2022 
 *   All rights reserved.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";
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
        firebaseService._setIsAuth = setIsAuth;
        firebaseService._isAuth = isAuth;
        return isAuth;
    },

    isAuth: () => firebaseService._isAuth,

    signIn: async () => {
        // if (!firebaseService.isAuth()) {
        const result = await signInWithPopup(auth, provider);
        console.log(result);
        localStorage.setItem("isAuth", true);
        firebaseService._setIsAuth(true);
        window.location.pathname = defaultUrl;
        return result;
        // }
    },

    signOut: async () => {
        await signOut(auth);
        localStorage.clear();
        firebaseService._setIsAuth(false);
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

    addLink: async (linkData) => {
        const ref = collection(db, "links");
        const docRef = await addDoc(ref, linkData);
        return { ...linkData, id: docRef.id };
    },

    updateLink: async (id, linkData) => {
        const ref = doc(db, "links", id);
        await updateDoc(ref, linkData);
    },

    deleteLink: async (id) => {
        const ref = doc(db, "links", id);
        await deleteDoc(ref);
    },

    // Folders CRUD
    addFolder: async (folderData) => {
        const ref = collection(db, "folders");
        const docRef = await addDoc(ref, folderData);
        return { ...folderData, id: docRef.id };
    },

    updateFolder: async (id, folderData) => {
        const ref = doc(db, "folders", id);
        await updateDoc(ref, folderData);
    },

    deleteFolder: async (id) => {
        const ref = doc(db, "folders", id);
        await deleteDoc(ref);
    },
};

export { firebaseService };