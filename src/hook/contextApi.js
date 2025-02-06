import React, { createContext, useState } from 'react';
export const QuranContext = createContext();

export const QuranContextApi = ({ children }) => {
    const [lastSurahData, setlastSurahData] = useState({
        Position: null,
        lastIndex: null,
        catId: null,
        surahId: null
    });

    return (
        <QuranContext.Provider
            value={{
                lastSurahDataState: [lastSurahData, setlastSurahData],
            }}>
            {children}
        </QuranContext.Provider>
    );
};
