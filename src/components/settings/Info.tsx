'use client';
// Chakra imports
import {
  Flex,
  FormControl,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from '@/components/card/Card';
import InputField from '@/components/fields/InputField';
import TextField from '@/components/fields/TextField';

import { useState, useEffect } from 'react';
import { auth } from '../../../config/firebase';
import { fetchUserDetails } from '../../../config/firebaseUtils';

import { ChangeEvent } from 'react';

type InfoProps = {
  username: string;
  setUsername: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  job: string;
  setJob: (value: string) => void;
  about: string;
  setAbout: (value: string) => void;
};

export default function Info({
  username, setUsername,
  email, setEmail,
  firstName, setFirstName,
  lastName, setLastName,
  job, setJob,
  about, setAbout
}: InfoProps) {

  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [job, setJob] = useState("");
  // const [about, setAbout] = useState("");

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.500';

  useEffect(() => {
    const fetchData = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const userDetails = await fetchUserDetails(uid);
        setUsername(userDetails?.username || "");
        setEmail(userDetails?.email || "");
        setFirstName(userDetails?.first_name || "");
        setLastName(userDetails?.last_name || "");
        setJob(userDetails?.job || "");
        setAbout(userDetails?.about || "");
      }
    };
    fetchData();
  }, []);

  return (

    <FormControl>
      <Card>
        <Flex direction="column" mb="40px">
          <Text
            fontSize="xl"
            color={textColorPrimary}
            mb="6px"
            fontWeight="bold"
          >
            Account Settings
          </Text>
          <Text fontSize="md" fontWeight="500" color={textColorSecondary}>
            Here you can change user account information
          </Text>
        </Flex>
        <SimpleGrid
          columns={{ sm: 1, md: 2 }}
          spacing={{ base: '20px', xl: '20px' }}
        >
          <InputField
            mb="10px"
            me="30px"
            id="username"
            label="Username"
            placeholder="@parkson.adela"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          />
          <InputField
            mb="10px"
            id="email"
            label="Email Address"
            placeholder="hello@horizon-ui.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          <InputField
            mb="10px"
            me="30px"
            id="first_name"
            label="First Name"
            placeholder="Adela"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
          />
          <InputField
            mb="20px"
            id="last_name"
            label="Last Name"
            placeholder="Parkson"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
          />
        </SimpleGrid>
        <InputField
          id="job"
          label="Job"
          placeholder="Web Developer"
          value={job}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJob(e.target.value)}
        />
        <TextField
          id="about"
          label="About Me"
          minH="150px"
          placeholder="Tell something about yourself in 150 characters!"
          value={about}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAbout(e.target.value)}
        />
      </Card>
    </FormControl>
  );
}
