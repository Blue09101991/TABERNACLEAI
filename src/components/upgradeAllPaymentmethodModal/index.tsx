import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  Text,
} from '@chakra-ui/react';
import { firestore } from '../../../config/firebase';
import { collection, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import PaypalModel1 from '../paypalModels/model1';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  selectedPrice: number | null;
}

const UpgradeAllPaymentmethodModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, userEmail, selectedPrice }) => {
  const router = useRouter();
  const [isBuyCreditsModalOpen, setBuyCreditsModalOpen] = useState(false);
  const [stripe, setStripe] = useState<Stripe | null>(null);

  const fetchPlanPrices = async () => {
    const monthlyDocRef = doc(firestore, 'price', 'monthly');
    const yearlyDocRef = doc(firestore, 'price', 'yearly');

    const [monthlyDocSnap, yearlyDocSnap] = await Promise.all([getDoc(monthlyDocRef), getDoc(yearlyDocRef)]);

    if (!monthlyDocSnap.exists() || !yearlyDocSnap.exists()) {
      console.error('No such document!');
      return null;
    }

    return {
      monthly: monthlyDocSnap.data(),
      yearly: yearlyDocSnap.data(),
    };
  };

  const getPurchasedTokens = async (price: number | null) => {
    if (!price) return 0;

    const planPrices = await fetchPlanPrices();
    if (!planPrices) return 0;

    const { monthly, yearly } = planPrices;

    let purchasedTokens = 0;
    switch (price) {
      case monthly.regular:
        purchasedTokens = monthly.regularCredits;
        break;
      case monthly.pro:
        purchasedTokens = monthly.proCredits;
        break;
      case monthly.expert:
        purchasedTokens = monthly.expertCredits;
        break;
      case yearly.regular:
        purchasedTokens = yearly.regularCredits;
        break;
      case yearly.pro:
        purchasedTokens = yearly.proCredits;
        break;
      case yearly.expert:
        purchasedTokens = yearly.expertCredits;
        break;
      default:
        break;
    }

    return purchasedTokens;
  };

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

  useEffect(() => {
    fetchStripeKeyAndInit();
  }, []);

  const { plan_success, plan_session_id, plan_chosenPrice } = router.query;

  const handleStripePayment = async () => {
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
        userEmail,
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

  useEffect(() => {
    const updateFirestoreAfterPayment = async () => {
      if (plan_success === 'true' && plan_session_id && plan_chosenPrice) {
        const price =+ plan_chosenPrice;

        const processedSessionIds = JSON.parse(sessionStorage.getItem('processedSessionIds') || '[]');
        if (processedSessionIds.includes(plan_session_id)) {
          console.log('Payment success logic already executed for this session_id, skipping...');
          return;
        }

        const tokenRef = doc(firestore, 'token', userEmail);
        const tokenDoc = await getDoc(tokenRef);

        let currentTokens = 0;
        if (tokenDoc.exists()) {
          currentTokens = tokenDoc.data().tokens;
        }

        const purchasedTokens = await getPurchasedTokens(price);
        const updatedTokens = currentTokens + purchasedTokens;

        await setDoc(tokenRef, { tokens: updatedTokens }, { merge: true });

        const paymentHistoryCollection = collection(firestore, 'paymenthistory');
        await addDoc(paymentHistoryCollection, {
          credits: purchasedTokens,
          date: new Date().toISOString(),
          price: price,
          user: userEmail
        });

        processedSessionIds.push(plan_session_id);
        sessionStorage.setItem('processedSessionIds', JSON.stringify(processedSessionIds));

        window.location.reload();
      }
    };

    if (router.isReady) {
      updateFirestoreAfterPayment();
    }
  }, [router.isReady, router.query, plan_success, plan_session_id]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose your Payment Method</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Button onClick={handleStripePayment}>Stripe</Button>
            <Button onClick={() => setBuyCreditsModalOpen(true)}>Paypal</Button>
          </VStack>
        </ModalBody>
        <PaypalModel1 isOpen={isBuyCreditsModalOpen} onClose={() => setBuyCreditsModalOpen(false)} userEmail={userEmail} price={selectedPrice} />
        <ModalFooter justifyContent="center">
          <Text fontSize="sm" color="gray.500">
            Purchasing credits allows you to continue using our platform.
            Please select a credit pack above to proceed.
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpgradeAllPaymentmethodModal;
