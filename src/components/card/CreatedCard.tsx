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
// import NavLink from '../link/NavLink';
import { IoMdTime } from 'react-icons/io';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import TransparentMenu from '@/components/menu/TransparentMenu';

export default function Default(props: {
    illustration: string | JSX.Element;
    name: string;
    description: string;
    link: string;
    edit?: string;
    action?: any;
    admin?: boolean;
    time?: string;
    documentID?: string;
    title?: string;
    prompt?: string;
    onDataChange?: (() => any) | undefined;
}) {
    const { illustration, name, description, link, edit, admin, time, documentID, title, prompt } = props;
    const textColor = useColorModeValue('navy.700', 'white');
    const gray = useColorModeValue('gray.500', 'white');
    const { onDataChange = () => { } } = props;

    function truncateText(text: string, maxLength: number) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        } else {
            return text;
        }
    }

    return (
        // <NavLink href={link}>
        <Card h="100%" py="32px" px="32px">
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
                            {/* <NavLink href={edit ? edit : '/admin/edit-template'}> */}
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
                            {/* </NavLink> */}
                        </Flex>
                    ) : null}
                </Flex>
                <Box>
                    <Text fontSize="lg" color={textColor} fontWeight="700" mb="8px">
                        {name}
                    </Text>
                    <Text fontSize="sm" color={gray} fontWeight="500">
                        {truncateText(description, 50)}
                    </Text>
                </Box>
                {/* <Box> */}
                <Flex w="100%" align="center" justify="space-between" style={{ marginTop: "20px" }}>
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
                        icon={
                            <Icon
                                w="24px"
                                h="24px"
                                mb="-5px"
                                as={IoEllipsisHorizontal}
                                color={gray}
                                fill={gray}
                            />
                        }
                        documentID={documentID || ''}
                        title={title || ''}
                        prompt={prompt || ''}
                        onDataChange={onDataChange}
                    />
                </Flex>
                {/* </Box> */}

            </Flex>
        </Card>
        // </NavLink>
    );
}
