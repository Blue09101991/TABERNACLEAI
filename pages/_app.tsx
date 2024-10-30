'use client';
import type { AppProps } from 'next/app';
import { ChakraProvider, Box, Portal, useDisclosure } from '@chakra-ui/react';
import theme from '@/theme/theme';
import routes from '@/routes';
import Sidebar from '@/components/sidebar/Sidebar';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
// import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';
import ProtectedRoute from '../constants/ProtectedRoute';
import { AuthProvider } from 'firebase/auth';
import { AuthContextProvider } from '../constants/authcontext';
import { APIUsageProvider } from '../constants/APIUsageContext';
import useRoutes from '@/routes'; // New import
import { useRouter } from 'next/router';
import { getActiveNavbar, getActiveRoute } from '@/utils/navigation';
import { auth, db } from '../config/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

function App({ Component, pageProps }: AppProps<{}>) {
  const router = useRouter();
  const dynamicRoutes = useRoutes();
  const pathname = usePathname();
  const [apiKey, setApiKey] = useState('');
  const [apiRepeaterKey, setApiRepeaterKey] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const initialKey = localStorage.getItem('apiKey');
    const initialRepeaterKey = localStorage.getItem('apiKeyRepeater');
    if (initialKey?.includes('sk-') && apiKey !== initialKey) {
      setApiKey(initialKey);
    }
    if (initialRepeaterKey && apiRepeaterKey !== initialRepeaterKey) {
      setApiRepeaterKey(initialRepeaterKey);
    }
  }, [apiKey]);

  // useEffect(() => {
  //   const initialKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  //   const initialRepeaterKey = process.env.NEXT_PUBLIC_REPEATER_API_KEY;

  //   if (initialKey) {
  //     setApiKey(initialKey);
  //   }

  //   if (initialRepeaterKey) {
  //     setApiRepeaterKey(initialRepeaterKey);
  //   }
  // }, [apiKey]);

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
    const checkAdminAccess = async () => {
      const adminEmails = await fetchAdminEmails();
      console.log(adminEmails);
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          // Check if the user's email is in the list of admin emails
          if (!adminEmails.has(user.email) && router.pathname.startsWith("/admin")) {
            // If not an admin, redirect them
            // router.push('/');
          }
        } else {
          // If no user is logged in and trying to access /admin, redirect to login
          if (router.pathname.startsWith("/admin")) {
            router.push('/login');
          }
        }
      });
  
      return () => unsubscribe(); // Cleanup the listener on unmount
    };
  
    checkAdminAccess();
  }, [router]);
  


  return (
    <ChakraProvider theme={theme}>
      <APIUsageProvider>
        <AuthContextProvider>
          {pathname.includes('register') || pathname.includes('sign-in') || pathname.includes('forgotpassword') ? (
            <Component apiKeyApp={apiKey} {...pageProps} />
          ) : (
            <Box>
              <Sidebar setApiKey={setApiKey} routes={dynamicRoutes} />
              <Box
                pt={{ base: '60px', md: '100px' }}
                float="right"
                minHeight="100vh"
                height="100%"
                overflow="auto"
                position="relative"
                maxHeight="100%"
                w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
                transitionDuration=".2s, .2s, .35s"
                transitionProperty="top, bottom, width"
                transitionTimingFunction="linear, linear, ease"
              >
                <Portal>
                  <Box>
                    <Navbar
                      setApiKey={setApiKey}
                      onOpen={onOpen}
                      logoText={'ThoughtForms'}
                      brandText={getActiveRoute(dynamicRoutes, router.pathname)}  // Ensure this function is correctly imported
                      secondary={getActiveNavbar(dynamicRoutes, router.pathname)}
                    />
                  </Box>
                </Portal>
                <Box
                  mx="auto"
                  p={{ base: '20px', md: '30px' }}
                  pe="20px"
                  minH="100vh"
                  pt="50px"
                >
                  <ProtectedRoute>
                    <Component apiKeyApp={apiKey} apiKeyRepeaterApp={apiRepeaterKey} {...pageProps} />
                  </ProtectedRoute>
                </Box>
                <Box>
                  <Footer />
                </Box>
              </Box>
            </Box>
          )}
        </AuthContextProvider>
      </APIUsageProvider>
    </ChakraProvider>
  );
}

export default App;
