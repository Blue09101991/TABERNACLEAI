'use client';
// chakra imports
import { Icon, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { MdUpgrade } from 'react-icons/md';

export function ItemContent(props: { info: string }) {
  const textColor = useColorModeValue('navy.700', 'white');
  const descColor = useColorModeValue('gray.500', 'white');
  return (
    <>
      <Flex
        justify="center"
        align="center"
        borderRadius="12px"
        minH={{ base: '60px', md: '70px' }}
        h={{ base: '60px', md: '70px' }}
        minW={{ base: '60px', md: '70px' }}
        w={{ base: '60px', md: '70px' }}
        me="14px"
        bg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
      >
        <Icon as={MdUpgrade} color="white" w={8} h={14} />
      </Flex>
      <Flex flexDirection="column">
        <Text
          fontWeight="bold"
          color={textColor}
          fontSize={{ base: 'md', md: 'md' }}
        >
          New Update: {props.info}
        </Text>
        <Flex alignItems="center">
          <Text
            fontSize={{ base: 'sm', md: 'sm' }}
            fontWeight="500"
            color={descColor}
          >
            A new update for your downloaded item is available!
          </Text>
        </Flex>
      </Flex>
    </>
  );
}
