import React from 'react';
import { Box, Text, Button, VStack, HStack, useColorModeValue, Divider, Icon } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

type PricingPlanProps = {
  planName: string;
  price: string;
  features: Array<{ feature: string; available: boolean }>;
  wordLimit: string;
  buttonText: string;
  onButtonClick: () => void;
};

export const PricingPlanCard: React.FC<PricingPlanProps> = ({ planName, price, features, wordLimit, buttonText, onButtonClick }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');
  const featureColor = useColorModeValue('gray.600', 'gray.200');
  const buttonBg = useColorModeValue('blue.500', 'blue.200');
  const buttonHoverBg = useColorModeValue('blue.600', 'blue.300');

  return (
    <Box bg={cardBg} rounded="xl" shadow="md" p={5} textAlign="center" borderWidth="1px">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        {planName}
      </Text>
      <Text fontWeight="900" fontSize="5xl" color={textColor}>
        {price}
      </Text>
      <Text fontSize="md" color={featureColor} mb={4}>
        {wordLimit}
      </Text>
      <Divider my={4} />
      <VStack spacing={3} align="start" mb={4}>
        {features.map((item, index) => (
          <HStack key={index}>
            <Icon as={CheckIcon} color={item.available ? 'green.500' : 'gray.400'} />
            <Text fontSize="sm" color={featureColor}>
              {item.feature}
            </Text>
          </HStack>
        ))}
      </VStack>
      <Button
        colorScheme="blue"
        bg={buttonBg}
        color="white"
        _hover={{ bg: buttonHoverBg }}
        size="md"
        mt={4}
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>
    </Box>
  );
};
