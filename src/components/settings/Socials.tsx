'use client';
// Chakra imports
import React, { useState, useEffect } from 'react';
import { Flex, FormControl, Text, useColorModeValue } from '@chakra-ui/react';
import Card from '@/components/card/Card';
import InputField from '@/components/fields/InputField';

import { auth } from '../../../config/firebase';
import { fetchUserDetails } from '../../../config/firebaseUtils';

interface SocialsProps {
  twitter: string;
  setTwitter: (value: string) => void;
  facebook: string;
  setFacebook: (value: string) => void;
  github: string;
  setGithub: (value: string) => void;
  textColorPrimary?: string;
  textColorSecondary?: string;
}

const Socials: React.FC<SocialsProps> = ({
  twitter, setTwitter,
  facebook, setFacebook,
  github, setGithub,
  textColorPrimary = "white", // Defaulting to black, adjust as needed
  textColorSecondary = "gray" // Defaulting to gray, adjust as needed
}) => {

  useEffect(() => {
    const fetchData = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const userDetails = await fetchUserDetails(uid);
        setTwitter(userDetails?.twitter || "");
        setFacebook(userDetails?.facebook || "");
        setGithub(userDetails?.github || "");
      }
    };
    fetchData();
  }, []);

  return (
      <FormControl>
          <Card mb="20px" pb="50px" h="100%">
              <Flex direction="column" mb="40px">
                  <Text
                      fontSize="xl"
                      color={textColorPrimary}
                      mb="6px"
                      fontWeight="bold"
                  >
                      Social Profiles
                  </Text>
                  <Text fontSize="md" fontWeight="500" color={textColorSecondary}>
                      Here you can set user social profiles
                  </Text>
              </Flex>
              <InputField
                  mb="25px"
                  id="twitter_username"
                  label="Twitter Username"
                  placeholder="Twitter Username"
                  value={twitter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTwitter(e.target.value)}
              />
              <InputField
                  mb="25px"
                  id="facebook_username"
                  label="Facebook Username"
                  placeholder="Facebook Username"
                  value={facebook}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFacebook(e.target.value)}
              />
              <InputField
                  mb="25px"
                  id="github_username"
                  label="Github Username"
                  placeholder="Github Username"
                  value={github}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGithub(e.target.value)}
              />
          </Card>
      </FormControl>
  );
}

export default Socials;