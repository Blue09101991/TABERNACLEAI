import React, { useState, useRef } from 'react';
import {
  Box, Button, Flex, Heading, Text, Input, Textarea, Divider, Image, SimpleGrid, Spinner, useToast, Tooltip, IconButton, Tabs, TabList, TabPanels, Tab, TabPanel, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Select,
  useColorMode, useColorModeValue,
} from '@chakra-ui/react';
import { CopyIcon, DownloadIcon } from '@chakra-ui/icons';
import axios from 'axios';

interface ImageOption {
  src: string;
  title: string;
  prompt: string;
}

const predefinedImages: ImageOption[] = [
    { src: '/img/imggeneration/0.jpeg', title: 'None', prompt: '{inputPrompt}'},
    { src: '/img/imggeneration/1.jpeg', title: 'Text Logo', prompt: 'A luxurious and ornate emblem with the letter or symbol {inputPrompt} in the center. The design should feature intricate golden leaves and swirls forming a circular pattern around the letter or symbol. The background should be black, and the overall style should be elegant and regal, resembling vintage heraldic symbols. The emblem should include small decorative details such as stars, dots, and additional flourishes to enhance its richness.' },
    { src: '/img/imggeneration/2.jpg', title: 'Logo', prompt: 'An emblem featuring {inputPrompt} forming the top of a coffee cup, with steam rising from the top. The design should be set within a circular border, decorated with intricate golden leaves and swirls. The background should be a dark color to contrast with the {inputPrompt} and cup, which should be primarily white or light-colored. The overall style should be vintage and elegant, with fine details to enhance the richness of the design.' },
    { src: '/img/imggeneration/3.jpeg', title: 'Minimal Logo', prompt: 'A minimalist, geometric emblem featuring a series of {inputPrompt} angular shapes stacked vertically. The design should include sharp, clean lines creating a modern and abstract pattern. The background should be {inputPrompt}, providing a contrast to the shapes. The overall style should be simple and sleek, emphasizing symmetry and precision.' },
    { src: '/img/imggeneration/4.jpeg', title: 'Text Tattoo', prompt: 'A tattoo design with the word {inputPrompt} in the center, written in an elegant, gothic font. Surrounding the word are intricate, ornate flourishes and decorative elements, giving the design a vintage and sophisticated look. The tattoo is black and gray, with fine details to enhance the richness and intricacy of the patterns. The overall style should be elegant and artistic, suitable for a tattoo.' },
    { src: '/img/imggeneration/5.jpeg', title: 'Signature', prompt: 'A logo design featuring the name {inputPrompt} in a stylish, elegant script font. The first letter {inputPrompt} should be creatively incorporated into a heart shape that flows seamlessly into the rest of the name. The text should be in a soft, pastel color such as lavender or light pink, set against a dark background to create a striking contrast. The design should convey elegance, femininity, and sophistication.' },
    { src: '/img/imggeneration/6.jpeg', title: 'Photographic', prompt: 'A photorealistic portrait of a {inputPrompt} with [HAIR TYPE AND COLOR]. The subject has a {inputPrompt} expression. The background features warm bokeh lights, creating a soft and dreamy atmosphere. The lighting should highlight the subject`s facial features, emphasizing {inputPrompt}. The overall style is elegant and photographic, with attention to detail in the subject`s appearance and the background lighting.' },
    { src: '/img/imggeneration/7.jpeg', title: 'Anime', prompt: 'An anime-style portrait of a {inputPrompt} with {inputPrompt}. The subject has a {inputPrompt} expression and is adorned with elegant jewelry, including {inputPrompt}. The background is filled with lush, vibrant flowers in shades of {inputPrompt}, creating a dreamy and romantic atmosphere. The overall style should be detailed and colorful, with a focus on the subject`s expressive eyes and delicate features.' },
    { src: '/img/imggeneration/8.jpeg', title: 'Digital Art', prompt: 'A digital art portrait of a {inputPrompt} with {inputPrompt}. The subject has a {inputPrompt} expression. The background features warm, golden bokeh lights, creating a soft and magical atmosphere. The lighting should highlight the subject`s facial features, emphasizing {inputPrompt}. The overall style is realistic with a touch of fantasy, capturing elegance and beauty.' },
    { src: '/img/imggeneration/9.jpeg', title: 'Fantasy Art', prompt: 'A fantasy art portrait of a {inputPrompt} with {inputPrompt}. The subject has a {inputPrompt} appearance, adorned with intricate jewelry and a glowing crown. The background is filled with magical, glowing lights and mystical symbols, creating an enchanting and otherworldly atmosphere. The overall style is detailed and fantastical, with vibrant colors and a focus on the subject`s captivating eyes and serene expression.' },
    { src: '/img/imggeneration/10.jpeg', title: 'Comic Book', prompt: 'A comic book style portrait of a {inputPrompt} with {inputPrompt}. The subject has a {inputPrompt} look, with sharp, defined features and striking eyes. The background is filled with detailed, vibrant flowers in shades of {inputPrompt}, creating a lively and artistic atmosphere. The overall style should be reminiscent of classic comic book art, with bold lines and vivid colors.' },
    { src: '/img/imggeneration/11.jpeg', title: 'Analog Film', prompt: 'A vintage-style portrait of a {inputPrompt} with {inputPrompt}, captured in an analog film look. The image is in black and white with a sepia tone, creating a nostalgic and timeless feel. The background features a soft floral pattern, adding to the classic atmosphere. The lighting is soft, highlighting the subject`s facial features and giving the portrait a gentle, elegant appearance. The overall style is reminiscent of old-fashioned film photography.' },
    { src: '/img/imggeneration/12.jpeg', title: 'Cinematic', prompt: 'A cinematic-style portrait of a {inputPrompt} with {inputPrompt}. The subject has a {inputPrompt} expression. The background features a soft bokeh effect with warm and cool tones, creating a dramatic and atmospheric look. The lighting should highlight the subject`s facial features, with a focus on their eyes. The overall style is cinematic and moody, capturing the essence of a film scene with high contrast and depth.' },
    { src: '/img/imggeneration/13.jpeg', title: 'Sticker', prompt: 'A Halloween-themed sticker featuring a {inputPrompt} with {inputPrompt}, surrounded by spooky elements. The {inputPrompt} is set against a dark, eerie background with a full moon and bats flying around. In the foreground, there are several carved pumpkins with menacing expressions, arranged around the base of the {inputPrompt}. The scene is framed by twisted, leafless trees and other spooky decorations. The overall style is cartoonish and fun, with a touch of spookiness suitable for Halloween.' },
    { src: '/img/imggeneration/14.jpeg', title: 'Tattoo', prompt: 'A tattoo design of a {inputPrompt} with intricate geometric patterns. The {inputPrompt} is highly detailed, with sharp, defined lines and a strong, intense expression. Surrounding the {inputPrompt} are various geometric shapes and patterns, creating a symmetrical and artistic look. The design is in black and gray, emphasizing the contrast and intricacy of the patterns. The overall style is bold and striking, suitable for a tattoo.' },
    { src: '/img/imggeneration/15.jpeg', title: 'Colored Tattoo', prompt: 'A colored tattoo design featuring a {inputPrompt} in {inputPrompt}. The {inputPrompt} is highly detailed, with vibrant {inputPrompt} in shades of {inputPrompt}. The background includes dynamic elements such as [BACKGROUND ELEMENTS] in complementary colors. The overall style is bold and striking, with a mix of realism and artistic flair, suitable for a {inputPrompt} tattoo.' },
    { src: '/img/imggeneration/16.jpeg', title: 'Enhance', prompt: 'A highly detailed and enhanced portrait of a {inputPrompt}. The subject has {inputPrompt} styled in an elegant updo with {inputPrompt}. She wears ornate jewelry, including {inputPrompt}. Her attire is sophisticated, with intricate {inputPrompt}. The background is simple and neutral to emphasize her features and the intricate details of her jewelry and outfit. The overall style is realistic with a touch of fantasy, capturing elegance and beauty.' },
    { src: '/img/imggeneration/17.jpeg', title: 'Isometric', prompt: 'An isometric view of a {inputPrompt} with {inputPrompt} rooftops and turrets. The structure is surrounded by a lush, vibrant landscape with greenery and pathways. The design is whimsical and fairytale-like, featuring detailed brickwork and ornate architectural elements. The background includes cliffs and water features to enhance the magical atmosphere. The overall style is bright and enchanting, with a playful and imaginative feel.' },
    { src: '/img/imggeneration/18.jpeg', title: 'Watercolor', prompt: 'A watercolor portrait of a {inputPrompt} with {inputPrompt}. The painting uses vibrant and dynamic colors, blending softly around the face to create a dreamy and artistic effect. The subject`s expression is serene and captivating, with detailed facial features that stand out against the abstract, colorful background. The overall style is impressionistic and fluid, capturing the essence of watercolor art with its soft edges and rich hues. ' },
    { src: '/img/imggeneration/19.jpeg', title: 'Line Art', prompt: 'A line art portrait of a {inputPrompt} with {inputPrompt}. The subject is adorned with intricate jewelry, including a detailed {inputPrompt}. The background features geometric patterns and abstract designs, adding depth and complexity to the image. The overall style is elegant and detailed, with fine lines and shading to emphasize the subject`s features and the ornate details of their accessories. ' },
    { src: '/img/imggeneration/20.jpeg', title: 'Low Poly', prompt: 'A low poly art style portrait of a {inputPrompt}. The subject`s face and hair are rendered in a geometric, polygonal style with sharp edges and facets. The colors are soft and muted, creating a harmonious and artistic look. The background is simple and complements the low poly aesthetic, emphasizing the subject`s features and the unique art style. The overall style is modern and abstract, capturing the essence of low poly art with its clean lines and geometric shapes.' },
    { src: '/img/imggeneration/21.jpeg', title: 'Origami', prompt: 'An origami {inputPrompt}, intricately folded with sharp, angular edges and vibrant colors. The {inputPrompt} is posed in a dynamic stance, with its body {inputPrompt}. The colors are rich and varied, with shades of {inputPrompt} creating a {inputPrompt}. The background is simple and dark to emphasize the {inputPrompt}`s detailed folds and structure. The overall style is realistic and artistic, capturing the essence of origami art with precise and detailed craftsmanship. ' },
    { src: '/img/imggeneration/22.jpeg', title: 'Neon Punk', prompt: 'A neon punk style portrait of a {inputPrompt} with vibrant, colorful hair and futuristic accessories. The subject wears glowing, neon-colored makeup and has high-tech headgear with illuminated elements. The attire is edgy and modern, with bright lights and neon colors integrated into the design. The background features a cyberpunk cityscape with neon signs and vibrant colors, creating a futuristic and energetic atmosphere. The overall style is bold and dynamic, capturing the essence of neon punk and cyberpunk aesthetics.' },
    { src: '/img/imggeneration/23.jpeg', title: '3D Model', prompt: 'A 3D model portrait of a {inputPrompt} with {inputPrompt}. The subject is wearing an elegant, shimmering outfit and a decorative headband. The lighting is soft and highlights the subject`s facial features, creating a glamorous and sophisticated look. The background features a bokeh effect with warm lights, enhancing the overall elegance and depth of the image. The style is realistic with attention to detail, capturing the essence of high-quality 3D modeling.' },
    { src: '/img/imggeneration/24.jpeg', title: 'Tile Texture', prompt: 'A portrait of a {inputPrompt} with {inputPrompt} and elegant earrings. The subject is set against a rich, ornate tile texture background featuring intricate floral and geometric patterns in shades of {inputPrompt}. The subject`s attire complements the background, adding to the overall elegance and sophistication of the image. The style is detailed and artistic, capturing the beauty and complexity of both the subject and the background.  ' },
    { src: '/img/imggeneration/25.jpeg', title: 'Pixel Art', prompt: 'A pixel art portrait of a {inputPrompt} with {inputPrompt}. The subject has {inputPrompt} eyes and a {inputPrompt} expression. The background is filled with detailed, vibrant flowers in shades of {inputPrompt}, creating a lively and artistic atmosphere. The overall style is reminiscent of classic pixel art, with bold colors and clear, defined pixels capturing the essence of the character and the floral background.  ' },
    { src: '/img/imggeneration/26.jpeg', title: 'Modeling Compound', prompt: 'A realistic 3D model portrait of a {inputPrompt} with {inputPrompt}. The subject has a modern and sophisticated look, wearing a stylish outfit with a choker. The lighting is soft and highlights the subject`s facial features, creating a glamorous and polished appearance. The background is set in a modern environment, such as an industrial or urban setting, with subtle details that complement the overall look. The style is highly detailed and realistic, capturing the essence of advanced 3D modeling techniques.  ' },
    { src: '/img/imggeneration/28.jpeg', title: 'American Comics', prompt: 'An American comic-style illustration featuring multiple panels depicting an action-packed scene. The main character is a {inputPrompt} with {inputPrompt} and a {inputPrompt}, resembling classic comic book heroes. The background includes dramatic elements such as explosions, urban landscapes, and intense confrontations. The colors are vivid and bold, with strong contrasts and detailed artwork typical of high-quality American comics. The overall style is dynamic and cinematic, capturing the essence of an exciting comic book narrative.' },
    { src: '/img/imggeneration/29.jpeg', title: 'Japanese Comics', prompt: 'A Japanese comic (manga) style illustration featuring multiple panels depicting a tranquil and detailed scene. The main character is a {inputPrompt} with {inputPrompt}, wearing {inputPrompt}. The backdrop is a peaceful countryside or a traditional Japanese village, with detailed wooden houses and lush greenery. The sky is bright blue with fluffy clouds, adding to the serene atmosphere. The overall style is detailed and delicate, capturing the essence of classic manga with its expressive characters and beautifully rendered backgrounds.' },
    { src: '/img/imggeneration/30.jpeg', title: 'Black White Comics', prompt: 'A black and white comic-style illustration featuring multiple panels depicting a detailed and artistic scene. The main character is a {inputPrompt} with {inputPrompt}, wearing {inputPrompt}. The backdrop is a {inputPrompt}, with detailed buildings and scenery. The overall style is reminiscent of classic manga, with expressive characters and beautifully rendered backgrounds, using only shades of black, white, and gray to create depth and contrast.' },
    { src: '/img/imggeneration/31.jpeg', title: 'Hong Kong Comics', prompt: 'A Hong Kong comic-style illustration featuring multiple panels depicting a vibrant and detailed scene. The main character is a {inputPrompt} with {inputPrompt}, wearing {inputPrompt}. The backdrop is a bustling urban environment, with detailed buildings, busy streets, and a lively atmosphere. The colors are rich and vibrant, capturing the essence of the city with its dynamic energy and intricate details. The overall style is detailed and expressive, reminiscent of classic Hong Kong comics.' },
    { src: '/img/imggeneration/32.jpeg', title: 'Cray One', prompt: 'Create a character with a stylized, sculptural look. The character should feature detailed textures and a minimalist color palette. Use muted earth tones like greys, browns, and soft reds. The character should have an ancient, mythological appearance with intricate clothing and accessories. Include elements like {inputPrompt}. The character should be placed in an environment with {inputPrompt}. The overall scene should evoke a sense of epic adventure and fantasy. Place the entire scene on a customized round base plate, similar to a display stand.' },

    // Add more predefined images and their prompts here
  ];
