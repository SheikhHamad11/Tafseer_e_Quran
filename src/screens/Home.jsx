import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import { Translation_data } from '../components/Translation_cat';
import CustomAlert from '../components/AlertModal';
import useCheckLastSurah from '../hook/useCheckLastSurah';

export default function Home({ navigation }) {
  const { SurahName,
    handleResume,
    handleCloseAlert,
    showAlert } = useCheckLastSurah(navigation)
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {showAlert && <CustomAlert
        onClose={handleCloseAlert}
        onResume={handleResume}
        surahName={SurahName}
      />}
      <ImageBackground
        source={require('../../src/assets/new1.jpg')}
        style={styles.background}
        resizeMode="cover">
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.contentContainer}>
          <Image
            source={require('../../src/assets/bismi.png')}
            style={{
              width: 200,
              height: 50,
              alignSelf: 'center',
            }}
          />
          <Text style={styles.tafseerText}>
            In the name of Allah, the Most Gracious, the Most Merciful.
          </Text>

          <Image
            source={require('../../src/assets/logo.png')}
            style={{
              width: 220,
              height: 100,
              alignSelf: 'center',
              marginVertical: 10,
            }}
          />
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('VolumeCat')}>
            <Image
              style={styles.image}
              source={require('../../src/assets/books.png')}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.text}>Tafheem-ul-Quran</Text>
              <Text style={styles.text}>(ابو الاعلیٰ مودودی)</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={toggleAccordion}>
            <Image
              style={styles.image2}
              source={require('../../src/assets/img4.png')}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.text}>Quran Translation</Text>
              <Text style={styles.text}>(ترجمہ کے ساتھ قرآن)</Text>
            </View>
          </TouchableOpacity>

          {isExpanded && (
            <>
              {Translation_data.map((item, index) => {
                return (
                  <Component key={index} text={item.cat_name} id={item.id} />
                );
              })}
            </>
          )}
          <View style={{ height: 50 }} />
        </ScrollView>
      </ImageBackground>
    </>
  );
}

const Component = ({ text, id }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Translation', { text, id })}
      style={styles.row2}>
      <Icon name="folder" size={20} color="black" />
      <View style={{ marginLeft: 20 }}>
        <Text style={{ color: 'black', fontSize: 18 }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    // justifyContent: 'center',
  },
  text: {
    fontSize: height * 0.03,
    color: 'black',
  },

  row: {
    backgroundColor: 'rgba(187, 148, 87, 0.8)',
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  row2: {
    backgroundColor: 'rgba(187, 148, 87, 0.8)',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: height * 0.01,
  },
  contentContainer: {
    padding: 20,
  },
  quranText: {
    fontSize: 28,
    color: '#004d00', // Dark green for Quranic text
    fontFamily: 'Scheherazade', // Assuming you've added this font
    textAlign: 'center',
  },
  tafseerText: {
    fontSize: height * 0.025,
    color: '#333', // Dark gray for Tafseer text
    textAlign: 'center',
    marginTop: 20,
  },
  image: {
    width: 50,
    height: 40,
  },
  image2: {
    width: 50,
    height: 40,
  },
  container: {
    margin: 20,
  },
  button: {
    backgroundColor: '#958145',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#DED3BF',
    borderRadius: 5,
  },
  contentText: {
    fontSize: 14,
    color: '#333',
  },
});
