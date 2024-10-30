'use client';

// Chakra imports
import { Box, Flex, SimpleGrid } from '@chakra-ui/react';

import Info from '@/components/settings/Info';
import Password from '@/components/settings/Password';
import Profile from '@/components/settings/Profile';
import Socials from '@/components/settings/Socials';
import Delete from '@/components/settings/Delete';
import avatar1 from '../../public/img/avatars/avatar4.png';
import { useState } from 'react';

export default function Settings() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [job, setJob] = useState("");
  const [about, setAbout] = useState("");

  const [twitter, setTwitter] = useState<string>('');
  const [facebook, setFacebook] = useState<string>('');
  const [github, setGithub] = useState<string>('');

  // State for selected avatar
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
      <SimpleGrid columns={{ sm: 1, lg: 2 }} spacing="20px" mb="20px">
        <Flex direction="column">
          <Profile 
            name="John Doe"
            banner="path_to_banner_image" 
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={setSelectedAvatar}
          />
          <Info
            username={username} setUsername={setUsername}
            email={email} setEmail={setEmail}
            firstName={firstName} setFirstName={setFirstName}
            lastName={lastName} setLastName={setLastName}
            job={job} setJob={setJob}
            about={about} setAbout={setAbout}
          />
        </Flex>
        <Flex direction="column" gap="20px">
          <Socials 
            twitter={twitter} 
            setTwitter={setTwitter}
            facebook={facebook} 
            setFacebook={setFacebook}
            github={github} 
            setGithub={setGithub}
          />
          <Password />
        </Flex>
      </SimpleGrid>
      <Delete
        username={username}
        email={email}
        firstName={firstName}
        lastName={lastName}
        job={job}
        about={about}
        twitter={twitter}
        facebook={facebook}
        github={github}
        // selectedAvatar={selectedAvatar}
        uid={''}            
      />
    </Box>
  );
}