export default function ImageGeneration() {
  const [inputPrompt, setInputPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [model, setModel] = useState('sd3');
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [outputFormat, setOutputFormat] = useState('png');
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageOption | null>(null);
  const toast = useToast();
  const generatedImagesRef = useRef<HTMLDivElement>(null);
  const bg = useColorModeValue('gray.100', 'gray.900');
  const color = useColorModeValue('black', 'white');

  const handleGenerateImage = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setGeneratedImages([]);
      setIsLoading(true);

      let finalPrompt = '';
      if (selectedImage) {
        finalPrompt = selectedImage.prompt.replace(/{inputPrompt}/g, inputPrompt);
      }

      const response = await axios.post('/api/generateImage', {
        prompt: finalPrompt,
        negative_prompt: negativePrompt,
        aspect_ratio: aspectRatio,
        model,
        seed,
        output_format: outputFormat,
        numberOfImages,
      });

      const { images } = response.data;
      setGeneratedImages(images);

      toast({
        title: 'Images generated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      generatedImagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error generating images:', error.message);
        toast({
          title: 'Error generating images',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.error('Unexpected error:', error);
        toast({
          title: 'Unexpected error',
          description: 'An unexpected error occurred. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = (image: string) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = 'generated_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyImageURL = (image: string) => {
    navigator.clipboard.writeText(image).then(() => {
      toast({
        title: 'Image URL copied to clipboard',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    });
  };

  return (
    <Flex direction={['column', 'column', 'row']}>
      {/* Main content area */}
      <Box flex="1" p={8} color="">
        <Heading mb={6} textAlign="center">AI Image Generation</Heading>

        <Tabs variant="soft-rounded" colorScheme="purple">
          <TabList>
            <Tab>Generation History</Tab>
            {/* <Tab>Image Guidance</Tab>
            <Tab>Prompt Generation</Tab> */}
          </TabList>
          <TabPanels>
            <TabPanel>
              <Heading size="md" mb={4}>Generated Images:</Heading>
              {isLoading && (
                <Flex justifyContent="center" mb={4}>
                  <Spinner size="xl" />
                </Flex>
              )}
              <Flex flexWrap="wrap" justifyContent="center" ref={generatedImagesRef}>
                {generatedImages.map((image, index) => (
                  <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" width={['100%', '48%', '30%']} mr={4} mb={4}>
                    <Image src={image} alt={`Generated Image ${index + 1}`} />
                    <Flex justifyContent="center" mt={2}>
                      <Button
                        leftIcon={<DownloadIcon />}
                        colorScheme="purple"
                        size="sm"
                        mr={2}
                        onClick={() => handleDownloadImage(image)}
                      >
                        Download
                      </Button>
                      <Button
                        leftIcon={<CopyIcon />}
                        colorScheme="purple"
                        size="sm"
                        onClick={() => handleCopyImageURL(image)}
                      >
                        Copy URL
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </TabPanel>
            <TabPanel>
              <Text>Image Guidance content goes here...</Text>
            </TabPanel>
            <TabPanel>
              <Text>Prompt Generation content goes here...</Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Sidebar for controls and style selection */}
      <Box
        p={4}
        w={['100%', '100%', '300px']}
        bg="rgba(0, 0, 0, 0.5)"
        color="white"
        backdropFilter="blur(10px)"
        height={['auto', 'auto', '100vh']}
        overflowY="auto"
      >
        <Heading size="md" mb={4}>Controls</Heading>

        <form onSubmit={handleGenerateImage}>
          <Flex mb={4} direction="column">
            <Textarea
              placeholder="Type a prompt..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              size="md"
              bg="transparent"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: 'gray.500' }}
              mb={2}
            />
            <Textarea
              placeholder="Negative prompt..."
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              size="md"
              bg="transparent"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: 'gray.500' }}
              mb={2}
            />
            <Flex mb={2} alignItems="center">
              <Text mr={2}>Aspect Ratio:</Text>
              <Select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} bg="transparent" borderColor="gray.600" color="white">
                <option value="16:9">16:9</option>
                <option value="1:1">1:1</option>
                <option value="21:9">21:9</option>
                <option value="2:3">2:3</option>
                <option value="3:2">3:2</option>
                <option value="4:5">4:5</option>
                <option value="5:4">5:4</option>
                <option value="9:16">9:16</option>
                <option value="9:21">9:21</option>
              </Select>
            </Flex>
            <Flex mb={2} alignItems="center">
              <Text mr={2}>Model:</Text>
              <Select value={model} onChange={(e) => setModel(e.target.value)} bg="transparent" borderColor="gray.600" color="white">
                <option value="sd3">SD3</option>
                <option value="sd3-turbo">SD3 Turbo</option>
              </Select>
            </Flex>
            <Flex mb={2} alignItems="center">
              <Text mr={2}>Seed:</Text>
              <Input
                type="number"
                placeholder="Seed"
                value={seed}
                onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
                bg="transparent"
                borderColor="gray.600"
                color="white"
                _hover={{ borderColor: 'gray.500' }}
              />
            </Flex>
            <Flex mb={2} alignItems="center">
              <Text mr={2}>Output Format:</Text>
              <Select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} bg="transparent" borderColor="gray.600" color="white">
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
              </Select>
            </Flex>
            <Flex mb={2} alignItems="center">
              <Text mr={2}>Number of Images:</Text>
              <Slider
                aria-label="slider-ex-1"
                defaultValue={1}
                min={1}
                max={10}
                step={1}
                value={numberOfImages}
                onChange={(val) => setNumberOfImages(val)}
                flex="1"
                mr={4}
              >
                <SliderTrack bg="gray.700">
                  <SliderFilledTrack bg="purple.500" />
                </SliderTrack>
                <SliderThumb boxSize={6}>
                  <Box color="purple.500" />
                </SliderThumb>
              </Slider>
              <Text>{numberOfImages}</Text>
            </Flex>
            <Button
              colorScheme="purple"
              size="md"
              type="submit"
              isLoading={isLoading}
              px={10}
              mt={4}
            >
              Generate
            </Button>
          </Flex>
        </form>

        <Heading size="md" mb={4}>Select Style:</Heading>
        <SimpleGrid columns={[1, 2]} spacing={1}>
          {predefinedImages.map((imageOption, index) => (
            <Tooltip label={imageOption.title} aria-label={imageOption.title} key={index}>
              <Box
                borderWidth={selectedImage?.src === imageOption.src ? '2px' : '1px'}
                borderColor={selectedImage?.src === imageOption.src ? 'blue.500' : 'gray.200'}
                borderRadius="lg"
                overflow="hidden"
                cursor="pointer"
                onClick={() => setSelectedImage(imageOption)}
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.05)', borderColor: 'blue.500' }}
              >
                <Image src={imageOption.src} alt={imageOption.title} />
                <Text mt={2} textAlign="center">
                  {imageOption.title}
                </Text>
              </Box>
            </Tooltip>
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
}
