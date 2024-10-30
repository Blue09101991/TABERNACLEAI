'use client';
// Chakra imports
import { Badge, Icon, Flex, Button, Text } from '@chakra-ui/react';

import { VSeparator } from '@/components/separator/Separator';

import { MdShare, MdDownload } from 'react-icons/md';
import plan from '../../../public/img/plan/InvoiceBg.png';

export default function Banner(props: {
  illustration?: string | JSX.Element | any;
  focused?: boolean;
  title?: string;
  value?: string;
  detail?: string;
  [x: string]: any;
}) {
  const { illustration, focused, title, value, detail, ...rest } = props;

  // Chakra Color Mode
  const bgButton = 'rgba(255,255,255,0.12)';
  const bgHover = { bg: 'whiteAlpha.50' };
  const bgFocus = { bg: 'rgba(255,255,255,0.12)' };

  return (

    <Flex
      bgImage={plan.src}
      direction={'column'}
      borderRadius="16px"
      backgroundRepeat="no-repeat"
      bgSize="cover"
      p={{ base: '20px', md: '60px' }}
      pt={{ base: '40px', md: '75px' }}
      pb="140px"
    >
      <Flex>
        <Badge
          w="max-content"
          mb="10px"
          fontSize="sm"
          bg="rgba(255,255,255,0.12)"
          color="white"
          fontWeight="bold"
        >
          CURRENT PLAN
        </Badge>
        <Button
          ms="auto"
          me="10px"
          alignItems="center"
          justifyContent="center"
          bg={bgButton}
          _hover={bgHover}
          _focus={bgFocus}
          _active={bgFocus}
          p="7px"
          minW="unset"
          h="32px"
          lineHeight="100%"
          borderRadius="10px"
          {...rest}
        >
          <Icon as={MdDownload} color="white" w="18px" h="18px" />
        </Button>
        <Button
          alignItems="center"
          justifyContent="center"
          bg="linear-gradient(293.45deg, #FA709A 0%, #FEE140 92.27%)"
          _hover={{
            bg: 'linear-gradient(293.45deg, #FA709A 0%, #FEE140 92.27%)',
          }}
          _focus={{
            bg: 'linear-gradient(293.45deg, #FA709A 0%, #FEE140 92.27%)',
          }}
          _active={{
            bg: 'linear-gradient(293.45deg, #FA709A 0%, #FEE140 92.27%)',
          }}
          p="7px"
          minW="unset"
          h="32px"
          lineHeight="100%"
          borderRadius="10px"
          {...rest}
        >
          <Icon as={MdShare} color="white" w="18px" h="18px" />
        </Button>
      </Flex>
      <Flex
        mb={{ base: '0px', md: '50px' }}
        direction={{ base: 'column', md: 'row' }}
      >
        <Flex
          direction="column"
          color="white"
          h="100%"
          w="100%"
          mb={{ base: '20px', md: '0px' }}
        >
          <Text
            mt={{ base: '10px', md: '0px' }}
            fontSize={{ base: '2xl', md: '32px', lg: '44px', xl: '44px' }}
            fontWeight="bold"
          >
            Expert+
          </Text>
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="regular" paddingBottom="30px">
            100,000 Credits
          </Text>
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="regular">
              Get started for FREE. <br />
          
              Simply add your Open API key & get access to to all our feature rich tools that put you light years ahead of anyone in the AI industry. 5000 paragraphs of dynamite content completely FREE on us. <br />
            
              No credit card required for free trial.
          </Text>
          
        </Flex>
      </Flex>
    </Flex>
  );
}
