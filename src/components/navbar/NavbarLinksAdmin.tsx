'use client';
// Chakra Imports
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useState, useRef, useEffect } from 'react';
import { SearchBar } from '@/components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from '@/components/sidebar/Sidebar';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { MdInfoOutline } from 'react-icons/md';
import APIModal from '@/components/apiModal';
import NavLink from '../link/NavLink';
import routes from '@/routes';
import { useRouter } from 'next/router'
import { useAuth } from '../../../constants/authcontext';
import { auth } from '../../../config/firebase';
// import { useAuth } from "@/constants/authcontext";

import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
// import { getFirestore, collection, addDoc } from "firebase/firestore";
// import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, Firestore } from "firebase/firestore";

import { getFirestore, collection, query, where, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";


export default function HeaderLinks(props: {
  secondary: boolean;
  setApiKey: any;
  setApiRepeaterKey: any;
}) {
  const { secondary, setApiKey, setApiRepeaterKey } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const [username, setUsername] = useState<string>('');
  const [shortname, setShortName] = useState<string>('US');

  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.500', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '0px 41px 75px #081132',
  );
  const buttonBg = useColorModeValue('transparent', 'navy.800');
  const hoverButton = useColorModeValue(
    { bg: 'gray.100' },
    { bg: 'whiteAlpha.100' },
  );
  const activeButton = useColorModeValue(
    { bg: 'gray.200' },
    { bg: 'whiteAlpha.200' },
  );

  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchFullName = async () => {
      if (auth.currentUser) {
        const db = getFirestore();
        const q = query(collection(db, "users"), where("email", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docSnapshot) => {
          const userData = docSnapshot.data();
          const fname = userData.first_name;
          const lname = userData.last_name;
          const fetchedFullName = `${fname[0]} ${lname[0]}`;
          setShortName(fetchedFullName);
        });
      }
    };

    fetchFullName();
  }, [auth.currentUser]);

  useEffect(() => {
    const fetchFullName = async () => {
      if (auth.currentUser) {
        const db = getFirestore();
        const q = query(collection(db, "users"), where("email", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docSnapshot) => {
          const userData = docSnapshot.data();
          const fetchedFullName = `${userData.first_name} ${userData.last_name}`;
          setUsername(userData.username);
        });
      }
    };

    fetchFullName();
  }, [auth.currentUser]);

  return (
    <Flex
      zIndex="100"
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <SearchBar
        mb={() => {
          if (secondary) {
            return { base: '10px', md: 'unset' };
          }
          return 'unset';
        }}
        me="10px"
        borderRadius="30px"
      />
      <SidebarResponsive routes={routes()} />
      <APIModal setApiKey={setApiKey} setApiRepeaterKey={setApiRepeaterKey} />

      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>
      <Menu>
        <MenuButton p="0px" style={{ position: 'relative' }}>
          <Box
            _hover={{ cursor: 'pointer' }}
            color="white"
            bg="#11047A"
            w="40px"
            h="40px"
            borderRadius={'50%'}
          />
          <Center top={0} left={0} position={'absolute'} w={'100%'} h={'100%'}>
            <Text fontSize={'xs'} fontWeight="bold" color={'white'}>
              {shortname}
            </Text>
          </Center>
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; Hey, {username || "user"}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <NavLink href="/settings">
              <MenuItem
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                color={textColor}
                borderRadius="8px"
                px="14px"
              >
                <Text fontWeight="500" fontSize="sm">
                  Profile Settings
                </Text>
              </MenuItem>
            </NavLink>
            {/* <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color={textColor}
              borderRadius="8px"
              px="14px"
            >
              <Text fontWeight="500" fontSize="sm">
                Newsletter Settings
              </Text>
            </MenuItem> */}
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color="red.400"
              borderRadius="8px"
              px="14px"
            >
              <Text fontWeight="500" fontSize="sm" onClick={() => {
                logout()
                router.push('/auth/sign-in')
              }}>
                Log out
              </Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}
