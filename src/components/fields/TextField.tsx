'use client';
// Chakra imports
import {
  Flex,
  FormLabel,
  Textarea,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Default(props: {
  id?: string;
  label?: string;
  extra?: string;
  placeholder?: string;
  [x: string]: any;
}) {
  const { mb, id, label, extra, placeholder, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('navy.700', 'white');
  const bgPrimary = useColorModeValue('transparent', 'navy.800');
  const borderPrimary = useColorModeValue(
    'secondaryGray.100',
    'whiteAlpha.100',
  );
  const placeholderColor = useColorModeValue(
    { color: 'gray.500', fontSize: '14px' },
    { color: 'whiteAlpha.600', fontSize: '14px' },
  );
  return (
    <Flex direction="column" mb={mb ? mb : '30px'}>
      <FormLabel
        display="flex"
        ms="10px"
        htmlFor={id}
        fontSize="sm"
        color={textColorPrimary}
        fontWeight="bold"
        _hover={{ cursor: 'pointer' }}
      >
        {label}
        <Text fontSize="sm" fontWeight="normal" ms="2px">
          {extra}
        </Text>
      </FormLabel>
      <Textarea
        id={id}
        placeholder={placeholder}
        _placeholder={placeholderColor}
        h="44px"
        maxH="44px"
        color={textColorPrimary}
        fontSize="sm"
        bg={bgPrimary}
        fontWeight="500"
        border="1px solid "
        borderColor={borderPrimary}
        borderRadius="16px"
        pt="12px"
        {...rest}
      />
    </Flex>
  );
}
