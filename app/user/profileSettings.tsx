import PHIconButton from "@/src/components/Buttons/PHIconButton";
import { PHColors } from "@/src/constants/PHColors";
import { PHContentHandler } from "@/src/services/PHContentHandler";
import { PHUserService } from "@/src/services/PHUserService"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
	faRightFromBracket,
	faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
	const [user, setUser] = useState<any>(null);
	const router = useRouter();

	useEffect(() => {
		PHUserService.getUser().then(setUser);
	}, []);

	const isGoogleProvider = user?.app_metadata?.provider === "google";

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					headerTitle: "Configurações",
					headerShadowVisible: false,
				}}
			/>

			<ScrollView contentContainerStyle={styles.scrollContent}>
				<Text style={styles.sectionTitle}>Conta</Text>

				<View style={styles.infoCard}>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Email</Text>
						<Text style={styles.infoValue}>{user?.email}</Text>
					</View>
					{isGoogleProvider && (
						<View
							style={[
								styles.infoRow,
								{
									borderTopWidth: 1,
									borderTopColor: PHColors.border,
									marginTop: 10,
									paddingTop: 10,
								},
							]}
						>
							<Text style={styles.infoLabel}>Vinculado ao</Text>
							<Text
								style={[
									styles.infoValue,
									{ color: "#4285F4", fontWeight: "bold" },
								]}
							>
								Google
							</Text>
						</View>
					)}
				</View>

				<Text style={styles.sectionTitle}>Ações</Text>

				<View style={styles.actionRow}>
					<View style={styles.actionInfo}>
						<Text style={styles.actionTitle}>Sair da Conta</Text>
						<Text style={styles.actionSub}>
							Encerra sua sessão neste dispositivo
						</Text>
					</View>
					<PHIconButton
						icon={faRightFromBracket as IconDefinition}
						onPressed={() => PHContentHandler.handleLogout(router)}
						iconSize={20}
						customColor={{
							normal: PHColors.foreground,
							pressed: PHColors.border,
							iconNormal: PHColors.text,
							iconPressed: PHColors.background,
							border: PHColors.border,
						}}
					/>
				</View>

				<View style={styles.divider} />

				<View style={styles.actionRow}>
					<View style={styles.actionInfo}>
						<Text
							style={[styles.actionTitle, { color: "#ff4444" }]}
						>
							Excluir Minha Conta
						</Text>
						<Text style={styles.actionSub}>
							Apaga todos os seus dados permanentemente
						</Text>
					</View>
					<PHIconButton
						icon={faTrashCan as IconDefinition}
						onPressed={() =>
							PHContentHandler.handleDeleteAccount(
								user?.id,
								router,
							)
						}
						iconSize={20}
						customColor={{
							normal: "transparent",
							pressed: "#ff4444",
							iconNormal: "#ff4444",
							iconPressed: "white",
							border: "#ff4444",
						}}
					/>
				</View>

				<View style={styles.footerInfo}>
					<Text style={styles.versionText}>
						Todos direitos reservados a Phosphorus Team
					</Text>
					<Image
						source={require("@/assets/user/phlogo.png")}
						tintColor={PHColors.placeholder}
						style={{ width: 120, height: 120 }}
					/>
					<Text style={styles.versionText}>Versão 1.0.2</Text>
					<Text style={styles.versionText}>Build Sugarcane</Text>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: PHColors.background,
		paddingVertical: 50,
	},
	scrollContent: { padding: 20 },
	sectionTitle: {
		color: PHColors.border,
		fontSize: 13,
		fontWeight: "bold",
		marginBottom: 15,
		marginTop: 20,
		textTransform: "uppercase",
	},
	infoCard: {
		backgroundColor: PHColors.foreground,
		padding: 15,
		borderRadius: 20,
		borderWidth: 2,
		borderColor: PHColors.border,
		marginBottom: 20,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	infoLabel: { color: PHColors.placeholder, fontSize: 14 },
	infoValue: { color: PHColors.text, fontSize: 14, fontWeight: "600" },
	actionRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 10,
	},
	actionInfo: { flex: 1 },
	actionTitle: { color: PHColors.text, fontSize: 16, fontWeight: "bold" },
	actionSub: { color: PHColors.placeholder, fontSize: 12, marginTop: 2 },
	divider: {
		height: 1,
		backgroundColor: PHColors.border,
		marginVertical: 10,
		opacity: 0.3,
	},
	footerInfo: { marginTop: 60, alignItems: "center", gap: 5 },
	versionText: { color: PHColors.placeholder, fontSize: 12 },
});
