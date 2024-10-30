import React, { createContext, useContext, useState } from "react";

type APIUsageContextType = {
    usage: number;
    setUsage: React.Dispatch<React.SetStateAction<number>>;
};

const APIUsageContext = createContext<APIUsageContextType | undefined>(undefined);

type APIUsageProviderProps = {
    children: React.ReactNode;
};

export const APIUsageProvider: React.FC<APIUsageProviderProps> = ({ children }) => {
    const [usage, setUsage] = useState<number>(0);

    return (
        <APIUsageContext.Provider value={{ usage, setUsage }}>
            {children}
        </APIUsageContext.Provider>
    );
};

export const useAPIUsage = (): APIUsageContextType => {
    const context = useContext(APIUsageContext);
    if (!context) {
        throw new Error("useAPIUsage must be used within an APIUsageProvider");
    }
    return context;
};
