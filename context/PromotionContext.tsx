import React, { createContext, useContext } from "react";
import { useGlobalPromotion } from "../hooks/useGlobalPromotion";
import { PromotionNotification } from "../components/PromotionNotification";
import { Member } from "../type/member";

interface PromotionContextType {
	triggerPromotion: (oldMember: Member, newMember: Member) => Promise<void>;
}

const PromotionContext = createContext<PromotionContextType | null>(null);

export const PromotionProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const {
		currentPromotion,
		isPromotionVisible,
		triggerPromotion,
		dismissPromotion,
	} = useGlobalPromotion();

	return (
		<PromotionContext.Provider value={{ triggerPromotion }}>
			{children}

			{/* Notification globale de promotion */}
			<PromotionNotification
				visible={isPromotionVisible}
				oldLeague={currentPromotion?.oldLeague || null}
				newLeague={currentPromotion?.newLeague || null}
				onDismiss={dismissPromotion}
			/>
		</PromotionContext.Provider>
	);
};

export const usePromotion = () => {
	const context = useContext(PromotionContext);
	if (!context) {
		throw new Error("usePromotion must be used within a PromotionProvider");
	}
	return context;
};
