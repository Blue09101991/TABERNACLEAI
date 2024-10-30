'use client';
// Chakra imports
import {
  Flex,
  useColorModeValue,
  Text,
  Icon,
  Checkbox,
} from '@chakra-ui/react';
import Card from '@/components/card/Card';
import { IoMdTime } from 'react-icons/io';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import TransparentMenu from '@/components/menu/TransparentMenu';

export default function Default(props: {
  title: string;
  time: string;
  admin?: boolean;
}) {
  const { title, time } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  const gray = useColorModeValue('gray.500', 'white');

  return (
    <Card py="32px" px="32px">
      <Flex
        my="auto"
        h="100%"
        direction={'column'}
        align={{ base: 'center', xl: 'start' }}
        justify={{ base: 'center', xl: 'center' }}
      >
        <Flex align="center" justify={'space-between'} w="100%" mb="60px">
          <Text fontSize="lg" color={textColor} fontWeight="700">
            {title}
          </Text>
          <Checkbox colorScheme={'brand'} />
        </Flex>
        <Flex w="100%" align="center" justify="space-between">
          <Flex align="center">
            <Icon w="18px" h="18px" me="10px" as={IoMdTime} color={gray} />
            <Text fontSize="sm" color={gray} fontWeight="500">
              {time}
            </Text>
          </Flex>
          <TransparentMenu
            display="flex"
            alignItems="center"
            justifyContent="center"
            maxH="max-content"
            icon={<Icon
              w="24px"
              h="24px"
              mb="-5px"
              as={IoEllipsisHorizontal}
              color={gray}
              fill={gray} />} documentID={''} title={''} onDataChange={function () {
                throw new Error('Function not implemented.');
              }} />
        </Flex>
      </Flex>
    </Card>
  );
}
