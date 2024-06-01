import React, { createContext, useState, useEffect, useContext } from "react";
import { getAuth } from "firebase/auth";

export const UserContext: any = createContext({});

export const SessionProvider = ({ children }: any) => {
	const [user, setUser]: any = useState(null);
	const [isLoading, setIsLoading]: any = useState(true);
	const auth = getAuth();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			console.log("UserProvider - user: ", user);
			setUser(user);
			setIsLoading(false);
		});

		return () => unsubscribe();
	}, [auth]);

	return (
		<UserContext.Provider value={{ user, setUser, isLoading }}>
			{children}
		</UserContext.Provider>
	);
};

export function useSession() {
	const value = useContext(UserContext);
	if (value === undefined) {
		throw new Error("useSession must be used within a SessionProvider");
	}
	return value;
}
