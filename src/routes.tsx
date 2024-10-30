import { Icon } from './lib/chakra';
import {
  MdFileCopy,
  MdHome,
  MdLock,
  MdLayers,
  MdAutoAwesome,
  MdOutlineManageAccounts,
  MdEditDocument,
  MdImage,
  MdVideoStable,
  MdInfo,
  MdVoiceChat,
  MdFace6,
  MdOutlineLibraryMusic,
  MdOutlineMusicVideo,
  MdOutlineVideoStable
} from 'react-icons/md';
import { IoMdPerson } from 'react-icons/io';
import { LuHistory } from 'react-icons/lu';
import { RoundedChart } from '@/components/icons/Icons';

// Auth Imports
import { IRoute } from './types/navigation';

import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

const baseRoutes: IRoute[] = [
  // {
  //   name: 'All Templates',
  //   path: '/all-templates',
  //   icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  //   collapse: false,
  //   rightElement: true,
  // },

  // {
  //   name: 'My Projects',
  //   path: '/my-projects',
  //   icon: <Icon as={MdLayers} width="20px" height="20px" color="inherit" />,
  //   collapse: false,
  // },

  // // {
  // //   name: 'Documents',
  // //   path: '/documents',
  // //   icon: <Icon as={MdEditDocument} width="20px" height="20px" color="inherit" />,
  // //   collapse: false,
  // // },

  // {
  //   name: 'Chat',
  //   path: '/chat',
  //   icon: (
  //     <Icon as={MdAutoAwesome} width="20px" height="20px" color="inherit" />
  //   ),
  //   collapse: false,
  // },

  {
    name: 'Image Generation',
    path: '/image-generation',
    icon: (
      <Icon as={MdImage} width="20px" height="20px" color="inherit" />
    ),
    collapse: false,
  },

  // {
  //   name: 'Image Generation',
  //   path: '/image-generation',
  //   icon: (
  //     <Icon as={MdImage} width="20px" height="20px" color="inherit" />
  //   ),
  //   collapse: false,
  // },

  // {
  //   name: 'Image Generator',
  //   path: '/image-generator',
  //   icon: (
  //     <Icon as={MdImage} width="20px" height="20px" color="inherit" />
  //   ),
  //   collapse: false,
  // },

  // {
  //   name: 'Video Generation',
  //   path: '/video-generation',
  //   icon: (
  //     <Icon as={MdVideoStable} width="20px" height="20px" color="inherit" />
  //   ),
  //   collapse: false,
  // },

  // {
  //   name: 'Avatar Creation',
  //   path: '/avatar-creation',
  //   icon: (
  //     <Icon as={MdFace6} width="20px" height="20px" color="inherit" />
  //   ),
  //   collapse: false,
  // },


  // {
  //   name: 'Voice Generation',
  //   path: '/voice-generation',
  //   icon: (
  //     <Icon as={MdVoiceChat} width="20px" height="20px" color="inherit" />
  //   ),
  //   collapse: false,
  // },

  {
    name: 'Music Studio',
    path: '/music-studio',
    icon: (
      <Icon as={MdOutlineLibraryMusic} width="20px" height="20px" color="inherit" />
    ),
    collapse: false,
  },

  // {
  //   name: 'Video Studio',
  //   path: '/video-studio',
  //   icon: (
  //     <Icon as={MdOutlineVideoStable} width="20px" height="20px" color="inherit" />
  //   ),
  //   collapse: false,
  // },



  // {
  //   name: 'Prompt',
  //   path: '/prompt',
  //   icon: <Icon as={MdLayers} width="20px" height="20px" color="inherit" />,
  //   collapse: false,
  // },

  // {
  //   name: 'Documents',
  //   path: '/documents',
  //   icon: <Icon as={MdEditDocument} width="20px" height="20px" color="inherit" />,
  //   collapse: true,
  //   invisible: false,
  //   items: [
  //     {
  //       name: 'Create',
  //       layout: '/documents',
  //       path: '/create',
  //     },
  //     {
  //       name: 'Drafts',
  //       layout: '/documents',
  //       path: '/drafts',
  //     },
  //     {
  //       name: 'Saved',
  //       layout: '/documents',
  //       path: '/saved',
  //     },
  //     {
  //       name: 'AI Generated',
  //       layout: '/documents',
  //       path: '/aigenerated',
  //     },

  //   ],
  // },

  {
    name: 'Support',
    path: '/info-support',
    icon: <Icon as={MdInfo} width="20px" height="20px" color="inherit" />,
    collapse: true,
    invisible: false,
    items: [
      {
        name: 'Pricing',
        layout: '/info-support',
        path: '/pricing',
      },
      {
        name: 'FAQs',
        layout: '/info-support',
        path: '/faqs',
      },
      {
        name: 'Help Center',
        layout: '/info-support',
        path: '/helpcenter',
      },
      {
        name: 'Submit Feedback',
        layout: '/info-support',
        path: '/feedback',
      },

    ],
  },

  // --- Admin Pages ---
  // {
  //   name: 'Admin Pages',
  //   path: '/admin',
  //   icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
  //   collapse: true,
  //   items: [
  //     {
  //       name: 'All Templates',
  //       layout: '/admin',
  //       path: '/all-admin-templates',
  //     },
  //     {
  //       name: 'New Template',
  //       layout: '/admin',
  //       path: '/new-template',
  //     },
  //     {
  //       name: 'Edit Template',
  //       layout: '/admin',
  //       path: '/edit-template',
  //     },
  //     {
  //       name: 'Users Overview',
  //       layout: '/admin',
  //       path: '/overview',
  //     },
  //   ],
  // },

  {
    name: 'Profile Settings',
    path: '/settings',
    icon: (
      <Icon
        as={MdOutlineManageAccounts}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    invisible: true,
    collapse: false,
  },
  {
    name: 'History',
    path: '/history',
    icon: <Icon as={LuHistory} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Usage',
    path: '/usage',
    icon: <Icon as={RoundedChart} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'My plan',
    path: '/my-plan',
    icon: <Icon as={RoundedChart} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  // -------------- Prompt Pages --------------
  {
    name: 'Essay Generator',
    path: '/essay',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Content Simplifier',
    path: '/simplifier',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Product Description',
    path: '/product-description',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Email Enhancer',
    path: '/email-enhancer',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'LinkedIn Message',
    path: '/linkedin-message',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Instagram Caption',
    path: '/caption',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'FAQs Content',
    path: '/faq',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Product Name Generator',
    path: '/name-generator',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'SEO Keywords',
    path: '/seo-keywords',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Review Responder',
    path: '/review-responder',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Business Idea Generator',
    path: '/business-generator',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Article Generator',
    path: '/article',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Plagiarism Checker',
    path: '/plagiarism-checker',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Hashtags Generator',
    path: '/hashtags-generator',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Pet Name Generator',
    path: '/pet-name-generator',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Translator',
    path: '/translator',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Domain Name Generator',
    path: '/domain-name-generator',
    icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  // {
  //   name: 'Bootstrap to Tailwind Converter',
  //   path: '/bootstrap-to-tailwind-converter',
  //   icon: <Icon as={IoMdPerson} width="20px" height="20px" color="inherit" />,
  //   invisible: true,
  //   collapse: false,
  // },
];

// const adminRoute = {
//   name: 'Admin Pages',
//   path: '/admin',
//   icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
//   collapse: true,
//   items: [
//     // {
//     //   name: 'All Templates',
//     //   layout: '/admin',
//     //   path: '/all-admin-templates',
//     // },
//     // {
//     //   name: 'New Template',
//     //   layout: '/admin',
//     //   path: '/new-template',
//     // },
//     // {
//     //   name: 'Edit Template',
//     //   layout: '/admin',
//     //   path: '/edit-template',
//     // },
//     {
//       name: 'Users Overview',
//       layout: '/admin',
//       path: '/overview',
//     },
//     {
//       name: 'Price',
//       layout: '/admin',
//       path: '/price',
//     },
//   ],
// };

export default function useRoutes() {
  const [dynamicRoutes, setDynamicRoutes] = useState<IRoute[]>(baseRoutes);

  const fetchAdminEmails = async () => {
    const adminEmails = new Set();
    try {
      // Reference to the 'admin' collection
      const querySnapshot = await getDocs(collection(db, "admin"));
      
      // Iterate through each document in the 'admin' collection
      querySnapshot.forEach((doc) => {
        // Extract the 'userEmail' field from each document
        const email = doc.data().userEmail;
        if (email) {
          // Add the email to the Set if it exists
          adminEmails.add(email);
        }
      });
    } catch (error) {
      console.error("Error fetching admin emails:", error);
    }
    return adminEmails;
  };

  useEffect(() => {
    const updateRoutes = async () => {
      const adminEmails = await fetchAdminEmails();
      auth.onAuthStateChanged((user) => {
        // Check if the user's email is in the fetched admin emails
        if (adminEmails.has(user?.email)) {
          setDynamicRoutes((prevRoutes) => [
            ...prevRoutes,
            adminRoute
          ]);
        } else {
          setDynamicRoutes((prevRoutes) =>
            prevRoutes.filter(route => route.name !== 'Admin Pages')
          );
        }
      });
    };
  
    updateRoutes();
  
    // No need to return unsubscribe function from onAuthStateChanged 
    // as it's handled within the async updateRoutes function
  }, []);

  return dynamicRoutes;
}
