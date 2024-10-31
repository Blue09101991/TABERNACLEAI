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
import { firestore, auth } from '../../../config/firebase';
import { collection, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [showPayPal, setShowPayPal] = useState(false);
  const currentUserEmail = auth.currentUser?.email || 'anonymous';
  const [price, setPrice] = useState<number | null>(null);
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);

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

  const handlePaymentComplete = async (details: any) => {
    // Fetch current tokens from Firestore
    const tokenRef = doc(firestore, 'token', currentUserEmail);
    const tokenDoc = await getDoc(tokenRef);

    let currentTokens = 0;
    if (tokenDoc.exists()) {
      currentTokens = tokenDoc.data().tokens;
    }

    // Determine the number of credits purchased based on the price
    let purchasedTokens;
    switch (price) {
      case 10:
        purchasedTokens = 1000;
        break;
      case 50:
        purchasedTokens = 5000;
        break;
      case 100:
        purchasedTokens = 10000;
        break;
      default:
        purchasedTokens = 0;
        break;
    }

    // Add purchased tokens to current tokens
    const updatedTokens = currentTokens + purchasedTokens;

    // Update Firestore with the new token count
    await setDoc(tokenRef, { tokens: updatedTokens }, { merge: true });

    // Save payment history to Firebase's 'paymenthistory' collection
    const paymentHistoryCollection = collection(firestore, 'paymenthistory');
    await addDoc(paymentHistoryCollection, {
      credits: purchasedTokens,
      date: new Date().toISOString(),
      price: price,  // the paid price
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
                <PayPalScriptProvider options={{ clientId: paypalClientId || '' }}>
                <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order?.create({
                        purchase_units: [{
                          amount: {
                            currency_code: "USD",  // Specify the currency code
                            value: (amount && (amount / 100).toString()) || '0'  // Convert cents to dollars and ensure it's a string
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
                <Button mt={4} onClick={() => setShowPayPal(false)}>Back</Button>
              </>
            ) : (
              <>
                <Button onClick={() => { setAmount(1000); setPrice(10); setShowPayPal(true); }}>Buy 1000 Credits for $10</Button>
                <Button onClick={() => { setAmount(5000); setPrice(50); setShowPayPal(true); }}>Buy 5000 Credits for $50</Button>
                <Button onClick={() => { setAmount(10000); setPrice(100); setShowPayPal(true); }}>Buy 10000 Credits for $100</Button>
              </>
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

export default BuyCreditsModal;
