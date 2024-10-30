'use client';
// Chakra imports
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useColorModeValue,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import {
  MdOutlinePerson,
  MdOutlineCardTravel,
  MdOutlineLightbulb,
  MdOutlineSettings,
  MdOutlineRestoreFromTrash
} from 'react-icons/md';

import React from 'react';
import { useRouter } from 'next/router';
import { auth, firestore } from '../../../config/firebase';
import { deleteDoc, doc } from 'firebase/firestore';

export default function Banner(props: {
  icon: JSX.Element | string;
  [x: string]: any;
  documentID: string;
  title: string;
  onDataChange: () => any;
}) {
  const { icon, ...rest } = props;
  const router = useRouter();

  // Ellipsis modals
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();

  // Chakra color mode

  const textColor = useColorModeValue('gray.500', 'white');
  const textHover = useColorModeValue(
    { color: 'navy.700', bg: 'unset' },
    { color: 'gray.500', bg: 'unset' },
  );
  const bgList = useColorModeValue('white', 'whiteAlpha.100');
  const bgShadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'unset',
  );

  const handlePageClick = () => {
    router.push(`/created-template?templateId=${props.documentID}&title=${encodeURIComponent(props.title)}`);
  };

  const handleEditClick = () => {
    router.push(`/new-template?id=${props.documentID}`);
  };
  // Delete current user account
  const handleDeleteClick = async () => {
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const documentRef = doc(firestore, `myproject/${user.email}/newtemplate/${props.documentID}`);
        await deleteDoc(documentRef);
        // Handle any post-deletion logic, such as showing a success message or redirecting
        props.onDataChange();
      } else {
        console.error('No authenticated user found');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };


  return (
    <Menu isOpen={isOpen1} onClose={onClose1}>
      <MenuButton {...rest} onClick={onOpen1}>
        {icon}
      </MenuButton>
      <MenuList
        w="150px"
        minW="unset"
        maxW="150px !important"
        border="transparent"
        backdropFilter="blur(63px)"
        bg={bgList}
        boxShadow={bgShadow}
        borderRadius="20px"
        p="15px"
      >
        <MenuItem
          transition="0.2s linear"
          color={textColor}
          _hover={textHover}
          p="0px"
          borderRadius="8px"
          _active={{
            bg: 'transparent',
          }}
          _focus={{
            bg: 'transparent',
          }}
          mb="10px"
          onClick={handlePageClick}
        >
          <Flex align="center">
            <Icon as={MdOutlinePerson} h="16px" w="16px" me="8px" />
            <Text fontSize="sm" fontWeight="400">
              Page
            </Text>
          </Flex>
        </MenuItem>
        {/* <MenuItem
          transition="0.2s linear"
          p="0px"
          borderRadius="8px"
          color={textColor}
          _hover={textHover}
          _active={{
            bg: 'transparent',
          }}
          _focus={{
            bg: 'transparent',
          }}
          mb="10px"
          onClick={handleEditClick}
        >
          <Flex align="center">
            <Icon as={MdOutlineSettings} h="16px" w="16px" me="8px" />
            <Text fontSize="sm" fontWeight="400">
              Edit
            </Text>
          </Flex>
        </MenuItem> */}
        {/* <MenuItem
          transition="0.2s linear"
          p="0px"
          borderRadius="8px"
          color={textColor}
          _hover={textHover}
          _active={{
            bg: 'transparent',
          }}
          _focus={{
            bg: 'transparent',
          }}
          mb="10px"
        >
          <Flex align="center">
            <Icon as={MdOutlineLightbulb} h="16px" w="16px" me="8px" />
            <Text fontSize="sm" fontWeight="400">
              Panel 3
            </Text>
          </Flex>
        </MenuItem> */}
        <MenuItem
          transition="0.2s linear"
          color={textColor}
          _hover={textHover}
          p="0px"
          borderRadius="8px"
          _active={{
            bg: 'transparent',
          }}
          _focus={{
            bg: 'transparent',
          }}
          onClick={handleDeleteClick}
        >
          <Flex align="center">
            <Icon as={MdOutlineRestoreFromTrash} h="16px" w="16px" me="8px" color="red" />
            <Text fontSize="sm" fontWeight="400" color="red">
              Delete
            </Text>
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
