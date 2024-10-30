'use client';
// Chakra imports
import {
  Flex,
  Box,
  FormLabel,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';

function TagsField(props: {
  label?: string;
  id?: string;
  placeholderTags?: { name: string; id: number }[];
  [x: string]: any;
}) {
  const { label, id, placeholderTags, ...rest } = props;
  let initialTags = [
    {
      name: 'Topic',
      id: 1,
    },
    {
      name: 'Number of Paragraphs',
      id: 2,
    },
    {
      name: 'Essay Type',
      id: 3,
    },
  ];
  if (placeholderTags) initialTags = placeholderTags;
  const [tags, setTags] = useState(initialTags);

  const keyPress = (e: any) => {
    if (e.keyCode === 13) {
      setTags([
        ...tags,
        {
          name: e.target.value,
          id: tags.length === 0 ? 1 : tags[tags.length - 1].id + 1,
        },
      ]);
      e.target.value = '';
    }
  };

  let borderColor = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
  let bg = useColorModeValue(
    'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
    'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
  );
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );
  return (
    <Box>
      <FormLabel
        htmlFor={id}
        display="flex"
        fontSize="md"
        color={textColor}
        letterSpacing="0px"
        fontWeight="bold"
        _hover={{ cursor: 'pointer' }}
      >
        {label}
      </FormLabel>
      <Flex
        direction="row"
        p="12px"
        wrap="wrap"
        bg="transparent"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="16px"
        _focus={{ borderColor: 'teal.300' }}
        minH="40px"
        h="stretch"
        cursor="text"
        {...rest}
      >
        {tags.map((tag, index) => {
          return (
            <Tag
              fontSize="xs"
              h="25px"
              mb="6px"
              me="6px"
              borderRadius="12px"
              variant="solid"
              bg={bg}
              key={index}
            >
              <TagLabel w="100%">{tag.name}</TagLabel>
              <TagCloseButton
                justifySelf="flex-end"
                color="white"
                onClick={() =>
                  setTags([...tags.filter((element) => element.id !== tag.id)])
                }
              />
            </Tag>
          );
        })}
        <Input
          variant="main"
          bg="transparent"
          border="none"
          p="10px"
          onKeyDown={(e) => keyPress(e)}
          fontSize="sm"
          fontWeight="500"
          _placeholder={placeholderColor}
          placeholder="Add prompt Fields"
        />
      </Flex>
    </Box>
  );
}

export default TagsField;
