import ReactMarkdown from 'react-markdown';
import { Flex, useColorModeValue } from '@chakra-ui/react';
export default function MessageBox(props: { output: string }) {
  const { output } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  return (
    <Flex
      w="100%"
      maxW="100%"
      flexWrap="wrap"
      p="15px 20px"
      border="1px solid"
      color={textColor}
      borderColor={borderColor}
      borderRadius="10px"
      minH="564px"
      fontSize="md"
      fontWeight="500"
      mb="28px"
    >
      <ReactMarkdown className="font-medium w-[100%]">
        {output ? output : 'Your generated response will appear here...'}
      </ReactMarkdown>
    </Flex>
  );
}
