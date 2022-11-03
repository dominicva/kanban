import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

export default function PasswordInput({
  error,
}: {
  error?: {
    message: string;
    type: 'form' | 'password' | 'username' | 'unknown';
  };
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl isInvalid={error?.type === 'password'}>
      <FormLabel>Password</FormLabel>
      <InputGroup>
        <Input type={showPassword ? 'text' : 'password'} name="password" />
        <InputRightElement>
          <IconButton
            variant={'icon'}
            aria-label={`${showPassword ? 'Hide' : 'Show'} password`}
            icon={showPassword ? <HiEyeOff /> : <HiEye />}
            onClick={() => setShowPassword(!showPassword)}
          />
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
}
