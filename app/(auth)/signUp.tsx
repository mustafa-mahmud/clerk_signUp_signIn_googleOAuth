import { useAuth, useSignUp } from '@clerk/expo';
import { type Href, Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');

  const handleSubmit = async () => {
    //create temp user virtualy
    const { error } = await signUp.create({
      emailAddress: 'mithuweb000@gmail.com',
      //@ts-ignore
      password: 'IMDB!@#$123456789',
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    //send verification code
    if (!error) await signUp.verifications.sendEmailCode();
  };

  //send new verification code
  const newVerifyCodeSend = async () => {
    await signUp.verifications.sendEmailCode();
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
      <Modal
        isVisible={true}
        className="p-4"
        style={{ margin: 0 }}
        statusBarTranslucent={true}
      >
        <View className="bg-white p-5 rounded-md">
          <Text className="text-xl">Verify your account</Text>
          <TextInput
            className="border border-blue-200 rounded-lg px-2 bg-white"
            value={code}
            placeholder="Enter your verification code"
            placeholderTextColor="#666666"
            onChangeText={(code) => setCode(code)}
            keyboardType="numeric"
          />

          <Pressable
            className="bg-blue-300 p-2.5 my-5 rounded-md"
            onPress={handleVerify}
          >
            <Text className="text-center">Verify</Text>
          </Pressable>
          <Pressable
            onPress={newVerifyCodeSend}
            className="bg-gray-300 self-center p-1.5 rounded-md"
          >
            <Text className="text-center text-[10px] px-5">
              I need a new code{' '}
            </Text>
          </Pressable>
        </View>
      </Modal>
    );
  }

  ///////////////////////////////////////////////////////////
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
