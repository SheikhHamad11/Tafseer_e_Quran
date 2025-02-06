import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { QuranContext } from './contextApi';

const useCheckLastSurah = (navigation: any) => {
    const { lastSurahDataState } = useContext(QuranContext);
    const [lastSurahData, setlastSurahData] = lastSurahDataState;
    let {
        Position,
        lastIndex,
        catId,
        surahName: SurahName,
        surahId
    } = lastSurahData;
    const [showAlert, setShowAlert] = useState(false);



    useEffect(() => {
        const checkSavedData = async () => {
            const JsonData: any = await AsyncStorage.getItem('surahData');
            const surahData = JsonData ? JSON.parse(JsonData) : null

            console.log({ surahData })

            try {
                let {
                    Position,
                    lastIndex,
                    catId,
                    surahName,
                    surahId
                } = surahData;

                if (surahData?.Position) {
                    setlastSurahData({
                        Position,
                        lastIndex,
                        catId,
                        surahId,
                        surahName
                    });
                    setShowAlert(true); // Show the custom alert
                }
            } catch (error) {
                console.log({ error })
            }
        };

        checkSavedData();
    }, []);

    const handleResume = () => {
        setShowAlert(false);
        navigation.navigate('MediaPlayer',
            {
                item: null
            }
        );
    };

    const handleCloseAlert = async () => {
        setShowAlert(false);
        // Optionally clear saved data if needed
        // await AsyncStorage.removeItem('surahData');
    };



    return {
        showAlert,
        SurahName,
        handleResume,
        handleCloseAlert
    }
}

export default useCheckLastSurah

