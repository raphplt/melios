import { Iconify } from "react-native-iconify";

type IconKey = "ia" | "time" | "check";

export default function IconView({ icon }: { icon: IconKey }) {
	const iconsList: Record<IconKey, JSX.Element> = {
		ia: <Iconify icon="mage:stars-b" size={24} color={"black"} />,
		time: <Iconify icon="carbon:time" size={24} color={"black"} />,
		check: <Iconify icon="ph:check-circle" size={24} color={"black"} />,
	};

	return iconsList[icon];
}
