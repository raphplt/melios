import React from "react";
import BottomSlideModal from "./ModalBottom";
import { Text, View, ScrollView, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import ModalWrapperSimple from "./ModalWrapperSimple";

const ModalTermsOfUse = ({
	visible,
	setVisible,
	onAccept,
}: {
	visible: boolean;
	setVisible: any;
	onAccept?: () => void;
}) => {
	const { t } = useTranslation();
	const { theme } = useTheme();

	const handleAccept = () => {
		if (onAccept) {
			onAccept();
		}
		setVisible(false);
	};

	return (
		<ModalWrapperSimple visible={visible} setVisible={setVisible}>
			<View className=" h-[80vh]">
				<ScrollView
					className="flex-1 px-4"
					contentContainerStyle={{ paddingBottom: 80 }}
					showsVerticalScrollIndicator={true}
				>
					<View className="py-6">
						<Text className="text-2xl font-bold text-center mb-2">
							Conditions Générales d'Utilisation (CGU) – Melios
						</Text>
						<Text className="text-gray-500 text-center mb-6">
							Dernière mise à jour : 14 mars 2025
						</Text>

						{/* Article 1 */}
						<View className="mb-6">
							<Text className="text-lg font-bold mb-2">Article 1 : Objet</Text>
							<Text className="text-gray-700 leading-6">
								Les présentes Conditions Générales d'Utilisation (ci-après "CGU") ont
								pour objet de définir les modalités d'utilisation de l'application
								mobile Melios (ci-après l'"Application"), éditée par [Nom de ta
								société], accessible gratuitement en téléchargement.
							</Text>
						</View>

						{/* Article 2 */}
						<View className="mb-6">
							<Text className="text-lg font-bold mb-2">
								Article 2 : Acceptation des CGU
							</Text>
							<Text className="text-gray-700 leading-6">
								L'accès et l'utilisation de l'Application impliquent l'acceptation
								expresse et sans réserve par l'utilisateur des présentes CGU lors de son
								inscription.
							</Text>
						</View>

						{/* Article 3 */}
						<View className="mb-6">
							<Text className="text-lg font-bold mb-2">
								Article 3 : Accès à l'application
							</Text>
							<Text className="text-gray-700 leading-6">
								L'Application est accessible gratuitement. Certaines fonctionnalités
								avancées peuvent nécessiter un abonnement payant. Les utilisateurs
								doivent créer un compte personnel et sécurisé lors de leur inscription.
							</Text>
						</View>

						{/* Article 4 */}
						<View className="mb-6">
							<Text className="text-lg font-bold mb-2">
								Article 4 : Responsabilités de l'utilisateur
							</Text>
							<Text className="text-gray-700 leading-6">
								L'utilisateur s'engage à :
							</Text>
							<View className="ml-4 mt-2">
								<Text className="text-gray-700 leading-6">
									• Fournir des informations exactes lors de son inscription
								</Text>
								<Text className="text-gray-700 leading-6">
									• Maintenir confidentiels ses identifiants et mots de passe
								</Text>
								<Text className="text-gray-700 leading-6">
									• Utiliser l'Application conformément à sa finalité
								</Text>
							</View>
						</View>

						{/* Articles suivants avec la même structure... */}
						{/* Je n'ai mis que 4 articles pour l'exemple, mais il faut continuer avec la même structure pour les autres */}

						<View className="mb-8">
							<Text className="text-sm text-gray-500 text-center">
								Pour toute question concernant ces CGU, veuillez nous contacter à :
								contact@melios.fr
							</Text>
						</View>
					</View>
				</ScrollView>
				<View
					className="absolute bottom-0 left-0 right-0 p-4"
					style={{
						backgroundColor: theme.colors.cardBackground,
					}}
				>
					<Pressable
						onPress={handleAccept}
						style={{ backgroundColor: theme.colors.primary }}
						className="w-full py-4 rounded-xl"
					>
						<Text className="text-white text-center font-semibold">
							{t("accept_and_continue")}
						</Text>
					</Pressable>
				</View>
			</View>
		</ModalWrapperSimple>
	);
};

export default ModalTermsOfUse;
