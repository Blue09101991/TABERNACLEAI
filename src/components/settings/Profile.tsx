import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { auth } from '../../../config/firebase';
import { updateUserDetails } from '../../../config/firebaseUtils';
// Chakra imports
import { Flex, Select, Text, useColorModeValue } from '@chakra-ui/react';
import Card from '@/components/card/Card';
import { NextAvatar } from '@/components/image/Avatar';
import { StaticImageData } from 'next/image';
// import { Image } from '@/components/image/Image';

import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
// import { getFirestore, collection, addDoc } from "firebase/firestore";
// import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, Firestore } from "firebase/firestore";

import { getFirestore, collection, query, where, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";

interface ProfileProps {
    name?: string;
    avatar?: string;  // Expected to be a path to the avatar image
    banner?: string;  // Expected to be a path to the banner image
    textColorPrimary?: string;  // Optional: to customize text color
    selectedAvatar: string | null;
    setSelectedAvatar: React.Dispatch<React.SetStateAction<string | null>>;
}

const Profile: React.FC<ProfileProps> = ({
    name = "Default Name",
    avatar = "/img/avatars/avatar4.png",
    banner = "/path_to_default_banner.jpg",
    textColorPrimary = "white",
    selectedAvatar,
    setSelectedAvatar
}) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string>('');

    // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setSelectedImage(reader.result as string);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const bannerStyle: React.CSSProperties = {
        backgroundImage: `url(${banner})`
    };

    // const handleSaveChanges = async () => {
    //     if (!auth.currentUser) return;
    //     const uid = auth.currentUser.uid;
    //     const email = auth.currentUser.email;
    //     const details = {
    //         email: email,
    //         avatar: selectedImage
    //     };
    //     await updateUserDetails(uid, details);
    // };

    // const bannerStyle: React.CSSProperties = {
    //     backgroundImage: `url(${banner})`
    // };

    // const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = async () => {
    //             const imageDataURL = reader.result as string;
    //             setSelectedImage(imageDataURL);

    //             if (auth.currentUser) {
    //                 const uid = auth.currentUser.uid;
    //                 const storageRef = ref(getStorage(), `avatars/${uid}`);
    //                 await uploadString(storageRef, imageDataURL, 'data_url');
    //                 const imageURL = await getDownloadURL(storageRef);

    //                 // Saving to Firestore
    //                 const db = getFirestore();
    //                 await addDoc(collection(db, "profile"), {
    //                     email: auth.currentUser.email,
    //                     avatarURL: imageURL
    //                 });
    //             }
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const imageDataURL = reader.result as string;
                setSelectedImage(imageDataURL);
    
                if (auth.currentUser) {
                    const uid = auth.currentUser.uid;
                    const storageRef = ref(getStorage(), `avatars/${uid}`);
                    await uploadString(storageRef, imageDataURL, 'data_url');
                    const imageURL = await getDownloadURL(storageRef);
    
                    // Saving to Firestore
                    const db = getFirestore();
                    const q = query(collection(db, "profile"), where("email", "==", auth.currentUser.email));
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.empty) {
                        // No existing document, create a new one
                        await addDoc(collection(db, "profile"), {
                            email: auth.currentUser.email,
                            avatarURL: imageURL
                        });
                    } else {
                        // Update existing document
                        querySnapshot.forEach(async (docSnapshot) => {
                            await updateDoc(doc(db, "profile", docSnapshot.id), {
                                avatarURL: imageURL
                            });
                        });
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };


    useEffect(() => {
        const fetchAvatar = async () => {
            if (auth.currentUser) {
                const db = getFirestore();
                const q = query(collection(db, "profile"), where("email", "==", auth.currentUser.email));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    // Assuming the field in Firestore is named 'avatarURL'
                    const avatarURL = doc.data().avatarURL;
                    setSelectedImage(avatarURL);
                });
            }
        };

        fetchAvatar();
    }, []);

    useEffect(() => {
        const fetchFullName = async () => {
            if (auth.currentUser) {
                const db = getFirestore();
                const q = query(collection(db, "users"), where("email", "==", auth.currentUser.email));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((docSnapshot) => {
                    const userData = docSnapshot.data();
                    const fetchedFullName = `${userData.first_name} ${userData.last_name}`;
                    setFullName(fetchedFullName);
                });
            }
        };
    
        fetchFullName();
    }, [auth.currentUser]);

    return (
        <Card mb="20px" alignItems="center">
            <Flex style={bannerStyle} w="100%" h="129px" borderRadius="16px" />
            <input type="file" accept="image/*" onChange={handleImageChange} style={{display: "none"}} id="avatarInput" />
            <label htmlFor="avatarInput">
                <NextAvatar
                    mx="auto"
                    src={selectedImage || avatar}
                    h="87px"
                    w="87px"
                    mt="-43px"
                    mb="15px"
                />
            </label>
            <Text
                fontSize="2xl"
                textColor={textColorPrimary}
                fontWeight="700"
                mb="4px"
            >
                {fullName || name}
            </Text>
            {/* <Button onClick={handleSaveChanges}>Save Changes</Button> */}
        </Card>
    );
}

export default Profile;

