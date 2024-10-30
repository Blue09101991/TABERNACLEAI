'use client';
import Card from '@/components/card/Card';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Link,
  ListItem,
  UnorderedList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdLock } from 'react-icons/md';
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from '../../../config/firebase';
import { useRouter } from 'next/router';

function APIModal(props: { setApiKey: any; sidebar?: boolean; setApiRepeaterKey: any; }) {
  const { setApiKey, sidebar, setApiRepeaterKey } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputCode, setInputCode] = useState<string>('');
  const [inputCodeRepeater, setInputCodeRepeater] = useState<string>('');

  const textColor = useColorModeValue('navy.700', 'white');
  const grayColor = useColorModeValue('gray.500', 'gray.500');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const link = useColorModeValue('brand.500', 'white');
  const navbarIcon = useColorModeValue('gray.500', 'white');
  const toast = useToast();

  const router = useRouter();

  const userEmail = auth.currentUser?.email || null;

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  const handleRepeaterChange = (Event: any) => {
    setInputCodeRepeater(Event.target.value);
  };

  const handleApiKeyChange = (value1: string) => {
    // setApiKey(value1);

    localStorage.setItem('apiKey', value1);
    // localStorage.setItem('apiKeyRepeater', value2);

    // saveTokensToFirestore(userEmail);
  };

  // const handleApiKeyRepeaterChange = (value: string) => {
  //   console.log("Save API key has been clicked!")
  //   // setApiRepeaterKey(value);

  //   localStorage.setItem('apiKeyRepeater', value);
  // };

  const saveTokensToFirestore = async (email: string | null) => {
    if (!email) return;

    // Reference to the 'token' collection and specific document for the userEmail in Firestore
    const tokensCollectionRef = collection(firestore, 'token');
    const userDocRef = doc(tokensCollectionRef, email);

    // Check if the document exists
    const docSnap = await getDoc(userDocRef);

    const tokenData = {
      userEmail: email,
      tokens: 5000,
      date: new Date()  // Saving the current date and time
    };

    if (docSnap.exists()) {
      // If the document exists, update it
      await updateDoc(userDocRef, tokenData);
    } else {
      // If the document doesn't exist, create a new one
      await setDoc(userDocRef, tokenData);
    }
  };

  const upgradeFunction = () => {
    router.push('/my-plan');
  };


  return (
    <>
      {sidebar ? (
        <>
          <Button
            onClick={onOpen}
            display="flex"
            variant="api"
            fontSize={'sm'}
            fontWeight="600"
            borderRadius={'45px'}
            mt="8px"
            minH="40px"
          // disabled
          >
            Set API Key
          </Button>
          

          <Button
          onClick={upgradeFunction}
          display="flex"
          variant="api"
          fontSize={'sm'}
          fontWeight="600"
          borderRadius={'45px'}
          mt="8px"
          minH="40px"
          // disabled
          >
            Upgrade
          </Button>
        </>
      ) : (
        <Button
          onClick={onOpen}
          minW="max-content !important"
          p="0px"
          me="10px"
          _hover={{ bg: 'none' }}
          _focus={{ bg: 'none' }}
          _selected={{ bg: 'none' }}
          bg="none !important"
        // disabled
        >
          <Icon w="18px" h="18px" as={MdLock} color={navbarIcon} />
        </Button>
      )}
{/* 
      <Button
          onClick={upgradeFunction}
          display="flex"
          variant="api"
          fontSize={'sm'}
          fontWeight="600"
          borderRadius={'45px'}
          mt="8px"
          minH="40px"
        // disabled
        >
          Upgrade
        </Button> */}

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="none" boxShadow="none">
          <Card textAlign={'center'}>
            <ModalHeader
              fontSize="22px"
              fontWeight={'700'}
              mx="auto"
              textAlign={'center'}
              color={textColor}
            >
              Enter your API Keys
            </ModalHeader>
            <ModalCloseButton _focus={{ boxShadow: 'none' }} />
            <ModalBody p="0px">
              <Text
                color={grayColor}
                fontWeight="500"
                fontSize="md"
                lineHeight="28px"
                mb="22px"
              >
                You need an OpenAI Key to use ThoughtFormsAI's features.
              </Text>
              <Flex mb="20px">
                <Input
                  h="100%"
                  border="1px solid"
                  borderColor={inputBorder}
                  borderRadius="45px"
                  p="15px 20px"
                  me="10px"
                  fontSize="sm"
                  fontWeight="500"
                  _focus={{ borderColor: 'none' }}
                  _placeholder={{ color: 'gray.500' }}
                  color={inputColor}
                  placeholder="OpenAI API KEY"
                  onChange={handleChange}
                  value={inputCode}
                />

              </Flex>
              <Flex mb="20px">
                {/* <Input
                  h="100%"
                  border="1px solid"
                  borderColor={inputBorder}
                  borderRadius="45px"
                  p="15px 20px"
                  me="10px"
                  fontSize="sm"
                  fontWeight="500"
                  _focus={{ borderColor: 'none' }}
                  _placeholder={{ color: 'gray.500' }}
                  color={inputColor}
                  placeholder="RepeaterAI API KEY"
                  onChange={handleRepeaterChange}
                  value={inputCodeRepeater}
                /> */}
                {/* <Button
                  variant="chakraLinear"
                  py="20px"
                  px="16px"
                  fontSize="sm"
                  borderRadius="45px"
                  ms="auto"
                  mb={{ base: '20px', md: '0px' }}
                  w={{ base: '300px', md: '180px' }}
                  h="54px"
                  onClick={() => {
                    handleApiKeyRepeaterChange(inputCodeRepeater)
                  }}
                >
                  Save API Key
                </Button> */}
              </Flex>
              <Button
                variant="chakraLinear"
                py="20px"
                px="16px"
                fontSize="sm"
                borderRadius="45px"
                ms="auto"
                mb={{ base: '20px', md: '0px' }}
                w={{ base: '300px', md: '180px' }}
                h="54px"
                onClick={async () => {
                  // if (inputCode?.includes('sk-')) {
                  handleApiKeyChange(inputCode);
                  try {
                    await saveTokensToFirestore(userEmail);
                    window.location.reload();
                  } catch (error) {
                    const errMsg = (error as Error).message;  // Type assertion
                    toast({
                      title: 'Error saving data to Firestore',
                      description: errMsg,
                      status: 'error',
                      isClosable: true,
                    });
                  }
                  // } else {
                  // toast({
                  //   title: !inputCode?.includes('sk-')
                  //     ? `Invalid API key. Please make sure your API key is still working properly.`
                  //     : 'Please add your API key!',
                  //   position: 'top',
                  //   status: !inputCode?.includes('sk-')
                  //     ? 'error'
                  //     : !inputCode
                  //       ? 'warning'
                  //       : 'error',
                  //   isClosable: true,
                  // });
                  // }
                }}
              >
                Save API Key
              </Button>
              <div style={{ display: "", marginTop: "30px" }}>
                <Link
                  color={link}
                  fontSize="sm"
                  href="https://platform.openai.com/account/api-keys"
                  textDecoration="underline !important"
                  fontWeight="600"
                >
                  Get your API key from Open AI Dashboard
                </Link>
                {/* <Link
                  color={link}
                  fontSize="sm"
                  href="https://www.repeater.ai/"
                  textDecoration="underline !important"
                  fontWeight="600"
                >
                  Get your API key from RepeaterAI Dashboard
                </Link> */}
              </div>
              <Accordion allowToggle w="100%" my="16px">
                <AccordionItem border="none">
                  <AccordionButton
                    borderBottom="0px solid"
                    maxW="max-content"
                    mx="auto"
                    _hover={{ border: '0px solid', bg: 'none' }}
                    _focus={{ border: '0px solid', bg: 'none' }}
                  >
                    <Box flex="1" textAlign="left">
                      <Text
                        color={textColor}
                        fontWeight="700"
                        fontSize={{ sm: 'md', lg: 'md' }}
                      >
                        Your API Key is not working?
                      </Text>
                    </Box>
                    <AccordionIcon color={textColor} />
                  </AccordionButton>
                  <AccordionPanel p="18px 0px 10px 0px">
                    <UnorderedList p="5px">
                      <ListItem
                        mb="26px"
                        color={grayColor}
                        fontSize=",d"
                        fontWeight="500"
                      >
                        Make sure you have an{' '}
                        <Link
                          textDecoration="underline"
                          fontSize=",d"
                          href="https://platform.openai.com/account/"
                          fontWeight="500"
                          color={grayColor}
                        >
                          OpenAI account
                        </Link>{' '}
                        and a valid API key to use ChatGPT. We don't sell API
                        keys.
                      </ListItem>
                      <ListItem
                        color={grayColor}
                        fontSize="md"
                        lineHeight="28px"
                        fontWeight="500"
                      >
                        Make sure you have your billing info added in{' '}
                        <Link
                          textDecoration="underline"
                          fontSize="md"
                          lineHeight="28px"
                          href="https://platform.openai.com/account/billing/overview"
                          fontWeight="500"
                          color={grayColor}
                        >
                          OpenAI Billing
                        </Link>{' '}
                        page. Without billing info, your API key will not work.
                      </ListItem>
                    </UnorderedList>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              <Text
                color={grayColor}
                fontWeight="500"
                fontSize="sm"
                mb="42px"
                mx="30px"
              >
                After you set API keys, you will get 5000 credits for usable ThoughtFormsAI Tools.
              </Text>
            </ModalBody>
          </Card>
        </ModalContent>
      </Modal>
    </>
  );
}

export default APIModal;
