import React, { useState, useRef } from 'react';
import {
  Box, Button, Flex, Heading, Text, Input, Textarea, Divider, Image, SimpleGrid, Spinner, useToast, Tooltip, IconButton, Tabs, TabList, TabPanels, Tab, TabPanel, useColorMode, useColorModeValue,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon, CopyIcon, DownloadIcon } from '@chakra-ui/icons';
import axios from 'axios';
import Link from 'next/link';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

interface ImageOption {
  src: string;
  title: string;
  prompt: string;
}

function shuffleArray(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function ImageGeneration() {
  const [inputPrompt, setInputPrompt] = useState('');
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageOption | null>(null);
  const toast = useToast();
  const generatedImagesRef = useRef<HTMLDivElement>(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('gray.100', 'gray.900');
  const color = useColorModeValue('black', 'white');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);

  const handleImageClick = (src: string) => {
    setSelectedImageSrc(src);
    onOpen();
  };

  const images_all = [
    "/img/imggeneration/home/1.jpeg",
    "/img/imggeneration/home/2.jpeg",
    "/img/imggeneration/home/3.jpeg",
    "/img/imggeneration/home/4.jpeg",
    "/img/imggeneration/home/5.jpeg",
    "/img/imggeneration/home/6.jpeg",
    "/img/imggeneration/home/7.jpeg",
    "/img/imggeneration/home/8.jpeg",
    "/img/imggeneration/home/9.jpeg",
    "/img/imggeneration/home/10.jpeg",
    "/img/imggeneration/home/11.jpeg",
    "/img/imggeneration/home/12.jpeg",
    "/img/imggeneration/home/13.jpeg",
    "/img/imggeneration/home/14.jpeg",
    "/img/imggeneration/home/15.jpeg",
    "/img/imggeneration/home/16.jpeg",
    "/img/imggeneration/home/17.jpeg",
    "/img/imggeneration/home/18.jpeg",
    "/img/imggeneration/home/19.jpeg",
    "/img/imggeneration/home/20.jpeg",
    "/img/imggeneration/home/21.jpeg",
    "/img/imggeneration/home/22.jpeg",
    "/img/imggeneration/home/23.jpeg",
    "/img/imggeneration/home/24.jpeg",
    "/img/imggeneration/home/25.jpeg",
    "/img/imggeneration/home/26.jpeg",
    "/img/imggeneration/home/27.jpeg",
    "/img/imggeneration/home/28.jpeg",
    "/img/imggeneration/home/29.jpeg",
    "/img/imggeneration/home/30.jpeg",
    "/img/imggeneration/home/31.jpeg",
    "/img/imggeneration/home/32.jpeg",
    "/img/imggeneration/home/33.jpeg",
    "/img/imggeneration/home/34.jpeg",
    "/img/imggeneration/home/35.jpeg",
    "/img/imggeneration/home/36.jpeg",
    "/img/imggeneration/home/37.jpeg",
    "/img/imggeneration/home/38.jpeg",
    "/img/imggeneration/home/39.jpeg",
    "/img/imggeneration/photo/1.jpeg",
    "/img/imggeneration/photo/2.jpeg",
    "/img/imggeneration/photo/3.jpeg",
    "/img/imggeneration/photo/4.jpeg",
    "/img/imggeneration/photo/5.jpeg",
    "/img/imggeneration/photo/6.jpeg",
    "/img/imggeneration/photo/7.jpeg",
    "/img/imggeneration/photo/8.jpeg",
    "/img/imggeneration/photo/9.jpeg",
    "/img/imggeneration/photo/10.jpeg",
    "/img/imggeneration/photo/11.jpeg",
    "/img/imggeneration/photo/12.jpeg",
    "/img/imggeneration/photo/13.jpeg",
    "/img/imggeneration/photo/14.jpeg",
    "/img/imggeneration/photo/15.jpeg",
    "/img/imggeneration/photo/16.jpeg",
    "/img/imggeneration/photo/17.jpeg",
    "/img/imggeneration/photo/18.jpeg",
    "/img/imggeneration/photo/19.jpeg",
    "/img/imggeneration/photo/20.jpeg",
    "/img/imggeneration/photo/21.jpeg",
    "/img/imggeneration/photo/22.jpeg",
    "/img/imggeneration/photo/23.jpeg",
    "/img/imggeneration/photo/24.jpeg",
    "/img/imggeneration/photo/25.jpeg",
    "/img/imggeneration/photo/26.jpeg",
    "/img/imggeneration/photo/27.jpeg",
    "/img/imggeneration/photo/28.jpeg",
    "/img/imggeneration/photo/29.jpeg",
    "/img/imggeneration/photo/30.jpeg",
    "/img/imggeneration/photo/31.jpeg",
    "/img/imggeneration/photo/32.jpeg",
    "/img/imggeneration/photo/33.jpeg",
    "/img/imggeneration/photo/34.jpeg",
    "/img/imggeneration/photo/35.jpeg",
    "/img/imggeneration/photo/36.jpeg",
    "/img/imggeneration/photo/37.jpeg",
    "/img/imggeneration/photo/38.jpeg",
    "/img/imggeneration/photo/39.jpeg",
    "/img/imggeneration/photo/40.jpeg",
    "/img/imggeneration/photo/41.jpeg",
    "/img/imggeneration/photo/42.jpeg",
    "/img/imggeneration/photo/43.jpeg",
    "/img/imggeneration/photo/44.jpeg",
    "/img/imggeneration/photo/45.jpeg",
    "/img/imggeneration/photo/46.jpeg",
    "/img/imggeneration/photo/47.jpeg",
    "/img/imggeneration/photo/48.jpeg",
    "/img/imggeneration/animal/1.jpeg",
    "/img/imggeneration/animal/2.jpeg",
    "/img/imggeneration/animal/3.jpeg",
    "/img/imggeneration/animal/4.jpeg",
    "/img/imggeneration/animal/5.jpeg",
    "/img/imggeneration/animal/6.jpeg",
    "/img/imggeneration/animal/7.jpeg",
    "/img/imggeneration/animal/8.jpeg",
    "/img/imggeneration/animal/9.jpeg",
    "/img/imggeneration/animal/10.jpeg",
    "/img/imggeneration/animal/11.jpeg",
    "/img/imggeneration/animal/12.jpeg",
    "/img/imggeneration/animal/13.jpeg",
    "/img/imggeneration/animal/14.jpeg",
    "/img/imggeneration/animal/15.jpeg",
    "/img/imggeneration/animal/16.jpeg",
    "/img/imggeneration/animal/17.jpeg",
    "/img/imggeneration/animal/18.jpeg",
    "/img/imggeneration/animal/19.jpeg",
    "/img/imggeneration/animal/20.jpeg",
    "/img/imggeneration/animal/21.jpeg",
    "/img/imggeneration/animal/22.jpeg",
    "/img/imggeneration/animal/23.jpeg",
    "/img/imggeneration/animal/24.jpeg",
    "/img/imggeneration/animal/25.jpeg",
    "/img/imggeneration/animal/26.jpeg",
    "/img/imggeneration/animal/27.jpeg",
    "/img/imggeneration/animal/28.jpeg",
    "/img/imggeneration/animal/29.jpeg",
    "/img/imggeneration/animal/30.jpeg",
    "/img/imggeneration/animal/31.jpeg",
    "/img/imggeneration/animal/32.jpeg",
    "/img/imggeneration/animal/33.jpeg",
    "/img/imggeneration/animal/34.jpeg",
    "/img/imggeneration/animal/35.jpeg",
    "/img/imggeneration/anime/1.jpeg",
    "/img/imggeneration/anime/2.jpeg",
    "/img/imggeneration/anime/3.jpeg",
    "/img/imggeneration/anime/4.jpeg",
    "/img/imggeneration/anime/5.jpeg",
    "/img/imggeneration/anime/6.jpeg",
    "/img/imggeneration/anime/7.jpeg",
    "/img/imggeneration/anime/8.jpeg",
    "/img/imggeneration/anime/9.jpeg",
    "/img/imggeneration/anime/10.jpeg",
    "/img/imggeneration/anime/11.jpeg",
    "/img/imggeneration/anime/12.jpeg",
    "/img/imggeneration/anime/13.jpeg",
    "/img/imggeneration/anime/14.jpeg",
    "/img/imggeneration/anime/15.jpeg",
    "/img/imggeneration/anime/16.jpeg",
    "/img/imggeneration/anime/17.jpeg",
    "/img/imggeneration/anime/18.jpeg",
    "/img/imggeneration/anime/19.jpeg",
    "/img/imggeneration/anime/20.jpeg",
    "/img/imggeneration/anime/21.jpeg",
    "/img/imggeneration/anime/22.jpeg",
    "/img/imggeneration/anime/23.jpeg",
    "/img/imggeneration/anime/24.jpeg",
    "/img/imggeneration/anime/25.jpeg",
    "/img/imggeneration/anime/26.jpeg",
    "/img/imggeneration/anime/27.jpeg",
    "/img/imggeneration/anime/28.jpeg",
    "/img/imggeneration/anime/29.jpeg",
    "/img/imggeneration/anime/30.jpeg",
    "/img/imggeneration/anime/31.jpeg",
    "/img/imggeneration/anime/32.jpeg",
    "/img/imggeneration/anime/33.jpeg",
    "/img/imggeneration/anime/34.jpeg",
    "/img/imggeneration/anime/35.jpeg",
    "/img/imggeneration/anime/36.jpeg",
    "/img/imggeneration/anime/37.jpeg",
    "/img/imggeneration/anime/38.jpeg",
    "/img/imggeneration/anime/39.jpeg",
    "/img/imggeneration/anime/40.jpeg",
    "/img/imggeneration/anime/41.jpeg",
    "/img/imggeneration/anime/42.jpeg",
    "/img/imggeneration/anime/43.jpeg",
    "/img/imggeneration/anime/44.jpeg",
    "/img/imggeneration/architecture/1.jpeg",
    "/img/imggeneration/architecture/2.jpeg",
    "/img/imggeneration/architecture/3.jpeg",
    "/img/imggeneration/architecture/4.jpeg",
    "/img/imggeneration/architecture/5.jpeg",
    "/img/imggeneration/architecture/6.jpeg",
    "/img/imggeneration/architecture/7.jpeg",
    "/img/imggeneration/architecture/8.jpeg",
    "/img/imggeneration/architecture/9.jpeg",
    "/img/imggeneration/architecture/10.jpeg",
    "/img/imggeneration/architecture/11.jpeg",
    "/img/imggeneration/architecture/12.jpeg",
    "/img/imggeneration/architecture/13.jpeg",
    "/img/imggeneration/architecture/14.jpeg",
    "/img/imggeneration/architecture/15.jpeg",
    "/img/imggeneration/architecture/16.jpeg",
    "/img/imggeneration/architecture/17.jpeg",
    "/img/imggeneration/architecture/18.jpeg",
    "/img/imggeneration/architecture/19.jpeg",
    "/img/imggeneration/architecture/20.jpeg",
    "/img/imggeneration/architecture/21.jpeg",
    "/img/imggeneration/architecture/22.jpeg",
    "/img/imggeneration/architecture/23.jpeg",
    "/img/imggeneration/architecture/24.jpeg",
    "/img/imggeneration/architecture/25.jpeg",
    "/img/imggeneration/architecture/26.jpeg",
    "/img/imggeneration/architecture/27.jpeg",
    "/img/imggeneration/architecture/28.jpeg",
  ];

  const images_photography = [
    "/img/imggeneration/photo/1.jpeg",
    "/img/imggeneration/photo/2.jpeg",
    "/img/imggeneration/photo/3.jpeg",
    "/img/imggeneration/photo/4.jpeg",
    "/img/imggeneration/photo/5.jpeg",
    "/img/imggeneration/photo/6.jpeg",
    "/img/imggeneration/photo/7.jpeg",
    "/img/imggeneration/photo/8.jpeg",
    "/img/imggeneration/photo/9.jpeg",
    "/img/imggeneration/photo/10.jpeg",
    "/img/imggeneration/photo/11.jpeg",
    "/img/imggeneration/photo/12.jpeg",
    "/img/imggeneration/photo/13.jpeg",
    "/img/imggeneration/photo/14.jpeg",
    "/img/imggeneration/photo/15.jpeg",
    "/img/imggeneration/photo/16.jpeg",
    "/img/imggeneration/photo/17.jpeg",
    "/img/imggeneration/photo/18.jpeg",
    "/img/imggeneration/photo/19.jpeg",
    "/img/imggeneration/photo/20.jpeg",
    "/img/imggeneration/photo/21.jpeg",
    "/img/imggeneration/photo/22.jpeg",
    "/img/imggeneration/photo/23.jpeg",
    "/img/imggeneration/photo/24.jpeg",
    "/img/imggeneration/photo/25.jpeg",
    "/img/imggeneration/photo/26.jpeg",
    "/img/imggeneration/photo/27.jpeg",
    "/img/imggeneration/photo/28.jpeg",
    "/img/imggeneration/photo/29.jpeg",
    "/img/imggeneration/photo/30.jpeg",
    "/img/imggeneration/photo/31.jpeg",
    "/img/imggeneration/photo/32.jpeg",
    "/img/imggeneration/photo/33.jpeg",
    "/img/imggeneration/photo/34.jpeg",
    "/img/imggeneration/photo/35.jpeg",
    "/img/imggeneration/photo/36.jpeg",
    "/img/imggeneration/photo/37.jpeg",
    "/img/imggeneration/photo/38.jpeg",
    "/img/imggeneration/photo/39.jpeg",
    "/img/imggeneration/photo/40.jpeg",
    "/img/imggeneration/photo/41.jpeg",
    "/img/imggeneration/photo/42.jpeg",
    "/img/imggeneration/photo/43.jpeg",
    "/img/imggeneration/photo/44.jpeg",
    "/img/imggeneration/photo/45.jpeg",
    "/img/imggeneration/photo/46.jpeg",
    "/img/imggeneration/photo/47.jpeg",
    "/img/imggeneration/photo/48.jpeg",
  ];

  const images_animal = [
    "/img/imggeneration/animal/1.jpeg",
    "/img/imggeneration/animal/2.jpeg",
    "/img/imggeneration/animal/3.jpeg",
    "/img/imggeneration/animal/4.jpeg",
    "/img/imggeneration/animal/5.jpeg",
    "/img/imggeneration/animal/6.jpeg",
    "/img/imggeneration/animal/7.jpeg",
    "/img/imggeneration/animal/8.jpeg",
    "/img/imggeneration/animal/9.jpeg",
    "/img/imggeneration/animal/10.jpeg",
    "/img/imggeneration/animal/11.jpeg",
    "/img/imggeneration/animal/12.jpeg",
    "/img/imggeneration/animal/13.jpeg",
    "/img/imggeneration/animal/14.jpeg",
    "/img/imggeneration/animal/15.jpeg",
    "/img/imggeneration/animal/16.jpeg",
    "/img/imggeneration/animal/17.jpeg",
    "/img/imggeneration/animal/18.jpeg",
    "/img/imggeneration/animal/19.jpeg",
    "/img/imggeneration/animal/20.jpeg",
    "/img/imggeneration/animal/21.jpeg",
    "/img/imggeneration/animal/22.jpeg",
    "/img/imggeneration/animal/23.jpeg",
    "/img/imggeneration/animal/24.jpeg",
    "/img/imggeneration/animal/25.jpeg",
    "/img/imggeneration/animal/26.jpeg",
    "/img/imggeneration/animal/27.jpeg",
    "/img/imggeneration/animal/28.jpeg",
    "/img/imggeneration/animal/29.jpeg",
    "/img/imggeneration/animal/30.jpeg",
    "/img/imggeneration/animal/31.jpeg",
    "/img/imggeneration/animal/32.jpeg",
    "/img/imggeneration/animal/33.jpeg",
    "/img/imggeneration/animal/34.jpeg",
    "/img/imggeneration/animal/35.jpeg",
  ];

  const images_anime = [
    "/img/imggeneration/anime/1.jpeg",
    "/img/imggeneration/anime/2.jpeg",
    "/img/imggeneration/anime/3.jpeg",
    "/img/imggeneration/anime/4.jpeg",
    "/img/imggeneration/anime/5.jpeg",
    "/img/imggeneration/anime/6.jpeg",
    "/img/imggeneration/anime/7.jpeg",
    "/img/imggeneration/anime/8.jpeg",
    "/img/imggeneration/anime/9.jpeg",
    "/img/imggeneration/anime/10.jpeg",
    "/img/imggeneration/anime/11.jpeg",
    "/img/imggeneration/anime/12.jpeg",
    "/img/imggeneration/anime/13.jpeg",
    "/img/imggeneration/anime/14.jpeg",
    "/img/imggeneration/anime/15.jpeg",
    "/img/imggeneration/anime/16.jpeg",
    "/img/imggeneration/anime/17.jpeg",
    "/img/imggeneration/anime/18.jpeg",
    "/img/imggeneration/anime/19.jpeg",
    "/img/imggeneration/anime/20.jpeg",
    "/img/imggeneration/anime/21.jpeg",
    "/img/imggeneration/anime/22.jpeg",
    "/img/imggeneration/anime/23.jpeg",
    "/img/imggeneration/anime/24.jpeg",
    "/img/imggeneration/anime/25.jpeg",
    "/img/imggeneration/anime/26.jpeg",
    "/img/imggeneration/anime/27.jpeg",
    "/img/imggeneration/anime/28.jpeg",
    "/img/imggeneration/anime/29.jpeg",
    "/img/imggeneration/anime/30.jpeg",
    "/img/imggeneration/anime/31.jpeg",
    "/img/imggeneration/anime/32.jpeg",
    "/img/imggeneration/anime/33.jpeg",
    "/img/imggeneration/anime/34.jpeg",
    "/img/imggeneration/anime/35.jpeg",
    "/img/imggeneration/anime/36.jpeg",
    "/img/imggeneration/anime/37.jpeg",
    "/img/imggeneration/anime/38.jpeg",
    "/img/imggeneration/anime/39.jpeg",
    "/img/imggeneration/anime/40.jpeg",
    "/img/imggeneration/anime/41.jpeg",
    "/img/imggeneration/anime/42.jpeg",
    "/img/imggeneration/anime/43.jpeg",
    "/img/imggeneration/anime/44.jpeg",
  ];

  const images_architecture = [
    "/img/imggeneration/architecture/1.jpeg",
    "/img/imggeneration/architecture/2.jpeg",
    "/img/imggeneration/architecture/3.jpeg",
    "/img/imggeneration/architecture/4.jpeg",
    "/img/imggeneration/architecture/5.jpeg",
    "/img/imggeneration/architecture/6.jpeg",
    "/img/imggeneration/architecture/7.jpeg",
    "/img/imggeneration/architecture/8.jpeg",
    "/img/imggeneration/architecture/9.jpeg",
    "/img/imggeneration/architecture/10.jpeg",
    "/img/imggeneration/architecture/11.jpeg",
    "/img/imggeneration/architecture/12.jpeg",
    "/img/imggeneration/architecture/13.jpeg",
    "/img/imggeneration/architecture/14.jpeg",
    "/img/imggeneration/architecture/15.jpeg",
    "/img/imggeneration/architecture/16.jpeg",
    "/img/imggeneration/architecture/17.jpeg",
    "/img/imggeneration/architecture/18.jpeg",
    "/img/imggeneration/architecture/19.jpeg",
    "/img/imggeneration/architecture/20.jpeg",
    "/img/imggeneration/architecture/21.jpeg",
    "/img/imggeneration/architecture/22.jpeg",
    "/img/imggeneration/architecture/23.jpeg",
    "/img/imggeneration/architecture/24.jpeg",
    "/img/imggeneration/architecture/25.jpeg",
    "/img/imggeneration/architecture/26.jpeg",
    "/img/imggeneration/architecture/27.jpeg",
    "/img/imggeneration/architecture/28.jpeg",
  ];

  const images_character = [
    "/img/imggeneration/anime/1.jpeg",
    "/img/imggeneration/anime/2.jpeg",
    "/img/imggeneration/anime/3.jpeg",
    "/img/imggeneration/anime/4.jpeg",
    "/img/imggeneration/anime/5.jpeg",
    "/img/imggeneration/anime/6.jpeg",
    "/img/imggeneration/anime/7.jpeg",
    "/img/imggeneration/anime/8.jpeg",
    "/img/imggeneration/anime/9.jpeg",
    "/img/imggeneration/anime/10.jpeg",
    "/img/imggeneration/anime/11.jpeg",
    "/img/imggeneration/anime/12.jpeg",
    "/img/imggeneration/anime/13.jpeg",
    "/img/imggeneration/anime/14.jpeg",
    "/img/imggeneration/anime/15.jpeg",
    "/img/imggeneration/anime/16.jpeg",
    "/img/imggeneration/anime/17.jpeg",
    "/img/imggeneration/anime/18.jpeg",
    "/img/imggeneration/anime/19.jpeg",
    "/img/imggeneration/anime/20.jpeg",
    "/img/imggeneration/anime/21.jpeg",
    "/img/imggeneration/anime/22.jpeg",
    "/img/imggeneration/anime/23.jpeg",
    "/img/imggeneration/anime/24.jpeg",
    "/img/imggeneration/anime/25.jpeg",
    "/img/imggeneration/anime/26.jpeg",
    "/img/imggeneration/anime/27.jpeg",
    "/img/imggeneration/anime/28.jpeg",
    "/img/imggeneration/anime/29.jpeg",
    "/img/imggeneration/anime/30.jpeg",
    "/img/imggeneration/anime/31.jpeg",
    "/img/imggeneration/anime/32.jpeg",
    "/img/imggeneration/anime/33.jpeg",
    "/img/imggeneration/anime/34.jpeg",
    "/img/imggeneration/anime/35.jpeg",
    "/img/imggeneration/anime/36.jpeg",
    "/img/imggeneration/anime/37.jpeg",
    "/img/imggeneration/anime/38.jpeg",
    "/img/imggeneration/anime/39.jpeg",
    "/img/imggeneration/anime/40.jpeg",
    "/img/imggeneration/anime/41.jpeg",
    "/img/imggeneration/anime/42.jpeg",
    "/img/imggeneration/anime/43.jpeg",
    "/img/imggeneration/anime/44.jpeg",
    "/img/imggeneration/photo/1.jpeg",
    "/img/imggeneration/photo/2.jpeg",
    "/img/imggeneration/photo/3.jpeg",
    "/img/imggeneration/photo/4.jpeg",
    "/img/imggeneration/photo/5.jpeg",
    "/img/imggeneration/photo/6.jpeg",
    "/img/imggeneration/photo/7.jpeg",
    "/img/imggeneration/photo/8.jpeg",
    "/img/imggeneration/photo/9.jpeg",
    "/img/imggeneration/photo/10.jpeg",
    "/img/imggeneration/photo/11.jpeg",
    "/img/imggeneration/photo/12.jpeg",
    "/img/imggeneration/photo/13.jpeg",
    "/img/imggeneration/photo/14.jpeg",
    "/img/imggeneration/photo/15.jpeg",
    "/img/imggeneration/photo/16.jpeg",
    "/img/imggeneration/photo/17.jpeg",
    "/img/imggeneration/photo/18.jpeg",
    "/img/imggeneration/photo/19.jpeg",
    "/img/imggeneration/photo/20.jpeg",
    "/img/imggeneration/photo/21.jpeg",
    "/img/imggeneration/photo/22.jpeg",
    "/img/imggeneration/photo/23.jpeg",
    "/img/imggeneration/photo/24.jpeg",
    "/img/imggeneration/photo/25.jpeg",
    "/img/imggeneration/photo/26.jpeg",
    "/img/imggeneration/photo/27.jpeg",
    "/img/imggeneration/photo/28.jpeg",
    "/img/imggeneration/photo/29.jpeg",
    "/img/imggeneration/photo/30.jpeg",
    "/img/imggeneration/photo/31.jpeg",
    "/img/imggeneration/photo/32.jpeg",
    "/img/imggeneration/photo/33.jpeg",
    "/img/imggeneration/photo/34.jpeg",
    "/img/imggeneration/photo/35.jpeg",
    "/img/imggeneration/photo/36.jpeg",
    "/img/imggeneration/photo/37.jpeg",
    "/img/imggeneration/photo/38.jpeg",
    "/img/imggeneration/photo/39.jpeg",
    "/img/imggeneration/photo/40.jpeg",
    "/img/imggeneration/photo/41.jpeg",
    "/img/imggeneration/photo/42.jpeg",
    "/img/imggeneration/photo/43.jpeg",
    "/img/imggeneration/photo/44.jpeg",
    "/img/imggeneration/photo/45.jpeg",
    "/img/imggeneration/photo/46.jpeg",
    "/img/imggeneration/photo/47.jpeg",
    "/img/imggeneration/photo/48.jpeg",
  ];

  const shuffledImages_all = shuffleArray([...images_all]);
  const shuffledImages_photography = shuffleArray([...images_photography]);
  const shuffledImages_animal = shuffleArray([...images_animal]);
  const shuffledImages_anime = shuffleArray([...images_anime]);
  const shuffledImages_architecture = shuffleArray([...images_architecture]);
  const shuffledImages_character = shuffleArray([...images_character]);


  return (
    <Box p={8} maxW="1200px" mx="auto" bg={bg} color={color}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Get Started Here</Heading>
      </Flex>

      <SimpleGrid columns={[1, 2]} spacing={4} mb={6}>
        <Box
          as={Link}
          href="/image-generator"
          p={4}
          bg="gray.700"
          color="white"
          borderRadius="md"
          textAlign="center"
          transition="transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease"
          _hover={{ transform: 'scale(1.05)', boxShadow: 'xl', bg: 'purple.700' }}
          cursor="pointer"
        >
          <Heading size="md" mb={2}>Image Generation</Heading>
          <Text>Generate art, illustrations, and more with prompts.</Text>
        </Box>
        {/* <Box
          as={Link}
          href="/realtime-canvas"
          p={4}
          bg="gray.700"
          color="white"
          borderRadius="md"
          textAlign="center"
          transition="transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease"
          _hover={{ transform: 'scale(1.05)', boxShadow: 'xl', bg: 'purple.700' }}
          cursor="pointer"
        >
          <Heading size="md" mb={2}>Realtime Canvas</Heading>
          <Text>Create and transform your sketches into art in real-time.</Text>
        </Box>
        <Box
          as={Link}
          href="/canvas-editor"
          p={4}
          bg="gray.700"
          color="white"
          borderRadius="md"
          textAlign="center"
          transition="transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease"
          _hover={{ transform: 'scale(1.05)', boxShadow: 'xl', bg: 'purple.700' }}
          cursor="pointer"
        >
          <Heading size="md" mb={2}>Canvas Editor</Heading>
          <Text>Edit, refine, add details, remove unwanted elements, and more.</Text>
        </Box>
        <Box
          as={Link}
          href="/motion-generator"
          p={4}
          bg="gray.700"
          color="white"
          borderRadius="md"
          textAlign="center"
          transition="transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease"
          _hover={{ transform: 'scale(1.05)', boxShadow: 'xl', bg: 'purple.700' }}
          cursor="pointer"
        >
          <Heading size="md" mb={2}>Motion</Heading>
          <Text>Watch your ideas come to life in moments with generative video.</Text>
        </Box>
        <Box
          as={Link}
          href="/realtime-generation"
          p={4}
          bg="gray.700"
          color="white"
          borderRadius="md"
          textAlign="center"
          transition="transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease"
          _hover={{ transform: 'scale(1.05)', boxShadow: 'xl', bg: 'purple.700' }}
          cursor="pointer"
        >
          <Heading size="md" mb={2}>Realtime Generation</Heading>
          <Text>Allows for real-time generation while you type.</Text>
        </Box>
        <Box
          as={Link}
          href="/universal-upscaler"
          p={4}
          bg="gray.700"
          color="white"
          borderRadius="md"
          textAlign="center"
          transition="transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease"
          _hover={{ transform: 'scale(1.05)', boxShadow: 'xl', bg: 'purple.700' }}
          cursor="pointer"
        >
          <Heading size="md" mb={2}>Universal Upscaler</Heading>
          <Text>Improve the quality, size, or make changes to images with prompts.</Text>
        </Box> */}
      </SimpleGrid>

      <Heading mb={4}>Community Creations</Heading>
      <Tabs variant="soft-rounded" colorScheme="purple">
        <TabList>
          <Tab>All</Tab>
          <Tab>Photography</Tab>
          <Tab>Animals</Tab>
          <Tab>Anime</Tab>
          <Tab>Architecture</Tab>
          <Tab>Character</Tab>
          {/* <Tab>Food</Tab>
          <Tab>Sci-Fi</Tab> */}
        </TabList>
        <TabPanels>
          <TabPanel>
          <SimpleGrid columns={[1, 2, 3]} spacing={4} mt={4}>
            {shuffledImages_all.map((src, index) => (
              <Box key={index} overflow="hidden" borderRadius="md" transition="transform 0.3s ease, box-shadow 0.3s ease"
                _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }} onClick={() => handleImageClick(src)}>
                <Image src={src} alt={`Image ${index + 1}`} cursor="pointer" />
              </Box>
            ))}
          </SimpleGrid>
          </TabPanel>
          <TabPanel>
          <SimpleGrid columns={[1, 2, 4]} spacing={4} mt={4}>
            {shuffledImages_photography.map((src, index) => (
              <Box key={index} overflow="hidden" borderRadius="md" transition="transform 0.3s ease, box-shadow 0.3s ease"
                _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }} onClick={() => handleImageClick(src)}>
                <Image src={src} alt={`Image ${index + 1}`} cursor="pointer" />
              </Box>
            ))}
          </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 4]} spacing={4} mt={4}>
            {shuffledImages_animal.map((src, index) => (
              <Box key={index} overflow="hidden" borderRadius="md" transition="transform 0.3s ease, box-shadow 0.3s ease"
                _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }} onClick={() => handleImageClick(src)}>
                <Image src={src} alt={`Image ${index + 1}`} cursor="pointer" />
              </Box>
            ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 4]} spacing={4} mt={4}>
            {shuffledImages_anime.map((src, index) => (
              <Box key={index} overflow="hidden" borderRadius="md" transition="transform 0.3s ease, box-shadow 0.3s ease"
                _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }} onClick={() => handleImageClick(src)}>
                <Image src={src} alt={`Image ${index + 1}`} cursor="pointer" />
              </Box>
            ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 4]} spacing={4} mt={4}>
            {shuffledImages_architecture.map((src, index) => (
              <Box key={index} overflow="hidden" borderRadius="md" transition="transform 0.3s ease, box-shadow 0.3s ease"
                _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }} onClick={() => handleImageClick(src)}>
                <Image src={src} alt={`Image ${index + 1}`} cursor="pointer" />
              </Box>
            ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 4]} spacing={4} mt={4}>
            {shuffledImages_character.map((src, index) => (
              <Box key={index} overflow="hidden" borderRadius="md" transition="transform 0.3s ease, box-shadow 0.3s ease"
                _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }} onClick={() => handleImageClick(src)}>
                <Image src={src} alt={`Image ${index + 1}`} cursor="pointer" />
              </Box>
            ))}
            </SimpleGrid>
          </TabPanel>
          {/* Repeat TabPanels for other categories */}
        </TabPanels>
      </Tabs>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="90vw" maxH="90vh">
          <ModalCloseButton />
          <ModalBody p={0}>
            {selectedImageSrc && <Image src={selectedImageSrc} alt="Selected Image" w="100%" h="100%" />}
          </ModalBody>
        </ModalContent>
      </Modal>

    </Box> 

    
  );
}
