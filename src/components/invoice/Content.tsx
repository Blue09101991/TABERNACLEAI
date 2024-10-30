'use client';
import React, { useState, useEffect } from 'react';
import { Button, Flex, Text, useColorModeValue, Box, Grid, GridItem, VStack, Heading } from '@chakra-ui/react';

import Card from '@/components/card/Card';
import { auth, firestore } from '../../../config/firebase';
import { fetchUserDetails } from '../../../config/firebaseUtils';

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { loadStripe, Stripe } from '@stripe/stripe-js';

import UpgradeAllPaymentmethodModal from '../upgradeAllPaymentmethodModal';

type RowObj = {
  plan: string;
  date: string | Date | Date;
  amount: string | number;
};

type PricingPlan = {
  planName: string;
  priceMonthly: string;
  priceYearly: string;
  wordLimit: string;
  features: string[];
  buttonTextMonthly: string;
  buttonTextYearly: string;
  onButtonClickMonthly: () => void;
  onButtonClickYearly: () => void;
};

export default function Content(props: { [x: string]: any }) {
  const textColor = useColorModeValue('black', 'white');
  const textSecondaryColor = useColorModeValue('gray.200', 'gray.400');
  const bgCard = useColorModeValue('white', 'navy.700');
  const bgGradient = "linear(to-r, #8285ff, #5639ff)";

  const [userData, setUserData] = useState<any>(null);
  const [firstname, setFirstName] = useState<any>(null);
  const [lastname, setLastName] = useState<any>(null);
  const [email, setEmail] = useState<any>(null);

  const [stripe, setStripe] = useState<Stripe | null>(null);

  const [regularMonthlyPrice, setRegularMonthlyPrice] = useState<number>(0);
  const [proMonthlyPrice, setProMonthlyPrice] = useState<number>(0);
  const [expertMonthlyPrice, setExpertMonthlyPrice] = useState<number>(0);

  const [regularYearlyPrice, setRegularYearlyPrice] = useState<number>(0);
  const [proYearlyPrice, setProYearlyPrice] = useState<number>(0);
  const [expertYearlyPrice, setExpertYearlyPrice] = useState<number>(0);

  const [regularFeatures, setRegularFeatures] = useState<string[]>([]);
  const [proFeatures, setProFeatures] = useState<string[]>([]);
  const [expertFeatures, setExpertFeatures] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const userDetails = await fetchUserDetails(uid);
        setEmail(userDetails?.email || "");
        setFirstName(userDetails?.first_name || "");
        setLastName(userDetails?.last_name || "");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchPricesAndFeatures = async () => {
      const fetchPriceAndFeatures = async (plan: string, type: string) => {
        const priceRef = doc(firestore, `price/${type}`);
        const priceDoc = await getDoc(priceRef);
        if (priceDoc.exists()) {
          const prices = priceDoc.data();
          const features = prices[`${plan}Context`] || [];

          if (type === 'monthly') {
            if (plan === 'regular') {
              setRegularMonthlyPrice(parseFloat(prices.regular));
              setRegularFeatures(features);
            } else if (plan === 'pro') {
              setProMonthlyPrice(parseFloat(prices.pro));
              setProFeatures(features);
            } else if (plan === 'expert') {
              setExpertMonthlyPrice(parseFloat(prices.expert));
              setExpertFeatures(features);
            }
          } else if (type === 'yearly') {
            if (plan === 'regular') {
              setRegularYearlyPrice(parseFloat(prices.regular));
            } else if (plan === 'pro') {
              setProYearlyPrice(parseFloat(prices.pro));
            } else if (plan === 'expert') {
              setExpertYearlyPrice(parseFloat(prices.expert));
            }
          }
        }
      };

      await fetchPriceAndFeatures('regular', 'monthly');
      await fetchPriceAndFeatures('pro', 'monthly');
      await fetchPriceAndFeatures('expert', 'monthly');

      await fetchPriceAndFeatures('regular', 'yearly');
      await fetchPriceAndFeatures('pro', 'yearly');
      await fetchPriceAndFeatures('expert', 'yearly');
    };

    fetchPricesAndFeatures();
  }, []);

  useEffect(() => {
    const fetchStripeKeyAndInit = async () => {
      const docRef = doc(firestore, 'price', 'paymentmethod');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const stripePublishableKey = data.STRIPE_PUBLISHABLE_KEY;

        if (stripePublishableKey) {
          const stripeInstance = await loadStripe(stripePublishableKey);
          setStripe(stripeInstance);
        } else {
          console.error('Stripe publishable key not found.');
        }
      } else {
        console.error('No such document for Stripe publishable key!');
      }
    };

    fetchStripeKeyAndInit();
  }, []);

  const [paymentHistories, setPaymentHistories] = useState<RowObj[]>([]);
  const [data, setData] = React.useState<RowObj[]>([]);
  const currentUserEmail = auth.currentUser?.email || 'anonymous';
  const [totalPaymentAmount, setTotalPaymentAmount] = useState<number>(0);
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPaymentHistories = async () => {
      const paymentHistoryRef = collection(firestore, 'paymenthistory');
      const paymentHistorySnapshot = await getDocs(paymentHistoryRef);

      const allPaymentHistories = paymentHistorySnapshot.docs
        .filter(doc => doc.data().user === currentUserEmail)
        .map(doc => {
          const data = doc.data();
          return {
            plan: data.credits,
            date: new Date(data.date).toLocaleDateString(),
            amount: data.price
          };
        });

      const totalAmount = allPaymentHistories.reduce((sum, payment) => sum + payment.amount, 0);
      setTotalPaymentAmount(totalAmount);

      const sortedHistories = allPaymentHistories.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      setPaymentHistories(sortedHistories);
      setData(sortedHistories);
    };

    fetchPaymentHistories();
  }, [currentUserEmail]);

  const handleStripePayment = async (selectedPrice: number) => {
    if (!stripe) {
      console.error('Stripe is not initialized.');
      return;
    }

    const response = await fetch('/api/create-stripe-session-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: selectedPrice,
        userEmail: currentUserEmail,
      }),
    });

    const session = await response.json();
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });
      if (error) console.error(error.message);
    }
  };

  const pricingPlans: PricingPlan[] = [
    {
      planName: 'Regular Plan',
      priceMonthly: `$${regularMonthlyPrice} /mo`,
      priceYearly: `$${regularYearlyPrice} /yr`,
      wordLimit: '10,000 Words',
      features: regularFeatures,
      buttonTextMonthly: 'Get Started Monthly',
      buttonTextYearly: 'Get Started Yearly',
      onButtonClickMonthly: () => {
        setSelectedPrice(regularMonthlyPrice);
        setUpgradeModalOpen(true);
      },
      onButtonClickYearly: () => {
        setSelectedPrice(regularYearlyPrice);
        setUpgradeModalOpen(true);
      },
    },
    {
      planName: 'Pro Plan',
      priceMonthly: `$${proMonthlyPrice} /mo`,
      priceYearly: `$${proYearlyPrice} /yr`,
      wordLimit: '25,000 Words',
      features: proFeatures,
      buttonTextMonthly: 'Get Started Monthly',
      buttonTextYearly: 'Get Started Yearly',
      onButtonClickMonthly: () => {
        setSelectedPrice(proMonthlyPrice);
        setUpgradeModalOpen(true);
      },
      onButtonClickYearly: () => {
        setSelectedPrice(proYearlyPrice);
        setUpgradeModalOpen(true);
      },
    },
    {
      planName: 'Expert Plan',
      priceMonthly: `$${expertMonthlyPrice} /mo`,
      priceYearly: `$${expertYearlyPrice} /yr`,
      wordLimit: 'Unlimited Words',
      features: expertFeatures,
      buttonTextMonthly: 'Get Started Monthly',
      buttonTextYearly: 'Get Started Yearly',
      onButtonClickMonthly: () => {
        setSelectedPrice(expertMonthlyPrice);
        setUpgradeModalOpen(true);
      },
      onButtonClickYearly: () => {
        setSelectedPrice(expertYearlyPrice);
        setUpgradeModalOpen(true);
      },
    },
  ];

  return (
    <Flex direction="column" p={{ base: '10px', md: '60px' }}>
      <Card
        bg={bgCard}
        backgroundRepeat="no-repeat"
        p="30px"
        mb="30px"
        mt="-100px"
        boxShadow="md"
      >
        <Flex direction={{ base: 'column', md: 'row' }} align="center">
          <Flex direction="column" me="auto" align="center" textAlign="center">
            <Heading color={textColor} fontSize="2xl" fontWeight="bold">
              {firstname} {lastname}
            </Heading>
            <Text
              mb="5px"
              fontSize="lg"
              color={textSecondaryColor}
              fontWeight="400"
              lineHeight="24px"
              mt="10px"
            >
              {email}
            </Text>
          </Flex>
          <Text my="auto" color={textColor} fontSize="36px" fontWeight="bold">
            ${totalPaymentAmount.toFixed(2)}
          </Text>
        </Flex>
      </Card>

      <Box mt="40px">
        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
          {pricingPlans.map((plan, index) => (
            <GridItem key={index}>
              <Card bgGradient={bgGradient} color="white" boxShadow="lg" borderRadius="md">
                <VStack spacing={4} p={5}>
                  <Heading fontSize="2xl" fontWeight="bold" textAlign="center">
                    {plan.planName}
                  </Heading>
                  <Text fontSize="lg" textAlign="center">
                    {plan.wordLimit}
                  </Text>
                  <Box textAlign="center">
                    <Text fontSize="xl" fontWeight="bold">
                      {plan.priceMonthly}
                    </Text>
                    <Button
                      mt={2}
                      w="full"
                      bg="rgba(255, 255, 255, 0.2)"
                      color="white"
                      _hover={{ bg: "rgba(255, 255, 255, 0.3)" }}
                      onClick={plan.onButtonClickMonthly}
                    >
                      {plan.buttonTextMonthly}
                    </Button>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="xl" fontWeight="bold">
                      {plan.priceYearly}
                    </Text>
                    <Button
                      mt={2}
                      w="full"
                      bg="rgba(255, 255, 255, 0.2)"
                      color="white"
                      _hover={{ bg: "rgba(255, 255, 255, 0.3)" }}
                      onClick={plan.onButtonClickYearly}
                    >
                      {plan.buttonTextYearly}
                    </Button>
                  </Box>
                  <Box>
                    {plan.features.map((feature, featureIndex) => (
                      <Text key={featureIndex} fontSize="md" textAlign="center">
                        {feature}
                      </Text>
                    ))}
                  </Box>
                </VStack>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </Box>

      <UpgradeAllPaymentmethodModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        userEmail={currentUserEmail}
        selectedPrice={selectedPrice}
      />
    </Flex>
  );
}
