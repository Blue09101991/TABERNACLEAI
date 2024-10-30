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
import PaypalModel3 from '../paypalModels/model3';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const UpgradeAllPaymentmethodModal3: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const currentUserEmail = auth.currentUser?.email || 'anonymous';

  const router = useRouter();
  const [price, setPrice] = useState<number | null>(null);
  const [isBuyCreditsModalOpen, setBuyCreditsModalOpen] = useState(false);
  const [stripe, setStripe] = useState<Stripe | null>(null);

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
        userEmail: currentUserEmail, // Pass this to the session for metadata
      }),
    });

    const session = await response.json();
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });
      if (error) console.error(error.message);
      // The Firestore update is removed from here and should be handled by the webhook
    }
  };

  useEffect(() => {
    const updateFirestoreAfterPayment = async () => {
      if (plan_success === 'true' && plan_session_id && plan_chosenPrice) {
        const price = +plan_chosenPrice;

        const processedSessionIds = JSON.parse(sessionStorage.getItem('processedSessionIds') || '[]');
        if (processedSessionIds.includes(plan_session_id)) {
          console.log('Payment success logic already executed for this session_id, skipping...');
          return;
        }

        // Your existing logic for updating Firestore
        const tokenRef = doc(firestore, 'token', currentUserEmail);
        const tokenDoc = await getDoc(tokenRef);

        let currentTokens = 0;
        if (tokenDoc.exists()) {
          currentTokens = tokenDoc.data().tokens;
          console.log(currentTokens);
        }

        let purchasedTokens = 0; // Default to 0, adjust based on price
        switch (price) {
          case 9.99: purchasedTokens = 10000; break;
          case 29.99: purchasedTokens = 25000; break;
          case 59.99: purchasedTokens = 1000000000; break;
          default: break; // Handle default case or errors
        }

        // Update Firestore with the new token count
        await setDoc(tokenRef, { tokens: currentTokens + purchasedTokens }, { merge: true });

        // Save payment history directly to Firebase's 'paymenthistory' collection
        const paymentHistoryCollection = collection(firestore, 'paymenthistory');
        await addDoc(paymentHistoryCollection, {
          credits: purchasedTokens,
          date: new Date().toISOString(),
          price: price,
          user: currentUserEmail,
        });

        processedSessionIds.push(plan_session_id);
        sessionStorage.setItem('processedSessionIds', JSON.stringify(processedSessionIds));

        window.location.reload();
      }
    };

    if (router.isReady) {
      updateFirestoreAfterPayment();
    }
  }, [router.isReady, router.query, plan_success, plan_session_id, plan_chosenPrice, currentUserEmail]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose your Pay Method</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Button onClick={() => handleStripePayment(59.99)}>Stripe</Button>
            <Button onClick={() => setBuyCreditsModalOpen(true)}>Paypal</Button>
          </VStack>
        </ModalBody>
        <PaypalModel3 isOpen={isBuyCreditsModalOpen} onClose={() => setBuyCreditsModalOpen(false)} userEmail={currentUserEmail} />
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

export default UpgradeAllPaymentmethodModal3;
