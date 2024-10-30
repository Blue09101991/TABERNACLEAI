'use client';
// Chakra imports
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

import Card from '@/components/card/Card';

export default function Statistics(props: {
  illustration: string;
  focused: boolean;
  title: string;
  value: string;
  detail: string;
  [x: string]: any;
}) {
  const { illustration, focused, title, value, detail, ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.500', 'secondaryGray.500');

  return (
    <Card flexDirection="row" w="100%" p="25px" {...rest}>
      <Flex alignItems="center" justify="space-between">
        <Flex direction="column">
          <Text
            color={focused ? 'secondaryGray.400' : textColorSecondary}
            fontSize="sm"
            fontWeight="500"
            mb="10px"
            lineHeight="100%"
          >
            {title}
          </Text>
          <Text
            color={focused ? 'white' : textColor}
            fontSize="2xl"
            fontWeight="700"
            lineHeight="100%"
            mb="8px"
          >
            {value}
          </Text>
          {detail}
        </Flex>
        {illustration}
      </Flex>
    </Card>
  );
}
