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
  Text
} from '@chakra-ui/react';
import { firestore, auth } from '../../../../config/firebase';
import { collection, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  price: number | null;
}

const PaypalModel1: React.FC<BuyCreditsModalProps> = ({ isOpen, onClose, userEmail, price }) => {
  const [showPayPal, setShowPayPal] = useState(false);
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const currentUserEmail = auth.currentUser?.email || 'anonymous';

  useEffect(() => {
    const fetchPaypalClientId = async () => {
      const docRef = doc(firestore, 'price', 'paymentmethod');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setPaypalClientId(data.PAYPAL_CLIENT_ID || null);
      } else {
        console.error('No such document!');
      }
    };

    fetchPaypalClientId();
  }, []);

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

  const handlePaymentComplete = async (details: any) => {
    const tokenRef = doc(firestore, 'token', currentUserEmail);
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
      user: currentUserEmail
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Buy Credits</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {showPayPal ? (
              <>
                {paypalClientId && (
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order?.create({
                          purchase_units: [{
                            amount: {
                              value: price ? price.toFixed(2) : '0.00'
                            }
                          }]
                        });
                      }}
                      onApprove={(data, actions) => {
                        if (actions.order) {
                          return actions.order.capture().then((details: any) => {
                            handlePaymentComplete(details);
                          });
                        } else {
                          return Promise.reject(new Error('Order action not available.'));
                        }
                      }}
                    />
                  </PayPalScriptProvider>
                )}
                <Button mt={4} onClick={() => setShowPayPal(false)}>Back</Button>
              </>
            ) : (
              <Button onClick={() => { setShowPayPal(true); }}>Connect to Paypal</Button>
            )}
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

export default PaypalModel1;
