/*eslint-disable*/

import Card from '@/components/card/Card';
import {
  Box,
  Button,
  Icon,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  MdBarChart,
  MdOutlinePaid,
  MdMemory,
  MdApi,
  MdInsights,
} from 'react-icons/md';
import MiniStatistics from '@/components/card/MiniStatistics';
import IconBox from '@/components/icons/IconBox';
import LineChart from '@/components/charts/LineChart';
import { lineChartDataUsage, lineChartOptionsUsage } from '@/variables/charts';
// import { startOfMonth, endOfMonth, eachMonthOfInterval, isWithinInterval } from 'date-fns';
import { useEffect, useState } from 'react';
import { addDoc, setDoc, doc, getDoc, query, orderBy, limit, collection, getDocs, where, onSnapshot } from 'firebase/firestore';
import { startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { usageCollection, auth, firestore } from '../../config/firebase'
import { useHistory, withRouter } from 'react-router-dom';
import { useAPIUsage } from '../../constants/APIUsageContext'

type MonthlyUsage = {
  [key: number]: number;
};

export default function NewTemplate() {
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.500';
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const [monthlyUsageData, setMonthlyUsageData] = useState([
    {
      name: 'Credits Used',
      data: Array(12).fill(0),
    },
  ]);

  const history = useHistory();

  const currentUserEmail = auth.currentUser?.email || 'anonymous';

  const { usage } = useAPIUsage();
  const [latestUsage, setLatestUsage] = useState(usage);
  const [tokens, setTokens] = useState<number>(0);

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


  useEffect(() => {
    const recordsRef = collection(doc(usageCollection, currentUserEmail), 'records');
    const unsubscribe = onSnapshot(recordsRef, (snapshot) => {
      const currentYear = new Date().getFullYear();
      let summedData = Array(12).fill(0); // Initialize to zeros for 12 months

      snapshot.forEach((doc) => {
        const timestamp = new Date(doc.data().timestamp);
        if (timestamp.getFullYear() === currentYear) {
          const month = timestamp.getMonth();
          summedData[month] += doc.data().usageValue;
        }
      });

      // console.log(summedData);

      setMonthlyUsageData([
        {
          name: 'Credits Used',
          data: summedData,
        },
      ]);
    });

    // console.log('*************', monthlyUsageData);

    return () => unsubscribe();
  }, [currentUserEmail]);

  // const handleManageClick = () => {
  //   history.push('/my-plan'); // Navigate to "/my-plan"
  // };

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

  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="20px" mb="20px">
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="24px" h="24px" as={MdBarChart} color={brandColor} />
              }
            />
          }
          name="Current credits used"
          value={latestUsage}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="24px" h="24px" as={MdApi} color={brandColor} />}
            />
          }
          name="Total Credits"
          value={tokens}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="28px" h="28px" as={MdMemory} color={brandColor} />}
            />
          }
          name="Plan Credits"
          value={tokens}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="24px" h="24px" as={MdOutlinePaid} color={brandColor} />
              }
            />
          }
          endContent={
            <Button
              variant="transparent"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="full"
              maxW="100px"
              ms="auto"
              fontSize="md"
              h="44px"
              onClick={() => { window.location.href = "/my-plan"; }}
            >
              Manage
            </Button>
          }
          name="Current Plan"
          value="Expert+"
        />
      </SimpleGrid>

      <Card>
        <Flex
          my="auto"
          h="100%"
          align={{ base: 'center', xl: 'start' }}
          justify={{ base: 'center', xl: 'center' }}
        >
          <IconBox
            w="56px"
            h="56px"
            bg={boxBg}
            icon={<Icon w="24px" h="24px" as={MdInsights} color={brandColor} />}
          />
          <Stat my="auto" ms={'18px'}>
            <StatLabel
              lineHeight="100%"
              color={textColorSecondary}
              fontSize="sm"
              mb="4px"
            >
              Credits usage
            </StatLabel>
            <StatNumber color={textColor} fontWeight="700" fontSize="lg">
              {latestUsage}
            </StatNumber>
          </Stat>
        </Flex>
        <Box h="500px">
          <LineChart
            key={JSON.stringify(monthlyUsageData)}
            chartData={monthlyUsageData}
            chartOptions={lineChartOptionsUsage}
          />
        </Box>
      </Card>
    </Box>
  );
}
0;
