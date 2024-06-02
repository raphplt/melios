import React, { createContext, useState, useEffect, useContext } from "react";
import { User, getAuth } from "firebase/auth";
import { auth } from "../db";

export const UserContext = createContext<any>({});

export const SessionProvider = ({ children }: any) => {
	const [user, setUser]: any = useState<User>();
	const [isLoading, setIsLoading]: any = useState(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				setUser(user);
				setIsLoading(false);
			} else {
				setUser(undefined);
				setIsLoading(false);
			}
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
