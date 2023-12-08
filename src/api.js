// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  getDocs,
  setDoc,
  doc,
  Timestamp,
  onSnapshot,
  deleteDoc,
  updateDoc,
  where,
  query,
  addDoc,
  getDoc,
} from "firebase/firestore";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { getFunctions, httpsCallable } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvuqO8efvwcRZoo1vL797JVEbdw-xFvso",
  authDomain: "warmi-muyu-c93a9.firebaseapp.com",
  projectId: "warmi-muyu-c93a9",
  storageBucket: "warmi-muyu-c93a9.appspot.com",
  messagingSenderId: "538299681670",
  appId: "1:538299681670:web:7fb2c44d600e997c6aba07",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get firestore db
const db = getFirestore(app);

// Get functions
const functions = getFunctions(app);

const createNewUser = httpsCallable(functions, "createNewUser");

// Get storage
const storage = getStorage(app);

// Get auth
const auth = getAuth(app);

// Reference to the items collection
const itemsCollectionRef = collection(db, "items");

// Functions

function capitalizeEachWord(str) {
  return str
    .split(" ")
    .map((el) => el.charAt(0).toUpperCase() + el.slice(1))
    .join(" ");
}

export async function signUp(user) {
  console.log("Callling the function...");
  const result = await createNewUser(user);
  return result.data;
}

export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential;
  } catch (err) {
    console.log(err.code);
    return err.code;
  }
}

export async function logOut() {
  try {
    await signOut(auth);
  } catch (err) {
    console.log(err.code);
  }
}

export function monitorAuth(setFunc) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const idTokenResult = await user.getIdTokenResult();
        setFunc({ ...user, admin: idTokenResult.claims.admin });
      } catch (error) {
        console.log(error);
      }
    } else {
      setFunc(null);
    }
  });
}

export function monitorElementCollection(collectionName, setFunc) {
  return onSnapshot(collection(db, collectionName), (snapshot) => {
    const changes = snapshot.docChanges();
    if (changes.length) {
      setFunc((prevFunc) => ({
        ...prevFunc,
        [collectionName]: snapshot.docs.map((doc) => {
          return collectionName === "models"
            ? doc.data().name.charAt(0).toUpperCase() + doc.data().name.slice(1)
            : capitalizeEachWord(doc.data().name);
        }),
      }));
    }
  });
}

export function addNewDocRef() {
  return doc(itemsCollectionRef);
}

