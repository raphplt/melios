import { DataContext } from "@context/DataContext";
import { getAllTrophies } from "@db/trophiesList";
import { useContext, useEffect } from "react";

const useTrophies = () => {
	const { trophies, setTrophies } = useContext(DataContext);

	useEffect(() => {
		const fetchTrophies = async () => {
			if (trophies.length === 0) {
				const fetchedTrophies = await getAllTrophies();
				setTrophies(fetchedTrophies);
			}
		};

		fetchTrophies();
	}, [trophies, setTrophies]);
};

export default useTrophies;
