import { useEffect, useState, useRef } from 'react';
import { Box, Flex, Text, Progress } from '@chakra-ui/react';
import BarChart from '@/components/charts/BarChart';
import { barChartDataSidebar, barChartOptionsSidebar } from '@/variables/charts';
import { useAPIUsage } from '../../../../constants/APIUsageContext';

// import { usageCollection, auth } from '../../../../config/firebase';
import { addDoc, setDoc, doc, getDoc, query, orderBy, limit, collection, getDocs, where, onSnapshot } from 'firebase/firestore';
import { startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { usageCollection, auth, firestore } from '../../../../config/firebase';
import { Alert } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useBreakpointValue } from '@chakra-ui/react';

import BuyCreditsModal from '@/components/buyCreditModal';


import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react';


const SidebarDocs = () => {
  const bgColor = 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)';

  const { usage } = useAPIUsage();
  const [latestUsage, setLatestUsage] = useState(usage);
  const router = useRouter();

  const [tokens, setTokens] = useState<number>(0);
  const modalSize = useBreakpointValue({ base: 'xs', sm: 'md' });
  const [isBuyCreditsModalOpen, setBuyCreditsModalOpen] = useState(false);

  const [weeklyUsageData, setWeeklyUsageData] = useState([
    {
      name: 'Credits Used',
      data: [0, 0, 0, 0, 0, 0, 0],  // Initialize to zeros
    },
  ]);

  const currentUserEmail = auth.currentUser?.email || 'anonymous';
  const prevUsageRef = useRef(usage);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // useEffect(() => {
  //   if (prevUsageRef.current !== usage) {
  //     const saveUsageToFirestore = async () => {
  //       const currentDate = new Date().toISOString();
  //       const userDocRef = doc(usageCollection, currentUserEmail);
  //       const recordsCollection = collection(userDocRef, 'records');
  //       await addDoc(recordsCollection, {
  //         usageValue: usage,
  //         timestamp: currentDate
  //       });
  //     };
  //     saveUsageToFirestore().catch((error) => {
  //       console.error("Error saving usage to Firestore:", error);
  //     });
  //     prevUsageRef.current = usage;
  //   }
  // }, [usage, currentUserEmail]);

  useEffect(() => {
    if (prevUsageRef.current !== usage) {
      const saveUsageToFirestore = async () => {
        const currentDate = new Date().toISOString();
        const userDocRef = doc(usageCollection, currentUserEmail);
        const recordsCollection = collection(userDocRef, 'records');

        // Set the usage to 1
        const newUsage = usage;

        await addDoc(recordsCollection, {
          usageValue: newUsage,  // Use the newUsage value which is set to 1
          timestamp: currentDate
        });
      };
      saveUsageToFirestore().catch((error) => {
        console.error("Error saving usage to Firestore:", error);
      });
      prevUsageRef.current = usage;
    }
  }, [usage, currentUserEmail]);




  // 2nd useEffect
  useEffect(() => {
    const recordsRef = collection(doc(usageCollection, currentUserEmail), 'records');
    const unsubscribe = onSnapshot(recordsRef, (snapshot) => {
      let sum = 0;
      snapshot.forEach((doc) => {
        sum += doc.data().usageValue;
      });
      setLatestUsage(sum);
    });

    return () => unsubscribe();
  }, [currentUserEmail]);

  // 3rd useEffect
  useEffect(() => {
    const recordsRef = collection(doc(usageCollection, currentUserEmail), 'records');
    onSnapshot(recordsRef, (snapshot) => {
      const startDate = startOfWeek(new Date());
      const endDate = endOfWeek(new Date());
      const weekDays = eachDayOfInterval({ start: startDate, end: endDate });
      let summedData = Array(weekDays.length).fill(0);

      snapshot.forEach((doc) => {
        const timestamp = new Date(doc.data().timestamp);
        weekDays.forEach((day, index) => {
          if (isWithinInterval(timestamp, { start: startOfDay(day), end: endOfDay(day) })) {
            summedData[index] += doc.data().usageValue;
          }
        });
      });

      setWeeklyUsageData([
        {
          name: 'Credits Used',
          data: summedData,
        },
      ]);
    });
  }, [currentUserEmail]);

  useEffect(() => {
    const tokenRef = doc(firestore, 'token', currentUserEmail);  // Reference to the user's document in the token collection

    const unsubscribe = onSnapshot(tokenRef, (docSnap) => {
      if (docSnap.exists()) {
        setTokens(docSnap.data().tokens);  // Update the tokens state with the retrieved value
      } else {
        console.log('No token document for the current user.');
      }
    });

    return () => unsubscribe();  // Cleanup on component unmount
  }, [currentUserEmail]);

  // console.log('This is test', weeklyUsageData);

  // useEffect(() => {
  //   if (latestUsage > tokens) {
  //     setIsModalOpen(true);
  //   } else {
  //     setIsModalOpen(false);
  //   }
  // }, [latestUsage, tokens]);

  useEffect(() => {
    // Check if the current route is not '/my-plan'
    if (router.pathname !== '/my-plan') {
      if (latestUsage > tokens) {
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
      }
    } else {
      // If it is '/my-plan', ensure the modal is not open
      setIsModalOpen(false);
    }
  }, [latestUsage, tokens, router.pathname]); // Include router.pathname in the dependency array

  

  // Calculate the progress percentage based on usage
  const progressPercentage = (latestUsage / 100000) * 100;

  const handleUpgradeClick = () => {
    // setBuyCreditsModalOpen(true); // Assuming you have this function to open a modal or similar logic
    router.push('/my-plan'); // Navigate to the /chat page
  };

  return (

    <Flex
      justify="center"
      direction="column"
      align="center"
      bg={bgColor}
      borderRadius="16px"
      position="relative"
      w="100%"
      pb="10px"
    // mb="20px"
    >
      <Flex direction="column" mb="12px" w="100%" px="20px" pt="20px">
        <Text fontSize="sm" fontWeight={'600'} color="white" mb="10px">
          Credits
        </Text>
        <Progress
          mb="6px"
          value={progressPercentage} // Use the calculated percentage here
          colorScheme="white"
          style={{
            fill: 'white',
            background: 'rgba(255, 255, 255, 0.3)',
            width: '100%',
            height: '6px',
          }}
        />
        <Text fontWeight={'500'} fontSize="sm" color="white" mb="14px">
          {latestUsage}/{tokens} credits used
        </Text>
      </Flex>
      {/* <Box h="160px" w="100%" mt="-46px"> */}

      {/* Modal Alert for running out of credits */}
      <Modal isOpen={isModalOpen} onClose={closeModal} closeOnOverlayClick={false} closeOnEsc={false} isCentered >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please upgrade plan!</ModalHeader>
          <ModalBody>
            <Text mb="4">You've exhausted your credits. Please purchase more to continue using the platform.</Text>
            <Button colorScheme="red" onClick={handleUpgradeClick} style={{ margin: "5px" }}>Upgrade</Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Buy Credits Modal */}
      {/* <BuyCreditsModal isOpen={isBuyCreditsModalOpen} onClose={() => setBuyCreditsModalOpen(false)} userEmail={currentUserEmail} /> */}

      <BarChart
        key={JSON.stringify(weeklyUsageData)}  // Force re-render when data changes
        chartData={weeklyUsageData}
        chartOptions={barChartOptionsSidebar}
      />
      {/* </Box> */}
    </Flex>
  );
}
export default SidebarDocs;