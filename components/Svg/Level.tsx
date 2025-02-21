import React from "react";
import Svg, {
	Path,
	Defs,
	LinearGradient,
	Stop,
	Text as SvgText,
} from "react-native-svg";

type Props = {
	level: number;
	color1?: string;
	color2?: string;
};

const BadgeLevel = ({ level, color1, color2 }: Props) => {
	return (
		<Svg width={108} height={135} viewBox="0 0 72 90" fill="none">
			{/* Contour blanc externe (hexagone régulier) */}
			<Path
				d="M36 4
           L72 24
           L72 66
           L36 86
           L0 66
           L0 24
           Z"
				fill="#FFFFFF"
			/>

			<Defs>
				{/* Définition du dégradé linéaire doré */}
				<LinearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
					<Stop offset="0%" stopColor={color1 ?? "#FFD54F"} />
					<Stop offset="100%" stopColor={color2 ?? "#FFA000"} />
				</LinearGradient>
			</Defs>

			{/* Hexagone intérieur avec dégradé (inset de 3 unités par rapport à l’externe) */}
			<Path
				d="M36 7
           L69 26
           L69 64
           L36 83
           L3 64
           L3 26
           Z"
				fill="url(#goldGradient)"
			/>

			{/* Texte centré */}
			<SvgText
				x="50%"
				y="50%"
				fill="#FFFFFF"
				fontSize="24"
				fontWeight="bold"
				textAnchor="middle"
				alignmentBaseline="middle"
			>
				{level}
			</SvgText>
		</Svg>
	);
};

export default BadgeLevel;
