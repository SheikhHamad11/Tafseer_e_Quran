import {View, Text, ImageBackground, ScrollView} from 'react-native';
import React from 'react';
import CustomHeader from '../components/CustomHeader';

export default function About() {
  return (
    <>
      <CustomHeader text="About" />
      <ImageBackground
        source={require('../../src/assets/new1.jpg')}
        style={{flex: 1, paddingHorizontal: 20}}
        resizeMode="cover">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              textAlign: 'justify',
              zIndex: 1,
              marginVertical: 20,
            }}>
            Tafhim-ul-Quran is one of the most extensive and popular works on
            the translation and commentary of the Holy Qur'an. Spread over 6
            volumes, it took Syed Abul Ala Maududi 30 years to complete, from
            1942 to 1972.
            {'\n\n'}
            The work is much more than a traditional commentary on the scripture
            as it contains discussions and debates regarding economics,
            sociology, history, and politics. Maududi provides an explanation of
            the Qur'anic verses from the Sunnah of Prophet Muhammed, including
            the historical reasons behind the verses. The commentary deals
            extensively with issues faced by the modern world in general and the
            Muslim community in particular.
            {'\n\n'}
            This app provides the entire, original and unabridged content of the
            work in an audio format. Each of the six volumes are presented
            separately and tapping these, opens the audio commentary of each
            surah in the volume.
            {'\n\n'}
            The app also contains complete Arabic recitation of the Quran and
            verse-by-verse translation in Urdu, Pashto and Hindi.
            {'\n\n'}
            <Text style={{fontWeight: 'bold'}}>
              ESP interactive solutions
            </Text>{' '}
            have developed this app and made it free to download and use,
            without any commercial intent. Hence, there are no adverts or
            'premium' versions and users will never be required to upgrade this
            version.
            {'\n\n'}
            The audio content has been obtained from
            http://www.quranurdu.com/tafa/, where it is freely available to
            download. It is hoped that this app will enable the commentary to
            reach a very wide and global audience. Please contribute towards
            this cause by spreading the word.
          </Text>
        </ScrollView>
      </ImageBackground>
    </>
  );
}
