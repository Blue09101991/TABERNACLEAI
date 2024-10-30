'use client';
// Chakra imports
import {
  Box,
  Button,
  Flex,
  useColorModeValue,
  Text,
  Icon,
} from '@chakra-ui/react';
import Card from '@/components/card/Card';
import { MdEdit } from 'react-icons/md';
import NavLink from '../link/NavLink';

export default function Default(props: {
  illustration: string | JSX.Element;
  name: string;
  description: string;
  link: string;
  edit?: string;
  action?: any;
  admin?: boolean;
}) {
  const { illustration, name, description, link, edit, admin } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  const gray = useColorModeValue('gray.500', 'white');

  return (
    <NavLink href={link}>
      <Card h="100%" py="24px" px="24px">
        <Flex
          my="auto"
          h="100%"
          direction={'column'}
          align={{ base: 'start', xl: 'start' }}
          justify={{ base: 'center', xl: 'center' }}
        >
          <Flex align="start" w="100%" mb="30px">
            <Text fontSize="34px" lineHeight={'120%'}>
              {illustration}
            </Text>
            {admin ? (
              <Flex ms="auto">
                <NavLink href={edit ? edit : '/admin/edit-template'}>
                  <Button
                    w="24px"
                    h="24px"
                    _hover={{}}
                    _focus={{}}
                    _active={{}}
                    bg="none"
                  >
                    <Icon w="24px" h="24px" as={MdEdit} color={gray} />
                  </Button>
                </NavLink>
              </Flex>
            ) : null}
          </Flex>
          <Box>
            <Text fontSize="lg" color={textColor} fontWeight="700" mb="8px">
              {name}
            </Text>
            <Text fontSize="sm" color={gray} fontWeight="500">
              {description}
            </Text>
          </Box>
        </Flex>
      </Card>
    </NavLink>
  );
}
