import React, { useEffect, useState } from "react";
import { CombinedLevel } from "@type/levels";
import NextLevel from "@components/Modals/NextLevel";
import { useData } from "@context/DataContext";
import { useHabits } from "@context/HabitsContext";
import { setRewards } from "@db/rewards";

export default function NextLevelHandler() {
    const { usersLevels } = useData();
    const { genericLevels } = useHabits();
    const [showNextLevelModal, setShowNextLevelModal] = useState(false);
    const [nextLevelData, setNextLevelData] = useState<CombinedLevel | null>(null);
    const [previousLevels, setPreviousLevels] = useState(usersLevels);

    useEffect(() => {
        Object.entries(usersLevels).forEach(([levelId, userLevel]: any) => {
            const previousLevel = previousLevels[levelId];
            if (previousLevel && userLevel.currentLevel > previousLevel.currentLevel) {
                setShowNextLevelModal(true);
                
                setNextLevelData({
                    ...genericLevels.find((level) => level.id === levelId),
                    ...userLevel,
                });

                setRewards("rewards", userLevel.currentLevel + 2);
            }
        });
        setPreviousLevels(usersLevels);
    }, [usersLevels]);

    return (
        <NextLevel
            visible={showNextLevelModal}
            setVisible={setShowNextLevelModal}
            levelData={nextLevelData}
        />
    );
};
