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
import { firestore, auth } from '../../../config/firebase';
import { collection, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const BuyCreditsModalStripe: React.FC<BuyCreditsModalProps> = ({ isOpen, onClose }) => {
  const currentUserEmail = auth.currentUser?.email || 'anonymous';
  const router = useRouter();
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const { success, session_id, chosenPrice } = router.query;

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

  const handleStripePayment = async (selectedPrice: number) => {
    if (!stripe) {
      console.error('Stripe is not initialized.');
      return;
    }

    const response = await fetch('/api/create-stripe-session', {
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

  useEffect(() => {
    const updateFirestoreAfterPayment = async () => {
      if (success === 'true' && session_id && chosenPrice) {
        const price = +chosenPrice;

        const processedSessionIds = JSON.parse(sessionStorage.getItem('processedSessionIds') || '[]');
        if (processedSessionIds.includes(session_id)) {
          console.log('Payment success logic already executed for this session_id, skipping...');
          return;
        }

        const tokenRef = doc(firestore, 'token', currentUserEmail);
        const tokenDoc = await getDoc(tokenRef);

        let currentTokens = 0;
        if (tokenDoc.exists()) {
          currentTokens = tokenDoc.data().tokens;
        }

        let purchasedTokens = 0;
        switch (price) {
          case 10: purchasedTokens = 1000; break;
          case 50: purchasedTokens = 5000; break;
          case 100: purchasedTokens = 10000; break;
          default: break;
        }

        await setDoc(tokenRef, { tokens: currentTokens + purchasedTokens }, { merge: true });

        const paymentHistoryCollection = collection(firestore, 'paymenthistory');
        await addDoc(paymentHistoryCollection, {
          credits: purchasedTokens,
          date: new Date().toISOString(),
          price: price,
          user: currentUserEmail,
        });

        processedSessionIds.push(session_id);
        sessionStorage.setItem('processedSessionIds', JSON.stringify(processedSessionIds));

        window.location.reload();
      }
    };

    if (router.isReady) {
      updateFirestoreAfterPayment();
    }
  }, [router.isReady, router.query, success, session_id, chosenPrice, currentUserEmail]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Buy Credits</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Button onClick={() => handleStripePayment(10)}>Buy 1000 Credits for $10</Button>
            <Button onClick={() => handleStripePayment(50)}>Buy 5000 Credits for $50</Button>
            <Button onClick={() => handleStripePayment(100)}>Buy 10000 Credits for $100</Button>
          </VStack>
        </ModalBody>
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

export default BuyCreditsModalStripe;