export async function addNewItem(docRef, data) {
  try {
    await setDoc(docRef, {
      ...data,
      inputDate: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getLastItem(docRef, setFunc) {
  try {
    const lastItem = await getDoc(docRef);
    const data = lastItem.data();
    if (data) {
      const dataObj = {
        models: [data.model.charAt(0).toUpperCase() + data.model.slice(1)],
        types: [capitalizeEachWord(data.type)],
        artisans: [capitalizeEachWord(data.artisan)],
        length: data.length,
        width: data.width,
        colors: data.colors.map((color) => capitalizeEachWord(color)),
        matPrice: data.matPrice,
        hours: data.hours,
        price: data.price,
        conditions: [capitalizeEachWord(data.condition)],
        states: [capitalizeEachWord(data.state)],
        location: data.location,
        observations: data.observations,
        imageURL: data.imageURL,
      };
      setFunc({
        docData: dataObj,
        docRef: docRef,
      });
    } else {
      setFunc({});
    }
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file, type, id) {
  const storageRef = ref(storage, "images/" + id);
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: type,
  });

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload progress: " + progress + "%");
    },
    (error) => {
      console.log("Error: " + error.code);
    }
  );
  await uploadTask;
  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  return downloadURL;
}

/* export function monitorItem(docRef, setFunc) {
  return onSnapshot(docRef, (doc) => {
    const data = doc.data();
    if (data) {
      const dataObj = {
        models: [data.model.charAt(0).toUpperCase() + data.model.slice(1)],
        types: [capitalizeEachWord(data.type)],
        artisans: [capitalizeEachWord(data.artisan)],
        length: data.length,
        width: data.width,
        colors: data.colors.map((color) => capitalizeEachWord(color)),
        matPrice: data.matPrice,
        hours: data.hours,
        price: data.price,
        conditions: [capitalizeEachWord(data.condition)],
        states: [capitalizeEachWord(data.state)],
        location: data.location,
        observations: data.observations,
        imageURL: data.imageURL,
      };

      setFunc(dataObj);
    } else setFunc({});
  });
} */

export function monitorItemsCollection(setFunc) {
  return onSnapshot(itemsCollectionRef, (snapshot) => {
    const changes = snapshot.docChanges();

    if (changes.length === 1 && changes[0].type === "removed") {
      setFunc((prevFunc) => {
        return prevFunc.filter(
          (obj) => obj.docRef.id !== changes[0].doc.ref.id
        );
      });
    } else if (changes.length === 1 && changes[0].type === "modified") {
      const data = changes[0].doc.data();
      if (data) {
        const dataObj = {
          models: [data.model.charAt(0).toUpperCase() + data.model.slice(1)],
          types: [capitalizeEachWord(data.type)],
          artisans: [capitalizeEachWord(data.artisan)],
          length: data.length,
          width: data.width,
          colors: data.colors.map((color) => capitalizeEachWord(color)),
          matPrice: data.matPrice,
          hours: data.hours,
          price: data.price,
          conditions: [capitalizeEachWord(data.condition)],
          states: [capitalizeEachWord(data.state)],
          location: data.location,
          observations: data.observations,
          imageURL: data.imageURL,
        };

        setFunc((prevFunc) => {
          const newFunc = [...prevFunc];
          const objToUpdateIndex = prevFunc.findIndex(
            (obj) => obj.docRef.id === changes[0].doc.ref.id
          );
          newFunc[objToUpdateIndex] = {
            ...prevFunc[objToUpdateIndex],
            docData: dataObj,
          };
          return newFunc;
        });
      }
    }
  });
}

export async function removeItem(docRef, imageURL, setFunc) {
  console.log(docRef.id, setFunc);
  if (imageURL) {
    const storageRef = ref(storage, "images/" + docRef.id);
    try {
      await deleteObject(storageRef);
    } catch (error) {
      console.log(error);
    }
  }
  await deleteDoc(docRef);

  if (setFunc) setFunc({});
}

export async function updateItem(docRef, data) {
  try {
    await updateDoc(docRef, {
      ...data,
      updateDate: Timestamp.fromDate(new Date()),
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function isNewElement(elementType, value) {
  if (value) {
    const snapshot = await getDocs(
      query(collection(db, elementType), where("name", "==", value))
    );
    return snapshot.empty;
  }

  return false;
}

export async function addElement(elementType, value) {
  try {
    return await addDoc(collection(db, elementType), { name: value });
  } catch (err) {
    console.log(err);
  }
  return false;
}

export async function retrieveItems(searchParams) {
  const promises = searchParams.map((arr) => {
    if (arr[0] === "colors")
      return getDocs(
        query(itemsCollectionRef, where(arr[0], "array-contains-any", arr[1]))
      );
    return getDocs(query(itemsCollectionRef, where(arr[0], "in", arr[1])));
  });

  try {
    const snapshots = await Promise.all(promises);

    const docsList = snapshots.map((snapshot) =>
      snapshot.docs.map((document) => {
        const data = document.data();
        const docObj = {
          docRef: doc(itemsCollectionRef, document.id),
          docData: {
            models: [data.model.charAt(0).toUpperCase() + data.model.slice(1)],
            types: [capitalizeEachWord(data.type)],
            artisans: [capitalizeEachWord(data.artisan)],
            length: data.length,
            width: data.width,
            colors: data.colors.map((color) => capitalizeEachWord(color)),
            matPrice: data.matPrice,
            hours: data.hours,
            price: data.price,
            conditions: [capitalizeEachWord(data.condition)],
            states: [capitalizeEachWord(data.state)],
            location: data.location,
            observations: data.observations,
            imageURL: data.imageURL,
          },
        };
        return docObj;
      })
    );

    const uniqueItems =
      docsList.length > 1
        ? [...docsList]
            .sort((a, b) => a.length - b.length)
            .shift()
            .filter((el) =>
              docsList.every((arr) =>
                arr.some((obj) => obj.docRef.id === el.docRef.id)
              )
            )
        : [...docsList].shift();

    return uniqueItems;
  } catch (err) {
    console.log(err);
  }
}
