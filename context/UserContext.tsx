import React, {
	createContext,
	useState,
	useEffect,
	useContext,
	ReactNode,
} from "react";
import { User } from "firebase/auth";
import { auth } from "../db";

interface UserContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	isLoading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(
	undefined
);

interface SessionProviderProps {
	children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				setUser(user);
			} else {
				setUser(null);
			}
			setIsLoading(false);
		});

		return () => unsubscribe();
	}, []);

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
