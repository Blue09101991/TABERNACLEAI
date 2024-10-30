import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirestore, collection, doc, setDoc, getDocs, getDoc, query, where, deleteDoc } from 'firebase/firestore';
import 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmmJZIPA4eguMEDd3Ykh4CyllQu6tzGqk",
  authDomain: "thoughtformsai.firebaseapp.com",
  projectId: "thoughtformsai",
  storageBucket: "thoughtformsai.appspot.com",
  messagingSenderId: "721203938448",
  appId: "1:721203938448:web:5f0031e335400518700415",
  measurementId: "G-8VNR2BSMGY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const firestore = getFirestore(app);
export const usageCollection = collection(firestore, 'usage');

export const db = getFirestore();

export async function fetchUsers() {
  const usersCollection = collection(db, 'users');
  const userSnapshot = await getDocs(usersCollection);
  const userList = userSnapshot.docs.map(doc => doc.data());
  return userList;
}

export async function getFirebaseDataById(collectionName: string, id: string) {
  const documentRef = doc(db, collectionName, id);
  const documentSnapshot = await getDoc(documentRef);

  if (documentSnapshot.exists()) {
    console.log(`Document found: ${id}`);
    return documentSnapshot.data();
  } else {
    console.log(`No such document with id: ${id}`);
    return null;
  }
}

export const saveDraft = async (userEmail: string, draftContent: string) => {
  try {
    await setDoc(doc(firestore, 'drafts', userEmail), {
      content: draftContent,
      updatedAt: new Date()
    });
    console.log('Draft saved successfully');
  } catch (error) {
    console.error('Error saving draft:', error);
  }
};

export const fetchDraft = async (userEmail: string) => {
  try {
    const docRef = doc(firestore, 'drafts', userEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Draft data:', docSnap.data());
      return docSnap.data().content;
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching draft:', error);
  }
};

export const saveContentToFirestore = async (userEmail: string, content: string) => {
  try {
    await setDoc(doc(firestore, 'saved', userEmail), { content });
    console.log('Content saved successfully');
  } catch (error) {
    console.error('Error saving content:', error);
  }
};

export const saveAIContentToFirestore = async (userEmail: string, content: string) => {
  try {
    await setDoc(doc(firestore, 'aigenerated', userEmail), { content });
    console.log('Content saved successfully');
  } catch (error) {
    console.error('Error saving content:', error);
  }
};

export const fetchAIGeneratedContent = async (userEmail: string) => {
  const docRef = doc(firestore, 'aigenerated', userEmail);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().content; // Assuming the content is stored under a 'content' field
  } else {
    console.log("No such document!");
    return null;
  }
};

export const fetchSavedContent = async (userEmail: string) => {
  const docRef = doc(firestore, 'saved', userEmail);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().content; // Assuming the content is stored under a 'content' field
  } else {
    console.log("No such document!");
    return null;
  }
};

// Define the FavoriteImage type
export interface FavoriteImage {
  id: string;
  imageUrl: string;
  storagePath: string;
}

export const saveFavoriteImage = async (userEmail: string, image: string) => {
  try {
    const imageRef = ref(storage, `favorites/${userEmail}/${Date.now()}.png`);
    await uploadString(imageRef, image, 'data_url');
    const downloadURL = await getDownloadURL(imageRef);

    await setDoc(doc(firestore, 'favorites', `${userEmail}_${Date.now()}`), {
      email: userEmail,
      imageUrl: downloadURL,
      storagePath: imageRef.fullPath,
      createdAt: new Date()
    });
    console.log('Favorite image saved successfully');
  } catch (error) {
    console.error('Error saving favorite image:', error);
  }
};

export const fetchFavoriteImages = async (userEmail: string): Promise<FavoriteImage[]> => {
  try {
    const q = query(collection(firestore, 'favorites'), where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);
    const favoriteImages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FavoriteImage));
    return favoriteImages;
  } catch (error) {
    console.error('Error fetching favorite images:', error);
    return [];
  }
};

export const deleteFavoriteImage = async (docId: string, storagePath: string) => {
  try {
    const imageRef = ref(storage, storagePath);
    await deleteObject(imageRef);
    await deleteDoc(doc(firestore, 'favorites', docId));
    console.log('Favorite image deleted successfully');
  } catch (error) {
    console.error('Error deleting favorite image:', error);
  }
};
