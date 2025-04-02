import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	FlatList,
	ActivityIndicator,
	Pressable,
	StyleSheet,
	TextInput,
	Alert,
	Share,
} from "react-native";
import { Member } from "@type/member";
import Friend from "@components/Agora/Friend";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Iconify } from "react-native-iconify";
import Filters from "@components/Agora/Filters";
import { Camera, CameraView, BarcodeScanningResult } from "expo-camera";
import { getMemberProfileByUid } from "../db/member";
import { getMemberByFriendCode, sendFriendRequest } from "@db/friend";
import QRCode from "react-native-qrcode-svg";

export type FriendFilter = "friends" | "received" | "sent";

const FriendList = () => {
	const { member } = useData();
	const { theme } = useTheme();
	const { t } = useTranslation();

	const [members, setMembers] = useState<Member[]>([]);
	const [loading, setLoading] = useState(false);
	const [filter, setFilter] = useState<FriendFilter>("friends");

	const [friendCode, setFriendCode] = useState("");
	const [addFriendLoading, setAddFriendLoading] = useState(false);
	const [showScanner, setShowScanner] = useState(false);
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);

	useEffect(() => {
		const fetchMembers = async () => {
			if (!member) return;

			setLoading(true);
			try {
				let userIds: string[] = [];

				if (filter === "friends" && member.friends) {
					userIds = member.friends;
				} else if (filter === "received" && member.friendRequestsReceived) {
					userIds = member.friendRequestsReceived;
				} else if (filter === "sent" && member.friendRequestsSent) {
					userIds = member.friendRequestsSent;
				}

				const memberPromises = userIds.map((uid) => getMemberProfileByUid(uid));
				const fetchedMembers = await Promise.all(memberPromises);

				setMembers(fetchedMembers.filter((m) => m !== undefined) as Member[]);
			} catch (error) {
				console.error("Erreur lors de la récupération des membres:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchMembers();
	}, [member, filter]);

	const activateScanner = async () => {
		const { status } = await Camera.requestCameraPermissionsAsync();
		setHasPermission(status === "granted");
		if (status === "granted") {
			setShowScanner(true);
		} else {
			Alert.alert(t("error"), t("camera_permission_denied"));
		}
	};

	const handleBarCodeScanned = (result: BarcodeScanningResult) => {
		setShowScanner(false);
		try {
			const scannedData = JSON.parse(result.data);
			if (scannedData.friendCode) {
				setFriendCode(scannedData.friendCode);
				handleAddFriend(scannedData.friendCode);
			}
		} catch (e) {
			Alert.alert(t("error"), t("invalid_qr_code"));
		}
	};

	const handleAddFriend = async (code = friendCode) => {
		if (!code.trim()) {
			Alert.alert(t("error"), t("friend_code_required"));
			return;
		}

		try {
			setAddFriendLoading(true);
			const foundMember = await getMemberByFriendCode(code.trim());

			if (!foundMember) {
				Alert.alert(t("error"), t("friend_code_not_found"));
				return;
			}

			if (member?.uid === foundMember.uid) {
				Alert.alert(t("error"), t("cannot_add_yourself"));
				return;
			}

			if (member?.friends?.includes(foundMember.uid)) {
				Alert.alert(t("error"), t("already_friends"));
				return;
			}

			if (member?.friendRequestsSent?.includes(foundMember.uid)) {
				Alert.alert(t("error"), t("request_already_sent"));
				return;
			}

			await sendFriendRequest(foundMember.uid);
			Alert.alert(t("success"), t("friend_request_sent"));
			setFriendCode("");
		} catch (error) {
			console.error("Erreur lors de l'envoi de la demande d'ami:", error);
			Alert.alert(t("error"), t("friend_request_error"));
		} finally {
			setAddFriendLoading(false);
		}
	};

	const handleShareCode = async () => {
		if (!member?.friendCode) return;

		try {
			await Share.share({
				message: t("friend_code_share_message", {
					name: member.nom,
					code: member.friendCode,
				}),
			});
		} catch (error) {
			console.error("Erreur lors du partage du code:", error);
		}
	};

	const filteredMembers = members.filter((m) =>
		member ? m.uid !== member.uid : false
	);

	if (showScanner) {
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
						/>
						<Pressable
							style={[
								styles.cancelButton,
								{ backgroundColor: theme.colors.redPrimary },
							]}
							onPress={() => setShowScanner(false)}
						>
							<Text style={styles.buttonText}>{t("cancel")}</Text>
						</Pressable>
					</>
				)}
			</View>
		);
	}

	const ListHeader = () => (
		<>
			<View
				style={[
					styles.friendCodeSection,
					{ backgroundColor: theme.colors.cardBackground },
				]}
			>
				<View style={styles.friendCodeHeader}>
					<Text style={[styles.friendCodeTitle, { color: theme.colors.text }]}>
						{t("my_friend_code")}
					</Text>
				</View>

				{member?.friendCode && (
					<>
						<View style={styles.friendCodeContent}>
							<View style={styles.qrContainer}>
								<QRCode
									value={JSON.stringify({ friendCode: member.friendCode })}
									size={100}
									color={theme.colors.text}
									backgroundColor="white"
								/>
							</View>
							<View style={styles.codeTextContainer}>
								<Text style={[styles.codeText, { color: theme.colors.primary }]}>
									{member.friendCode}
								</Text>
								<Text
									style={[styles.codeSubtext, { color: theme.colors.textTertiary }]}
								>
									{t("share_code_to_connect")}
								</Text>
								<View style={styles.actionsRow}>
									<Pressable
										onPress={handleShareCode}
										style={[
											styles.actionButton,
											{ backgroundColor: theme.colors.backgroundTertiary },
										]}
									>
										<Iconify
											icon="mdi:share-variant"
											size={18}
											color={theme.colors.text}
										/>
										<Text style={[styles.actionText, { color: theme.colors.text }]}>
											{t("share")}
										</Text>
									</Pressable>
								</View>
							</View>
						</View>
					</>
				)}
			</View>

			<View
				style={[
					styles.addFriendSection,
					{ backgroundColor: theme.colors.cardBackground },
				]}
			>
				<Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
					{t("add_friend")}
				</Text>

				<View style={styles.inputRow}>
					<TextInput
						placeholder={t("enter_friend_code")}
						value={friendCode}
						onChangeText={setFriendCode}
						style={[
							styles.input,
							{
								color: theme.colors.text,
								borderColor: theme.colors.border,
								backgroundColor: theme.colors.backgroundSecondary,
							},
						]}
						placeholderTextColor={theme.colors.textTertiary}
						autoCapitalize="characters"
					/>

					<Pressable
						onPress={() => handleAddFriend()}
						disabled={addFriendLoading || !friendCode.trim()}
						style={[
							styles.addButton,
							{
								backgroundColor: theme.colors.primary,
								opacity: addFriendLoading || !friendCode.trim() ? 0.7 : 1,
							},
						]}
					>
						{addFriendLoading ? (
							<ActivityIndicator size="small" color={theme.colors.textSecondary} />
						) : (
							<Text style={styles.buttonText}>{t("add")}</Text>
						)}
					</Pressable>
				</View>

				<Pressable
					onPress={activateScanner}
					style={[
						styles.scanButton,
						{ backgroundColor: theme.colors.backgroundTertiary },
					]}
				>
					<Iconify icon="mdi:qrcode-scan" size={20} color={theme.colors.text} />
					<Text style={[styles.scanButtonText, { color: theme.colors.text }]}>
						{t("scan_qr_code")}
					</Text>
				</Pressable>
			</View>

			<Filters filter={filter} setFilter={setFilter} member={member} />
		</>
	);

	if (loading && members.length === 0) {
		return (
			<View style={{ paddingVertical: 20 }}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>
		);
	}

	return (
		<FlatList
			data={filteredMembers}
			numColumns={2}
			keyExtractor={(item) => item.uid}
			showsVerticalScrollIndicator={false}
			renderItem={({ item }) => <Friend member={item} />}
			contentContainerStyle={{ paddingBottom: 20, paddingTop: 12 }}
			ListHeaderComponent={<ListHeader />}
			ListEmptyComponent={
				!loading ? (
					<Text style={[styles.emptyText, { color: theme.colors.textTertiary }]}>
						{filter === "friends"
							? t("no_friends")
							: filter === "received"
							? t("no_friend_requests")
							: t("no_sent_requests")}
					</Text>
				) : null
			}
			style={[
				styles.container,
				{
					backgroundColor: theme.colors.background,
					width: "95%",
					alignSelf: "center",
				},
			]}
		/>
	);
};

