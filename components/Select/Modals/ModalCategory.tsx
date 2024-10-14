import ModalWrapper from "@components/Modals/ModalWrapper";
import { useHabits } from "@context/HabitsContext";
import { useTheme } from "@context/ThemeContext";
import { Category } from "@type/category";
import { Dimensions } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function ModalCategory({
	register,
	visible = false,
	setVisible,
	setValue,
}: {
	register: any;
	visible: boolean;
	setVisible: (visible: boolean) => void;
	setValue: (name: string, value: any) => void;
}) {
	const { theme } = useTheme();

	const { categories } = useHabits();

	const windowWidth = Dimensions.get("window").width;

	return (
		<ModalWrapper visible={visible} setVisible={setVisible}>
			<Dropdown
				style={{ width: windowWidth * 0.8 }}
				{...register("category")}
				labelField={"category"}
				valueField={"category"}
				placeholder="Choisissez une catégorie"
				onChange={(item: Category) => {
					setValue("category", item);
					setVisible(false);
				}}
				containerStyle={{
					borderWidth: 1,
					borderColor: theme.colors.border,
					borderRadius: 10,
				}}
				placeholderStyle={{
					color: theme.colors.text,
				}}
				data={categories}
			/>
		</ModalWrapper>
	);
}
