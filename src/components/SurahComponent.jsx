import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

export const SurahComponent = ({ item, index, cat_id }) => {

  const navigation = useNavigation();


  return (
    <>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('MediaPlayer', {
            item: {
              ...item,
              cat_id,
            }
          })
        }
        style={{
          backgroundColor: 'rgba(187, 148, 87, 0.8)',
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 10,
          marginVertical: 10,
        }}>
        {/* {console.log('item', item)} */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <ImageBackground
            source={require('../../src/assets/image4.png')}
            resizeMode="cover"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              tintColor: 'white',
              width: 40,
              height: 40,
            }}>
            <Text
              style={{
                color: 'black',
                borderRadius: 5,
                fontSize: index < 99 ? 14 : 10,
              }}>
              {index + 1}
            </Text>
          </ImageBackground>
          <Text style={{ color: 'black', fontSize: 18, alignSelf: 'center' }}>
            {item.surah_name}
          </Text>
        </View>

      </TouchableOpacity>
    </>
  );
};
