'use client';

// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Link,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import illustration from '/public/img/auth/auth.png';
import { HSeparator } from '@/components/separator/Separator';
import DefaultAuth from '@/components/auth';
import React, { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import NavLink from '@/components/link/NavLink';

import { useState } from "react";
import { useRouter } from 'next/router'
import { auth } from '../../../config/firebase';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'

import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth'



function SignUp() {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.500';
  const textColorDetails = useColorModeValue('navy.700', 'gray.500');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500', fontWeight: '500' },
    { color: 'whiteAlpha.600', fontWeight: '500' },
  );

  
    const [email, setEmail] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState(false)
    const [sendPasswordResetEmail, sending] = useSendPasswordResetEmail(auth)

    const router = useRouter()

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        await sendPasswordResetEmail(email)
        setIsSuccess(true)
    }

  return (
    <DefaultAuth illustrationBackground={illustration?.src}>
      <Flex
        w="100%"
        maxW="max-content"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        justifyContent="center"
        mb="200px"
        px={{ base: '25px', md: '0px' }}
        mt="10px"
        flexDirection="column"
      >      
        <Box me="auto">
        <NavLink href="/auth/sign-in">
            <Text
                mb="36px"
                ms="4px"
                color={textColorSecondary}
                fontWeight="500"
                fontSize="sm"
                >
                &lt; Back 
            </Text>
        </NavLink>

        {isSuccess ? (
         <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          {/* <span>
            All good! If we have an account registered for that account you will
            receive a link to reset your password.
          </span> */}
          {/* <Button variant="primary" mt="10" w="100%" onClick={() => router.push('/auth/sign-in')}>
            OK
          </Button> */}
          <Text
            mb="36px"
            ms="14px"
            color={textColorSecondary}
            fontWeight="500"
            fontSize="20px"
          >
            All good! If we have an account registered for that account you will
            receive a link to reset your password.
          </Text>

          <Button
              variant="primary"
              py="20px"
              px="16px"
              fontSize="sm"
              borderRadius="45px"
              mt="20px"
              w="100%"
              h="54px"
              mb="24px"
              onClick={() => router.push('/auth/sign-in')}
            >
              OK
            </Button>
        </Flex>
      ) : (
        <>
          <Text
            color={textColor}
            fontSize={{ base: '34px', lg: '36px' }}
            mb="10px"
            fontWeight={'700'}
          >
            Forgot Password
          </Text>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="500"
            fontSize="sm"
          >
            Enter your email to reset your password !
          </Text>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          
          <FormControl>
            <FormLabel
              cursor="pointer"
              display="flex"
              ms="4px"
              htmlFor="email"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              id="email"
              variant="auth"
              fontSize="sm"
              type="email"
              placeholder="Enter your email address"
              mb="24px"
              size="lg"
              borderColor={borderColor}
              h="54px"
              fontWeight="500"
              _placeholder={{ placeholderColor }}
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />
            
            <Button
              variant="primary"
              py="20px"
              px="16px"
              fontSize="sm"
              borderRadius="45px"
              mt="20px"
              w="100%"
              h="54px"
              mb="24px"
              onClick={handleSubmit}
            >
              Send
            </Button>
          </FormControl>
        </Flex>
        </>
          )}
        </Box>
      </Flex>
    </DefaultAuth>
  );
}

export default SignUp;
