import { useLocalSearchParams } from 'expo-router';
import { Text } from 'tamagui';

export default function Profile() {
  const { id } = useLocalSearchParams();
  console.log('id', id);
  return (
    <>
      <Text>Profile</Text>
      <Text>{id}</Text>
    </>
  );
}


