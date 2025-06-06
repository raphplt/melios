import React, { createContext, useContext, useState, ReactNode } from "react";

export type NotificationType = "success" | "error" | "info";

interface PopupState {
    isOpen: boolean;
    message: string;
    type: NotificationType;
}

interface NotificationContextValue {
    popup: PopupState;
    showPopup: (message: string, type?: NotificationType) => void;
    closePopup: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [popup, setPopup] = useState<PopupState>({
        isOpen: false,
        message: "",
        type: "info",
    });

    const showPopup = (message: string, type: NotificationType = "info") => {
        setPopup({ isOpen: true, message, type });
    };

    const closePopup = () => setPopup((prev) => ({ ...prev, isOpen: false }));

    return (
        <NotificationContext.Provider value={{ popup, showPopup, closePopup }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};
