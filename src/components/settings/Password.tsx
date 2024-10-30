import React, { useState } from 'react';
import { FormControl, Flex, Text, useToast, useColorModeValue, Button } from '@chakra-ui/react';
import Card from '@/components/card/Card';
import InputField from '@/components/fields/InputField';
import { auth } from '../../../config/firebase';
import { User } from 'firebase/auth';
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';

const Password: React.FC = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const toast = useToast();

    // Define the text colors based on the color mode
    const textColorPrimary = useColorModeValue("black", "white");
    const textColorSecondary = useColorModeValue("gray.600", "gray.300");

    const handlePasswordChange = async () => {
      if (newPassword !== confirmPassword) {
          toast({
              title: "Error",
              description: "New password and confirmation do not match.",
              status: "error",
              duration: 3000,
              isClosable: true,
          });
          return;
      }
  
      const user = auth.currentUser;
  
      if (user && oldPassword) {
          // Re-authenticate the user first

          if (!user.email) {
            toast({
                title: "Error",
                description: "Email not found. Please sign in again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        
          const credentials = EmailAuthProvider.credential(user.email, oldPassword);
          
          reauthenticateWithCredential(user, credentials)
              .then(() => {
                  // User re-authenticated, now update the password
                  return updatePassword(user, newPassword);
              })
              .then(() => {
                  toast({
                      title: "Success",
                      description: "Password updated successfully.",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                  });
              })
              .catch((error: any) => {
                  toast({
                      title: "Error",
                      description: error.message,
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                  });
              });
      }
  }
  

    return (
        <FormControl>
            <Card>
                <Flex direction="column" mb="20px">
                    <Text
                        fontSize="xl"
                        color={textColorPrimary}
                        mb="6px"
                        fontWeight="bold"
                    >
                        Change password
                    </Text>
                    {/* <Text fontSize="md" fontWeight="500" color={textColorSecondary}>
                        Here you can set your new password
                    </Text> */}
                </Flex>
                <FormControl>
                    <Flex flexDirection="column">
                        <InputField
                            mb="20px"
                            id="old"
                            label="Old Password"
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
                        />
                        <InputField
                            mb="20px"
                            id="new"
                            label="New Password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                        />
                        <InputField
                            mb="20px"
                            id="confirm"
                            label="New Password Confirmation"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                        />
                    </Flex>
                </FormControl>
                <Button mt="4" variant="primary" onClick={handlePasswordChange}>
                    Change Password
                </Button>
            </Card>
        </FormControl>
    );
}

export default Password;
