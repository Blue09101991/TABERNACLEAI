'use client';
// chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import NavLink from '@/components/link/NavLink';
import React, { useState, useRef, useEffect } from 'react';
//   Custom components
import avatar4 from '/public/img/avatars/avatar4.png';
import { NextAvatar } from '@/components/image/Avatar';
import APIModal from '@/components/apiModal';
import Brand from '@/components/sidebar/components/Brand';
import Links from '@/components/sidebar/components/Links';
import SidebarCard from '@/components/sidebar/components/SidebarCard';
import { RoundedChart } from '@/components/icons/Icons';
import { PropsWithChildren } from 'react';
import { IRoute } from '@/types/navigation';
import { IoMdPerson } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import { LuHistory } from 'react-icons/lu';
import { MdOutlineManageAccounts, MdOutlineSettings } from 'react-icons/md';

import routes from '@/routes';
import { useRouter } from 'next/router'
import { useAuth } from '../../../../constants/authcontext'
import { getFirestore, collection, query, where, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import { auth } from '../../../../config/firebase';

// FUNCTIONS

interface SidebarContent extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

function SidebarContent(props: SidebarContent) {
  const { routes, setApiKey, setApiRepeaterKey } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const bgColor = useColorModeValue('white', 'navy.700');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(12, 44, 55, 0.18)',
  );
  const iconColor = useColorModeValue('navy.700', 'white');
  const shadowPillBar = useColorModeValue(
    '4px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'none',
  );
  const gray = useColorModeValue('gray.500', 'white');
  // SIDEBAR

  const { user, logout } = useAuth()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>('');

  useEffect(() => {
    const fetchAvatar = async () => {
      if (auth.currentUser) {
        const db = getFirestore();
        const q = query(collection(db, "profile"), where("email", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // Assuming the field in Firestore is named 'avatarURL'
          const avatarURL = doc.data().avatarURL;
          setSelectedImage(avatarURL);
        });
      }
    };
    fetchAvatar();
  }, []);

  useEffect(() => {
    const fetchFullName = async () => {
      if (auth.currentUser) {
        const db = getFirestore();
        const q = query(collection(db, "users"), where("email", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docSnapshot) => {
          const userData = docSnapshot.data();
          const fetchedFullName = `${userData.first_name} ${userData.last_name}`;
          setFullName(fetchedFullName);
        });
      }
    };

    fetchFullName();
  }, [auth.currentUser]);


  return (

    <Flex
      direction="column"
      height="100%"
      pt="20px"
      pb="26px"
      borderRadius="30px"
      maxW="285px"
      px="20px"
    >
      <Brand />
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="0px" pe={{ md: '0px', '2xl': '0px' }}>
          <Links routes={routes} />
        </Box>
      </Stack>

      <Box mt="50px" width={'100%'} display={'flex'} justifyContent={'center'}>
        <SidebarCard />
      </Box>
      <APIModal setApiKey={setApiKey} setApiRepeaterKey={setApiRepeaterKey} sidebar={true} />
      <Flex
        mt="8px"
        justifyContent="center"
        alignItems="center"
        boxShadow={shadowPillBar}
        borderRadius="30px"
        p="14px"
      >
        <NextAvatar h="34px" w="34px" src={selectedImage || avatar4} me="10px" />
        <Text color={textColor} fontSize="xs" fontWeight="600" me="10px">
          {fullName || "User"}
        </Text>
        <Menu>
          <MenuButton
            as={Button}
            variant="transparent"
            aria-label=""
            border="1px solid"
            borderColor={borderColor}
            borderRadius="full"
            w="34px"
            h="34px"
            px="0px"
            p="0px"
            minW="34px"
            me="10px"
            justifyContent={'center'}
            alignItems="center"
            color={iconColor}
          >
            <Flex align="center" justifyContent="center">
              <Icon
                as={MdOutlineSettings}
                width="18px"
                height="18px"
                color="inherit"
              />
            </Flex>
          </MenuButton>
          <MenuList
            ms="-20px"
            py="25px"
            ps="20px"
            pe="80px"
            w="246px"
            borderRadius="16px"
            transform="translate(-19px, -62px)!important"
            border="0px"
            boxShadow={shadow}
            bg={bgColor}
          // mb="-30px"
          >
            <Box mb="30px">
              <NavLink href="/settings">
                <Flex align="center">
                  <Icon
                    as={MdOutlineManageAccounts}
                    width="24px"
                    height="24px"
                    color={gray}
                    me="12px"
                  />
                  <Text color={gray} fontWeight="500" fontSize="sm">
                    Profile Settings
                  </Text>
                </Flex>
              </NavLink>
            </Box>
            <Box mb="30px">
              <NavLink href="/history">
                <Flex align="center">
                  <Icon
                    as={LuHistory}
                    width="24px"
                    height="24px"
                    color={gray}
                    me="12px"
                  />
                  <Text color={gray} fontWeight="500" fontSize="sm">
                    History
                  </Text>
                </Flex>
              </NavLink>
            </Box>
            <Box mb="30px">
              <NavLink href="/usage">
                <Flex align="center">
                  <Icon
                    as={RoundedChart}
                    width="24px"
                    height="24px"
                    color={gray}
                    me="12px"
                  />
                  <Text color={gray} fontWeight="500" fontSize="sm">
                    Usage
                  </Text>
                </Flex>
              </NavLink>
            </Box>
            <Box>
              <NavLink href="/my-plan">
                <Flex align="center">
                  <Icon
                    as={IoMdPerson}
                    width="24px"
                    height="24px"
                    color={gray}
                    me="12px"
                  />
                  <Text color={gray} fontWeight="500" fontSize="sm">
                    My Plan
                  </Text>
                </Flex>
              </NavLink>
            </Box>
          </MenuList>
        </Menu>
        <Button
          variant="transparent"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="full"
          w="34px"
          h="34px"
          px="0px"
          minW="34px"
          justifyContent={'center'}
          alignItems="center"
          onClick={() => {
            logout()
            router.push('/auth/sign-in')
          }}
        >
          <Icon as={FiLogOut} width="16px" height="16px" color="inherit" />
        </Button>
      </Flex>
    </Flex>
  );
}

export default SidebarContent;
