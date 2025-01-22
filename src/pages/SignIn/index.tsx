import { Box, Container, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { PrimaryButton, TextButton } from '../../components/Buttons/Buttons';
import { PageHeader } from '../../components/PageHeader';
import { EMAIL_REGEX /*, PASSWORD_REGEX*/ } from '../../utils/validators';
import { useContext } from 'react';
import { AuthenticationContext } from '../../contexts/Authentication';

type LoginRequest = {
  email: string;
  password: string;
};

const SignInPage = () => {
  const authContext = useContext(AuthenticationContext);
  if (!authContext) {
    throw new Error('AuthenticationContext is not provided');
  }
  const { login } = authContext;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
      // Optionally display an error message to the user
    }
  };

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 16,
        paddingBottom: 16,
        height: '100vh',
        width: '90vw'
      }}
    >
      <PageHeader previousPage="/get-started" />
      <Box
        component="form"
        display="flex"
        onSubmit={handleSubmit(onSubmit)}
        style={{
          justifyContent: 'space-between',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        <Box>
          <Box style={{ paddingTop: 12, paddingBottom: 12, marginBottom: 16 }}>
            <Title order={1}>Welcome back.</Title>
            <Text>Log in to your account</Text>
          </Box>

          {/* Email Input */}
          <TextInput
            placeholder="Email Address"
            style={{ marginBottom: 16 }}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: EMAIL_REGEX,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />

          <PasswordInput
            placeholder="Password"
            style={{ marginBottom: 24 }}
            {...register('password', {
              required: 'Password is required',
            })}
            error={errors.password?.message}
          />
        </Box>

        <Box>
          <PrimaryButton
            type="submit"
            style={{ width: '100%', marginBottom: 16 }}
          >
            Log in
          </PrimaryButton>
          <Box component={Link} to="/forgot-password" style={{ width: '100%' }}>
            <TextButton style={{ width: '100%' }}>
              Having trouble with your account?
            </TextButton>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignInPage;
