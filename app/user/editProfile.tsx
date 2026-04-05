import PHIconButton from "@/src/components/Buttons/PHIconButton";
import PHTextBox from "@/src/components/PHTextBox";
import { PHColors } from "@/src/constants/PHColors";
import { PHContentHandler } from "@/src/services/PHContentHandler";
import { PHContentService } from "@/src/services/PHContentService";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCamera, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

export default function EditProfile() {
	const [user, setUser] = useState<any>(null);
	const [nome, setNome] = useState("");
	const [image, setImage] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const loadInitialData = async () => {
			const u = await PHContentService.getUser();
			if (u) {
				setUser(u);

				const result = await PHContentService.getProfileAndLastReview();

				if (result.success && result.profileData) {
					setNome(result.profileData.nome || "");
					setImage(
						result.profileData.avatar_url ||
							result.profileData.foto_url ||
							null,
					);
				}
			}
			setFetching(false);
		};
		loadInitialData();
	}, []);

	const save = async () => {
		if (!user?.id) return;
		setLoading(true);
		await PHContentHandler.handleSaveProfile(user.id, nome, image, () => {
			Alert.alert("Sucesso", "Perfil atualizado!");
			router.back();
		});
		setLoading(false);
	};

	if (fetching) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={PHColors.border} />
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<Stack.Screen
				options={{
					headerTitle: "Editar Perfil",
					headerShadowVisible: false,
					headerStyle: { backgroundColor: PHColors.background },
					headerTintColor: PHColors.text,
				}}
			/>

			<ScrollView contentContainerStyle={styles.scrollContent}>
				{/* Seção da Foto */}
				<View style={styles.avatarSection}>
					<View style={styles.avatarWrapper}>
						<Image
							source={{
								uri:
									image ||
									"https://www.gravatar.com/avatar/0?d=mp",
							}}
							style={styles.avatar}
							contentFit="cover"
							transition={500}
						/>
						<PHIconButton
							icon={faCamera as IconDefinition}
							onPressed={() =>
								PHContentHandler.handlePickImage(setImage)
							}
							style={styles.cameraBtn}
							iconSize={18}
							roundness={25}
							customColor={{
								normal: PHColors.text,
								pressed: PHColors.border,
								iconNormal: PHColors.background,
								iconPressed: PHColors.background,
								border: PHColors.border,
							}}
						/>
					</View>
					<Text style={styles.hintText}>
						Toque na câmera para mudar a foto
					</Text>
				</View>

				<View style={styles.formSection}>
					<Text style={styles.label}>NOME DE EXIBIÇÃO</Text>
					<PHTextBox
						value={nome}
						onChangeText={setNome}
						placeholder="Ex: João das Neves"
						textBoxSettings={{ width: "100%" }}
					/>
					<Text style={styles.infoText}>
						Este é o nome que os outros leitores verão nas suas
						críticas.
					</Text>
				</View>

				<View style={styles.footer}>
					{loading ? (
						<ActivityIndicator color={PHColors.border} />
					) : (
						<PHIconButton
							icon={faCheck as IconDefinition}
							onPressed={save}
							iconSize={28}
							roundness={30}
							style={styles.saveBtn}
							customColor={{
								normal: PHColors.border,
								pressed: PHColors.text,
								iconNormal: PHColors.text,
								iconPressed: PHColors.background,
								border: PHColors.border,
							}}
						/>
					)}
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: PHColors.background,
		paddingTop: 50,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: PHColors.background,
	},
	scrollContent: { padding: 25, alignItems: "center" },
	avatarSection: { alignItems: "center", marginTop: 20, marginBottom: 40 },
	avatarWrapper: {
		width: 160,
		height: 160,
		position: "relative",
	},
	avatar: {
		width: "100%",
		height: "100%",
		borderRadius: 80,
		borderWidth: 5,
		borderColor: PHColors.border,
		backgroundColor: PHColors.foreground,
	},
	cameraBtn: {
		position: "absolute",
		bottom: 5,
		right: 5,
		width: 45,
		height: 45,
		borderWidth: 3,
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
	},
	hintText: {
		color: PHColors.placeholder,
		fontSize: 12,
		marginTop: 15,
		fontWeight: "600",
	},
	formSection: { width: "100%", gap: 10 },
	label: {
		color: PHColors.border,
		fontSize: 12,
		fontWeight: "bold",
		marginLeft: 5,
	},
	infoText: {
		color: PHColors.placeholder,
		fontSize: 13,
		textAlign: "center",
		marginTop: 10,
		paddingHorizontal: 20,
	},
	footer: { marginTop: 50, width: "100%", alignItems: "center" },
	saveBtn: {
		width: 70,
		height: 70,
		borderWidth: 4,
	},
});
