'use client';
// Chakra imports
import { Button } from '@chakra-ui/react';
import Card from '@/components/card/Card';

import { auth, storage, firestore } from '../../../config/firebase';
import { updateUserDetails, deleteUserAccount } from '../../../config/firebaseUtils';

import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { FormControl, Flex, Text, useToast, useColorModeValue } from '@chakra-ui/react';
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider, updateEmail } from 'firebase/auth';

type DeleteProps = {
  uid: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  job: string;
  about: string;
  twitter: string;
  facebook: string;
  github: string;
  // selectedAvatar: string | null;
};

export default function Settings({ 
  username, email, firstName, lastName, job, about, twitter, facebook, github 
}: DeleteProps) {

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toast = useToast();

//   const handleAvatarChange = async () => {
//     if (!auth.currentUser || !selectedAvatar) return;
//     const uid = auth.currentUser.uid;
//     const details = {
//         email: email,
//         avatar: selectedAvatar
//     };
//     await updateUserDetails(uid, details);
// };

  // const handleSaveChanges = async () => {
  //   const user = auth.currentUser;
  //   if (!user) return;

  //   // Update email and avatar
  //   await handleAvatarChange();

  //   // Update user details in Firestore
  //   const userDetails = {
  //       username: username,
  //       email: email,
  //       first_name: firstName,
  //       last_name: lastName,
  //       job: job,
  //       about: about,
  //       twitter: twitter,
  //       facebook: facebook,
  //       github: github
  //   };
  //   await updateUserDetails(user.uid, userDetails);

  //   // Check password confirmation
  //   if (newPassword !== confirmPassword) {
  //       toast({
  //           title: "Error",
  //           description: "New password and confirmation do not match.",
  //           status: "error",
  //           duration: 3000,
  //           isClosable: true,
  //       });
  //       return;
  //   }

  //   if (user && oldPassword) {
  //       // Re-authenticate the user

  //       if (!user.email) {
  //           toast({
  //               title: "Error",
  //               description: "Email not found. Please sign in again.",
  //               status: "error",
  //               duration: 3000,
  //               isClosable: true,
  //           });
  //           return;
  //       }
        
  //       const credentials = EmailAuthProvider.credential(user.email, oldPassword);
        
  //       reauthenticateWithCredential(user, credentials)
  //           .then(() => {
  //               // User re-authenticated, now update the password
  //               return updatePassword(user, newPassword);
  //           })
  //           .then(() => {
  //               toast({
  //                   title: "Success",
  //                   description: "Password updated successfully.",
  //                   status: "success",
  //                   duration: 3000,
  //                   isClosable: true,
  //               });
  //           })
  //           .catch((error: any) => {
  //               toast({
  //                   title: "Error",
  //                   description: error.message,
  //                   status: "error",
  //                   duration: 3000,
  //                   isClosable: true,
  //               });
  //           });
  //   }
  // };

//   const handleSaveChanges = async () => {
//     if (!auth.currentUser) return;

//     const uid = auth.currentUser.uid;

//     // Handle avatar change
//     const details = {
//         username: username,
//         email: email,
//         first_name: firstName,
//         last_name: lastName,
//         job: job,
//         about: about,
//         twitter: twitter,
//         facebook: facebook,
//         github: github,
//         email: email,
//         avatar: selectedAvatar
//     };
//     await updateUserDetails(uid, details);

//     // Update email
//     // await updateEmail(auth.currentUser, email);

//     // Upload avatar to Firebase Storage and get the download URL
//     let avatarURL = selectedAvatar;
//     if (selectedAvatar && typeof selectedAvatar === "string" && selectedAvatar.startsWith("data:")) {
//         const storage = getStorage();
//         const storageRef = ref(storage, `avatars/${uid}`);
//         await uploadString(storageRef, selectedAvatar, 'data_url');
//         avatarURL = await getDownloadURL(storageRef);
//     }

//     // Check if avatarURL is undefined
//     const firestoreDetails: any = {
//         email: email
//     };
//     if (avatarURL !== undefined) {
//         firestoreDetails.avatar = avatarURL;
//     }

//     await updateUserDetails(uid, firestoreDetails);
// };

const handleSaveChanges = async () => {
  if (!auth.currentUser) return;

  const uid = auth.currentUser.uid;

  // Upload avatar to Firebase Storage and get the download URL
  // let avatarURL = selectedAvatar;
  // if (selectedAvatar && typeof selectedAvatar === "string" && selectedAvatar.startsWith("data:")) {
  //     const storage = getStorage();
  //     const storageRef = ref(storage, `avatars/${uid}`);
  //     await uploadString(storageRef, selectedAvatar, 'data_url');
  //     avatarURL = await getDownloadURL(storageRef);
  // }

  // Save details to Firestore
  const userDetails = {
      email_show: email,
      // avatar: avatarURL,
      username: username,
      first_name: firstName,
      last_name: lastName,
      job: job,
      about: about,
      twitter: twitter,
      facebook: facebook,
      github: github,
      email: auth.currentUser.email
  };

  await updateUserDetails(uid, userDetails);
  toast({
    title: "Profile Updated",
    description: "Your profile has been successfully updated.",
    status: "success",
    duration: 3000,
    isClosable: true,
  });

  window.location.reload();
  
};


  // Delete account handler
  const handleDeleteAccount = async () => {
    const uid = auth.currentUser?.uid;
    if (uid && window.confirm("Are you sure you want to delete your account?")) {
      await deleteUserAccount(uid);
    }
  };

  return (
    <Card
      flexDirection={{ base: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems="right"
    >
      <Button
        variant="red"
        py="20px"
        px="16px"
        fontSize="sm"
        borderRadius="45px"
        w={{ base: '100%', md: '210px' }}
        h="54px"
        onClick={handleDeleteAccount}
      >
        Delete Account
      </Button>
      <Button
        variant="primary"
        py="20px"
        px="16px"
        fontSize="sm"
        borderRadius="45px"
        mt={{ base: '20px', md: '0px' }}
        w={{ base: '100%', md: '210px' }}
        h="54px"
        onClick={handleSaveChanges}
      >
        Save Changes
      </Button>
    </Card>
  );
}
