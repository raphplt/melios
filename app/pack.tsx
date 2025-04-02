import PackPreview from "@components/Recompenses/PackPreview";
import PackUnlocked from "@components/Recompenses/PackUnlocked";
import { useData } from "@context/DataContext";
import React, { useState } from "react";

const Pack = () => {
	const { selectedPack } = useData();
	const [unlocked, setUnlocked] = useState(false);

	if (!selectedPack) return null;

	if (!unlocked) return <PackPreview />;

	return <PackUnlocked />;
};

export default Pack;