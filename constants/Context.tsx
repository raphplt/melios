import React, { createContext, useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

export const UserContext = createContext({});

export const UserProvider = ({ children }: any) => {
	const [user, setUser]: any = useState(null);
	const auth = getAuth();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			console.log("UserProvider - user: ", user);
			setUser(user);
		});

		// Nettoyer l'écouteur d'événements lors du démontage du composant
		return () => unsubscribe();
	}, [auth]);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};
