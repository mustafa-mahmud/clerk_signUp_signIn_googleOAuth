import { useAuth, useUser } from '@clerk/expo';
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const Profile = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

  ///////////////////////////////////////////////////
  return (
    <SafeAreaView className="bg-gray-200 flex-1">
      <View className="w-full items-cente">
        {/* Header Part */}
        <View className="items-center">
          <View>
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="size-28 rounded-xl"
              />
            ) : (
              <Ionicons name="person" size={28} color={'#fff'} />
            )}
          </View>
          <Text className="text-xl my-2">{user?.firstName || 'User'} </Text>
          <Text className="text-center text-[11px] text-purple-400">
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        {/* Card Part */}
        <View className="w-full p-5">
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row bg-white p-4 rounded-t-2xl border-b"
          >
            <Ionicons name="settings-outline" size={24} color={'#2563eb'} />
            <Text className="ml-5">Account Settings </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            className="flex-row bg-white p-4 rounded-b-2xl"
          >
            <Ionicons name="log-out-outline" size={24} color={'#2563eb'} />
            <Text className="ml-5">Security </Text>
          </TouchableOpacity>
        </View>

        <View className="p-3">
          <TouchableOpacity
            onPress={handleSignOut}
            activeOpacity={0.85}
            className="flex-row bg-orange-600 p-4 rounded-2xl justify-center"
          >
            <Ionicons name="log-out-outline" size={24} color={'#fff'} />
            <Text className="ml-5 text-white">Sign Out </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
