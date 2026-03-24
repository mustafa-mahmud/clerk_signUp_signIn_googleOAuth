import { useAuth, useSignUp } from '@clerk/expo';
import { type Href, Link, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');

  const handleSubmit = async () => {
    const { error } = await signUp.create({
      emailAddress: 'mithuweb000@gmail.com',
      //@ts-ignore
      password: 'IMDB!@#$123456789',
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl('/');
          if (url.startsWith('http')) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });
    } else {
      console.error('Sign-up attempt not complete:', signUp);
    }
  };

  if (signUp.status === 'complete' || isSignedIn) {
    return null;
  }

  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View>
        <Text>Verify your account</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />
        {errors && (
          <Text className="text-[10px] text-red-300">
            Some wrong in sign up
          </Text>
        )}

        <Pressable onPress={handleVerify} disabled={fetchStatus === 'fetching'}>
          <Text>Verify</Text>
        </Pressable>
        <Pressable>
          <Text>I need a new code</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4">
      <Text className="text-xl mb-5">Sign up</Text>
      <Text className="">Email address</Text>
      <TextInput
        className="border border-blue-200 rounded-lg px-2 bg-white"
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#666666"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        keyboardType="email-address"
      />
      <Text className="mt-5">Password</Text>
      <TextInput
        className="border border-blue-200 rounded-lg px-2 bg-white"
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#666666"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Pressable
        className="bg-blue-300 rounded-md my-7 p-2.5"
        onPress={handleSubmit}
        disabled={!emailAddress || !password || fetchStatus === 'fetching'}
      >
        <Text className="text-center">Sign up</Text>
      </Pressable>

      <View className="flex-row">
        <Text className="flex-1">Already have an account ? </Text>
        <Link href="/signIn">
          <Text style={{ color: '#0a7ea4' }}>Sign in </Text>
        </Link>
      </View>

      <View nativeID="clerk-captcha" />
    </SafeAreaView>
  );
}
