// firebaseUtils.ts

import { getFirestore, doc, getDoc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { auth, firestore } from './firebase';

const db = getFirestore();

// Fetch the current user's details from Firestore
export const fetchUserDetails = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.data();
};

// Update the user's details in Firestore
export const updateUserDetails = async (uid: string, details: any) => {
  // console.log("Updating details for UID:", uid, "with data:", details);
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, details, { merge: true });
};

// Delete the user's account (both from Firebase Auth and Firestore)
export const deleteUserAccount = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  await deleteDoc(userRef);
  // Additionally, delete from Firebase Auth (this is irreversible!)
  const user = auth.currentUser;
  if (user) {
    await user.delete();
  }
};

export const getAllUsers = async function () {
  const usersCollection = collection(firestore, 'users');
  const userSnapshot = await getDocs(usersCollection);
  const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return userList;
}

export const deleteUser = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId); // Assuming you have a 'users' collection and the userId is the document ID
    await deleteDoc(userRef);
    console.log("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