const styles = StyleSheet.create({
	// ...existing code...
	container: {
		flex: 1,
	},
	friendCodeSection: {
		marginHorizontal: 16,
		marginBottom: 16,
		borderRadius: 12,
		padding: 16,
		elevation: 1,
	},
	friendCodeHeader: {
		marginBottom: 12,
	},
	friendCodeTitle: {
		fontSize: 18,
		fontWeight: "600",
	},
	friendCodeContent: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	qrContainer: {
		padding: 8,
		backgroundColor: "white",
		borderRadius: 8,
	},
	codeTextContainer: {
		flex: 1,
		marginLeft: 16,
	},
	codeText: {
		fontSize: 22,
		fontWeight: "bold",
		letterSpacing: 1,
	},
	codeSubtext: {
		marginTop: 4,
		fontSize: 12,
	},
	actionsRow: {
		flexDirection: "row",
		marginTop: 10,
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 6,
		marginRight: 8,
	},
	actionText: {
		fontSize: 14,
		marginLeft: 4,
	},
	noCodeContainer: {
		alignItems: "center",
		padding: 16,
	},
	noCodeText: {
		fontSize: 14,
		marginBottom: 12,
		textAlign: "center",
	},
	generateButton: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
	},
	generateButtonText: {
		color: "white",
		fontWeight: "600",
	},
	addFriendSection: {
		marginHorizontal: 16,
		marginBottom: 16,
		borderRadius: 12,
		padding: 16,
		elevation: 1,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 12,
	},
	inputRow: {
		flexDirection: "row",
		marginBottom: 12,
	},
	input: {
		flex: 1,
		height: 46,
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 12,
		fontSize: 16,
		marginRight: 8,
	},
	addButton: {
		width: 80,
		height: 46,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
	},
	scanButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		height: 46,
		borderRadius: 8,
	},
	scanButtonText: {
		marginLeft: 8,
		fontWeight: "500",
		fontSize: 16,
	},
	emptyText: {
		textAlign: "center",
		marginTop: 40,
		fontSize: 16,
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
	cancelButton: {
		position: "absolute",
		bottom: 40,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
	},
});

export default FriendList;
