import { useTheme } from "@context/ThemeContext";
import { getMemberByFriendCode, sendFriendRequest } from "@db/member";
import { Member } from "@type/member";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Modal,
	View,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	Text,
	StyleSheet,
	Alert,
} from "react-native";
import { Iconify } from "react-native-iconify";
import QRCode from "react-native-qrcode-svg";
import { Camera, BarcodeScanningResult, CameraView } from "expo-camera";

export const AddFriendModal = ({
	visible,
	onClose,
	currentMember,
}: {
	visible: boolean;
	onClose: () => void;
	currentMember: any;
}) => {
	const { theme } = useTheme();
	const { t } = useTranslation();

	const [friendCode, setFriendCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [friendResult, setFriendResult] = useState<Member | null>(null);
	const [showScanner, setShowScanner] = useState(false);
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [viewMode, setViewMode] = useState<
		"enter-code" | "my-code" | "scan-code"
	>("enter-code");

	// Gérer l'envoi d'une demande d'ami via le code
	const handleAddFriend = async () => {
		if (!friendCode.trim()) {
			Alert.alert(t("error"), t("friend_code_required"));
			return;
		}

		try {
			setLoading(true);
			const member = await getMemberByFriendCode(friendCode.trim());

			if (!member) {
				Alert.alert(t("error"), t("friend_code_not_found"));
				setLoading(false);
				return;
			}

			if (member.uid === currentMember.uid) {
				Alert.alert(t("error"), t("cannot_add_yourself"));
				setLoading(false);
				return;
			}

			if (currentMember.friends?.includes(member.uid)) {
				Alert.alert(t("error"), t("already_friends"));
				setLoading(false);
				return;
			}

			// Afficher les informations de l'utilisateur trouvé
			setFriendResult(member);
			setLoading(false);
		} catch (error) {
			console.error("Erreur lors de la recherche par code ami:", error);
			Alert.alert(t("error"), t("friend_search_error"));
			setLoading(false);
		}
	};

	// Demander la permission et activer le scanner
	const activateScanner = async () => {
		const { status } = await Camera.requestCameraPermissionsAsync();
		setHasPermission(status === "granted");
		if (status === "granted") {
			setShowScanner(true);
			setViewMode("scan-code");
		} else {
			Alert.alert(t("error"), t("camera_permission_denied"));
		}
	};

	// Gérer le scan d'un QR code
	const handleBarCodeScanned = (result: BarcodeScanningResult) => {
		setShowScanner(false);
		setViewMode("enter-code");
		try {
			const scannedData = JSON.parse(result.data);
			if (scannedData.friendCode) {
				setFriendCode(scannedData.friendCode);
				handleAddFriend();
			}
		} catch (e) {
			Alert.alert(t("error"), t("invalid_qr_code"));
		}
	};

	// Envoyer une demande d'ami
	const sendRequest = async () => {
		if (!friendResult) return;

		try {
			setLoading(true);
			await sendFriendRequest(friendResult.uid);
			Alert.alert(t("success"), t("friend_request_sent"));
			setFriendResult(null);
			setFriendCode("");
			setLoading(false);
		} catch (error) {
			console.error("Erreur lors de l'envoi de la demande d'ami:", error);
			Alert.alert(t("error"), t("friend_request_error"));
			setLoading(false);
		}
	};

	// Rendre le contenu en fonction du mode de visualisation actuel
	const renderContent = () => {
		if (viewMode === "scan-code") {
			return (
				<View style={styles.scannerContainer}>
					{hasPermission === null ? (
						<Text>{t("requesting_camera_permission")}</Text>
					) : hasPermission === false ? (
						<Text>{t("no_camera_access")}</Text>
					) : (
						<>
							<CameraView
								onBarcodeScanned={handleBarCodeScanned}
								style={styles.scanner}
								facing="back"
								// type={Camera.Constants.Type.back}
							/>
							<TouchableOpacity
								style={[styles.button, { backgroundColor: theme.colors.redPrimary }]}
								onPress={() => {
									setShowScanner(false);
									setViewMode("enter-code");
								}}
							>
								<Text style={styles.buttonText}>{t("cancel")}</Text>
							</TouchableOpacity>
						</>
					)}
				</View>
			);
		}

		if (viewMode === "my-code") {
			// QR code contenant le code d'ami de l'utilisateur actuel
			return (
				<View style={styles.myCodeContainer}>
					<Text style={[styles.title, { color: theme.colors.text }]}>
						{t("my_friend_code")}
					</Text>

					<View style={styles.qrContainer}>
						<QRCode
							value={JSON.stringify({ friendCode: currentMember.friendCode })}
							size={200}
							color={theme.colors.text}
							backgroundColor={theme.colors.cardBackground}
						/>
					</View>

					<View style={styles.codeDisplayContainer}>
						<Text style={[styles.codeText, { color: theme.colors.primary }]}>
							{currentMember.friendCode}
						</Text>
					</View>

					<TouchableOpacity
						style={[styles.button, { backgroundColor: theme.colors.primary }]}
						onPress={() => setViewMode("enter-code")}
					>
						<Text style={styles.buttonText}>{t("back")}</Text>
					</TouchableOpacity>
				</View>
			);
		}

		// Mode par défaut: saisir un code
		return (
			<View style={styles.enterCodeContainer}>
				<Text style={[styles.title, { color: theme.colors.text }]}>
					{t("add_friend")}
				</Text>

				{friendResult ? (
					<View style={styles.resultContainer}>
						<Text style={[styles.nameText, { color: theme.colors.text }]}>
							{friendResult.nom}
						</Text>

						<TouchableOpacity
							style={[styles.button, { backgroundColor: theme.colors.primary }]}
							onPress={sendRequest}
							disabled={loading}
						>
							{loading ? (
								<ActivityIndicator color={theme.colors.textSecondary} />
							) : (
								<Text style={styles.buttonText}>{t("send_friend_request")}</Text>
							)}
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.button, { backgroundColor: theme.colors.redPrimary }]}
							onPress={() => setFriendResult(null)}
						>
							<Text style={styles.buttonText}>{t("cancel")}</Text>
						</TouchableOpacity>
					</View>
				) : (
					<>
						<View
							style={[styles.inputContainer, { borderColor: theme.colors.border }]}
						>
							<TextInput
								placeholder={t("enter_friend_code")}
								value={friendCode}
								onChangeText={setFriendCode}
								style={[styles.input, { color: theme.colors.text }]}
								placeholderTextColor={theme.colors.textTertiary}
							/>
							<TouchableOpacity
								onPress={handleAddFriend}
								disabled={loading}
								style={styles.searchButton}
							>
								{loading ? (
									<ActivityIndicator size="small" color={theme.colors.primary} />
								) : (
									<Iconify icon="mdi:search" size={24} color={theme.colors.primary} />
								)}
							</TouchableOpacity>
						</View>

						<View style={styles.buttonsContainer}>
							<TouchableOpacity
								style={[styles.button, { backgroundColor: theme.colors.primary }]}
								onPress={() => setViewMode("my-code")}
							>
								<Text style={styles.buttonText}>{t("show_my_code")}</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.button, { backgroundColor: theme.colors.primary }]}
								onPress={activateScanner}
							>
								<Text style={styles.buttonText}>{t("scan_qr_code")}</Text>
							</TouchableOpacity>
						</View>
					</>
				)}
			</View>
		);
	};

	return (
		<Modal
			visible={visible}
			animationType="slide"
			onRequestClose={onClose}
			transparent={false}
		>
			<View
				style={[styles.container, { backgroundColor: theme.colors.background }]}
			>
				{renderContent()}

				{viewMode !== "scan-code" && !friendResult && (
					<TouchableOpacity
						style={[
							styles.closeButton,
							{ backgroundColor: theme.colors.backgroundTertiary },
						]}
						onPress={onClose}
					>
						<Text style={[styles.closeButtonText, { color: theme.colors.text }]}>
							{t("close")}
						</Text>
					</TouchableOpacity>
				)}
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	enterCodeContainer: {
		flex: 1,
	},
	myCodeContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	scannerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	scanner: {
		height: "80%",
		width: "100%",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 24,
		textAlign: "center",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 12,
		marginBottom: 24,
	},
	input: {
		flex: 1,
		height: 50,
		fontSize: 16,
	},
	searchButton: {
		padding: 8,
	},
	resultContainer: {
		alignItems: "center",
		padding: 20,
	},
	nameText: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 16,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 24,
	},
	button: {
		padding: 14,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 8,
		width: "48%",
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
	},
	closeButton: {
		padding: 14,
		borderRadius: 8,
		alignItems: "center",
	},
	closeButtonText: {
		fontWeight: "bold",
	},
	qrContainer: {
		padding: 20,
		backgroundColor: "white",
		borderRadius: 12,
		marginBottom: 20,
	},
	codeDisplayContainer: {
		padding: 12,
		borderRadius: 8,
		marginBottom: 24,
	},
	codeText: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		letterSpacing: 2,
	},
});
