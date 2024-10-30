// pages/MusicStudio.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Textarea,
  VStack,
  useColorMode,
  useColorModeValue,
  useToast,
  Center,
  IconButton,
  Grid,
} from '@chakra-ui/react';
import axios from 'axios';
import { doc, getDoc, setDoc, collection, query, getDocs, orderBy, writeBatch } from 'firebase/firestore';
import { firestore, auth } from '../../config/firebase';
import { useAPIUsage } from '../../constants/APIUsageContext';
import { FaThumbsUp, FaThumbsDown, FaDownload } from 'react-icons/fa';
import { onAuthStateChanged, User } from 'firebase/auth';

interface ShowcaseCardProps {
  title: string;
  description: string;
  image: string;
  author: string;
  views: string;
  likes: string;
  onClick: () => void;
}

const ShowcaseCard = ({ title, description, image, author, views, likes, onClick }: ShowcaseCardProps) => (
  <Box
    bg={useColorModeValue('blue.50', 'purple.800')}
    borderRadius="md"
    p={4}
    w="full"
    h="350px"
    boxShadow="md"
    onClick={onClick}
    cursor="pointer"
    transition="transform 0.2s"
    _hover={{ transform: 'scale(1.05)' }}
  >
    <img src={image} alt={title} style={{ borderRadius: '8px', marginBottom: '8px', objectFit: 'cover', height: '200px', width: '100%' }} />
    <Heading size="sm" mt={2} noOfLines={2}>
      {title}
    </Heading>
    <Text mt={2} noOfLines={3}>
      {description}
    </Text>
  </Box>
);

const ExpandedTicket = ({ item, onClose }: { item: any; onClose: () => void }) => (
  <Box
    bg={useColorModeValue('purple.100', 'purple.800')}
    borderRadius="md"
    p={4}
    w="full"
    boxShadow="lg"
    mb={4}
    maxWidth="100%"
    mt={10}
  >
    <Flex direction={{ base: 'column', md: 'row' }}>
      <Box maxWidth="400px" mx="auto" flex="1">
        <img src={item.image} alt={item.description} style={{ borderRadius: '8px', marginBottom: '8px', objectFit: 'cover', width: '100%' }} />
      </Box>
      <Box flex="2" pl={{ md: 4 }}>
        <Heading size="lg" mt={2} noOfLines={1}>
          {item.description}
        </Heading>
        <Text mt={2} noOfLines={1}>
          Style: {item.style}
        </Text>
        <Text mt={2} noOfLines={1}>
          Instruments: {item.instruments.join(', ')}
        </Text>
        <Box mt={2} maxH="250px" overflowY="auto">
          <Heading size="md" mb={2}>
            Lyrics:
          </Heading>
          {item.lyrics.split('\n').map((line: string, index: number) => (
            <Text key={index} mt={index === 0 ? 0 : 1}>
              {line}
            </Text>
          ))}
        </Box>
        <Box mt={2}>
          <audio controls src={item.music} style={{ width: '100%' }} />
        </Box>
        <Button mt={4} onClick={onClose} colorScheme="purple">
          Close
        </Button>
      </Box>
    </Flex>
  </Box>
);

