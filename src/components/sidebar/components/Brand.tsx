'use client';
// Chakra imports
import { Flex, useColorModeValue } from '@chakra-ui/react';

import { HorizonLogo } from '@/components/icons/Icons';
import { HSeparator } from '@/components/separator/Separator';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex alignItems="center" flexDirection="column">
      {/* <HorizonLogo h="26px" w="146px" my="30px" color={logoColor} /> */}
      <img src='/img/layout/logo.png' style={{width: "300px", height: "50px", marginTop: "0px"}} />
      <HSeparator mb="30px" w="284px" />
    </Flex>
  );
}

export default SidebarBrand;
