'use client';

// Chakra imports
import { Flex } from '@chakra-ui/react';

import Card from '@/components/card/Card';
import Banner from '@/components/invoice/Banner';
import Content from '@/components/invoice/Content';
export default function Invoice() {
  // Chakra Color Mode

  return (
    <Card mt={{ base: '70px', md: '0px', xl: '0px' }} maxW="920px" mx="auto">
      <Flex direction="column" width="stretch">
        <Banner />
        <Content />
      </Flex>
    </Card>
  );
}