const MusicStudio = () => {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('');
  const [instruments, setInstruments] = useState<string[]>([]);
  const [clipsData, setClipsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [textToMusicCredit, setTextToMusicCredit] = useState<number>(500);
  const [user, setUser] = useState<User | null>(null);
  const [libraryData, setLibraryData] = useState<any[]>([]);
  const [showcaseData, setShowcaseData] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.900');
  const color = useColorModeValue('black', 'white');
  const { setUsage } = useAPIUsage();

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const docRef = doc(firestore, 'price', 'credits');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Text2Music:', data.textToMusic);
          setTextToMusicCredit(data.textToMusic);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching credit values:', error);
      }
    };

    fetchCredits();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchLibraryData(user.email);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchShowcaseData();
  }, []);

  const fetchLibraryData = async (email: string | null) => {
    if (!email) return;
    try {
      const q = query(collection(firestore, 'music'), orderBy('time', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());
      setLibraryData(data.filter(item => item.email === email));
    } catch (error) {
      console.error('Error fetching library data:', error);
    }
  };

  const fetchShowcaseData = async () => {
    try {
      const q = query(collection(firestore, 'music'), orderBy('time', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());
      setShowcaseData(shuffleArray(data));
    } catch (error) {
      console.error('Error fetching showcase data:', error);
    }
  };

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleGenerateMusic = async () => {
    if (!text || !style || instruments.length === 0) {
      toast({
        title: 'All fields are required',
        description: 'Please enter all details to generate music',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const instrumentsString = instruments.join(', ');
    const prompt = `${text} in the style of ${style} with ${instrumentsString} and don't consist ${style} & ${instrumentsString} in lyrics.`;

    setIsLoading(true);
    try {
      const response = await axios.post('/api/generateMusic', {
        prompt,
      });

      const musicData = response.data;
      setClipsData(musicData);
      setUsage(textToMusicCredit);

      if (user) {
        await saveAllMusicDataToFirestore(musicData);
        fetchLibraryData(user.email);
        fetchShowcaseData();
      }

      toast({
        title: 'Music generated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error generating music:', error);
      toast({
        title: 'Error generating music',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveAllMusicDataToFirestore = async (musicData: any) => {
    if (!user?.email) return;
    try {
      const batch = writeBatch(firestore);
      musicData.forEach((clip: any) => {
        const musicDocRef = doc(collection(firestore, 'music'));
        batch.set(musicDocRef, {
          description: text,
          style,
          instruments,
          image: clip.image_url,
          lyrics: clip.meta_data.prompt,
          music: clip.audio_url,
          time: new Date(),
          email: user.email,
        });
      });
      await batch.commit();

      console.log('All music data saved to Firestore successfully');
    } catch (error) {
      console.error('Error saving music data to Firestore:', error);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'music.mp3');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('Error downloading the file:', error);
      toast({
        title: 'Error downloading music',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const renderPrompt = (prompt: string) => {
    return prompt.split('\n').map((line, index) => (
      <Text key={index} mt={index === 0 ? 0 : 1}>
        {line}
      </Text>
    ));
  };

  return (
    <Box minH="100vh" bg={bg} color={color} p={4}>
      <Heading p={6} textAlign="center" color="purple.500">
        Music Studio
      </Heading>
      <Tabs variant="soft-rounded" colorScheme="purple" p={6}>
        <TabList justifyContent="center" flexWrap="wrap">
          <Tab>Home</Tab>
          <Tab>Create</Tab>
          <Tab>Library</Tab>
          <Tab>Explore</Tab>
          <Tab>Search</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {selectedItem ? (
              <ExpandedTicket item={selectedItem} onClose={() => setSelectedItem(null)} />
            ) : (
              <>
                <Heading mb={4}>Showcase</Heading>
                <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(5, 1fr)' }} gap={6}>
                  {showcaseData.map((item, index) => (
                    <ShowcaseCard
                      key={index}
                      title={item.description}
                      description={item.description}
                      image={item.image}
                      author={item.email}
                      views={`${Math.floor(Math.random() * 1000)}K`}
                      likes={`${Math.floor(Math.random() * 100)}K`}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </Grid>
              </>
            )}
          </TabPanel>

          <TabPanel>
            <Flex minH="50vh" bg={bg} color={color} direction={{ base: 'column', md: 'row' }}>
              <Box
                width={{ base: '100%', md: '25%' }}
                p={6}
                boxShadow="lg"
                borderRadius="md"
                bg={useColorModeValue('gray.50', 'gray.700')}
                mr={{ md: 6 }}
                mb={{ base: 6, md: 0 }}
              >
                <VStack spacing={6} width="full">
                  <Heading size="lg" textAlign="center" color="purple.500">
                    Create Music
                  </Heading>
                  <FormControl id="text-input" isRequired>
                    <FormLabel>Enter Song Description</FormLabel>
                    <Textarea
                      placeholder="Enter text here..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                      color={color}
                      size="lg"
                      resize="vertical"
                      minHeight="150px"
                    />
                  </FormControl>
                  <FormControl id="style-select" isRequired>
                    <FormLabel>Select Music Style</FormLabel>
                    <Select placeholder="Select style" value={style} onChange={(e) => setStyle(e.target.value)}>
                      <option value="pop">Pop</option>
                      <option value="rap">Rap</option>
                      <option value="rock">Rock</option>
                      <option value="classical">Classical</option>
                      <option value="jazz">Jazz</option>
                      <option value="hip-hop">Hip-Hop</option>
                      <option value="country">Country</option>
                      <option value="blues">Blues</option>
                      <option value="electronic">Electronic</option>
                      <option value="reggae">Reggae</option>
                      <option value="metal">Metal</option>
                      <option value="folk">Folk</option>
                      <option value="punk">Punk</option>
                      <option value="R&B">R&B</option>
                      <option value="soul">Soul</option>
                      <option value="funk">Funk</option>
                      <option value="latin">Latin</option>
                      <option value="disco">Disco</option>
                      <option value="house">House</option>
                      <option value="techno">Techno</option>
                      <option value="ambient">Ambient</option>
                    </Select>
                  </FormControl>
                  <FormControl id="instrument-select" isRequired>
                    <FormLabel>Select Instruments</FormLabel>
                    <CheckboxGroup
                      value={instruments}
                      onChange={(values: (string | number)[]) => setInstruments(values as string[])}
                    >
                      <VStack align="start">
                        <Checkbox value="guitar">Guitar</Checkbox>
                        <Checkbox value="piano">Piano</Checkbox>
                        <Checkbox value="violin">Violin</Checkbox>
                        <Checkbox value="drums">Drums</Checkbox>
                        <Checkbox value="saxophone">Saxophone</Checkbox>
                        <Checkbox value="trumpet">Trumpet</Checkbox>
                        <Checkbox value="flute">Flute</Checkbox>
                        <Checkbox value="cello">Cello</Checkbox>
                        <Checkbox value="harmonica">Harmonica</Checkbox>
                        <Checkbox value="accordion">Accordion</Checkbox>
                        <Checkbox value="banjo">Banjo</Checkbox>
                        <Checkbox value="clarinet">Clarinet</Checkbox>
                        <Checkbox value="harp">Harp</Checkbox>
                        <Checkbox value="mandolin">Mandolin</Checkbox>
                        <Checkbox value="synthesizer">Synthesizer</Checkbox>
                        <Checkbox value="ukulele">Ukulele</Checkbox>
                        <Checkbox value="viola">Viola</Checkbox>
                        <Checkbox value="trombone">Trombone</Checkbox>
                      </VStack>
                    </CheckboxGroup>
                  </FormControl>
                  <Button
                    colorScheme="purple"
                    onClick={handleGenerateMusic}
                    isLoading={isLoading}
                    size="lg"
                    width="full"
                  >
                    Create
                  </Button>
                </VStack>
              </Box>
              <Box
                width={{ base: '100%', md: '75%' }}
                p={6}
                boxShadow="lg"
                borderRadius="md"
                bg={useColorModeValue('gray.50', 'gray.700')}
                overflowY="auto"
              >
                {isLoading && <Spinner size="xl" mt={4} />}
                {clipsData.length > 0 && (
                  <>
                    <Divider />
                    {clipsData.map((clip, index) => (
                      <Box key={index} mt={5} mb={20} width="full" textAlign="left">
                        <Flex direction={{ base: 'column', md: 'row' }}>
                          <Box width={{ base: '100%', md: '30%' }}>
                            {clip.image_url && (
                              <img
                                src={clip.image_url || clip.image_large_url}
                                alt="Generated Image"
                                style={{ borderRadius: '8px', marginBottom: '8px', width: '100%', height: 'auto' }}
                              />
                            )}
                            {clip.audio_url && (
                              <Box mt={2} width="100%">
                                <audio controls src={clip.audio_url} style={{ width: '100%' }} />
                              </Box>
                            )}
                          </Box>
                          <Box width={{ base: '100%', md: '70%' }} pl={{ md: 4 }} maxH="250px" overflowY="auto">
                            <Heading size="md" mb={2}>
                              Lyrics:
                            </Heading>
                            {renderPrompt(clip.meta_data.prompt)}
                          </Box>
                        </Flex>
                        <HStack mt={4} justify="center">
                          <IconButton
                            icon={<FaThumbsUp />}
                            aria-label="Like"
                            colorScheme="green"
                          />
                          <IconButton
                            icon={<FaThumbsDown />}
                            aria-label="Dislike"
                            colorScheme="red"
                          />
                          <IconButton
                            icon={<FaDownload />}
                            aria-label="Download"
                            colorScheme="blue"
                            onClick={() => handleDownload(clip.audio_url)}
                          />
                        </HStack>
                      </Box>
                    ))}
                  </>
                )}
              </Box>
            </Flex>
          </TabPanel>

          <TabPanel>
            {selectedItem ? (
              <ExpandedTicket item={selectedItem} onClose={() => setSelectedItem(null)} />
            ) : (
              <>
                <Heading mb={4}>Library</Heading>
                <Grid templateColumns={{ base: 'repeat(auto-fit, minmax(150px, 1fr))', md: 'repeat(5, 1fr)' }} gap={4}>
                  {libraryData.map((item, index) => (
                    <Box
                      key={index}
                      // bg={useColorModeValue('purple.100', 'purple.800')}
                      borderRadius="md"
                      p={4}
                      width="280px"
                      h="auto"
                      boxShadow="lg"
                      onClick={() => setSelectedItem(item)}
                      cursor="pointer"
                    >
                      <img src={item.image} alt={item.description} style={{ borderRadius: '8px', marginBottom: '8px', objectFit: 'cover', height: '200px', width: '100%' }} />
                      <Heading size="sm" mt={2} noOfLines={1}>
                        {item.description}
                      </Heading>
                      <Text mt={2} noOfLines={1}>
                        Style: {item.style}
                      </Text>
                      <Text mt={2} noOfLines={1}>
                        Instruments: {item.instruments.join(', ')}
                      </Text>
                      <Box mt={2}>
                        <audio controls src={item.music} style={{ width: '100%' }} />
                      </Box>
                    </Box>
                  ))}
                </Grid>
              </>
            )}
          </TabPanel>

          <TabPanel>
            <Heading>Explore</Heading>
            {/* Add content for the Explore tab */}
          </TabPanel>

          <TabPanel>
            <Heading>Search</Heading>
            {/* Add content for the Search tab */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MusicStudio;
