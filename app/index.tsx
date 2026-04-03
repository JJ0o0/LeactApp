import PHButton from "@/src/components/Buttons/PHButton";
import PHIconButton from "@/src/components/Buttons/PHIconButton";
import { PHColors } from "@/src/constants/PHColors";
import { PHUserManagement } from "@/src/services/PHUserManagement";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function Index() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleGoogleSignIn = async () => {
		setLoading(true);

		const { error } = await PHUserManagement.loginWithGoogle();

		if (error) {
			if (error.message !== "Login cancelado") {
				Alert.alert("Erro no Login", error.message);
			}
		} else {
			router.replace("/pages/main");
		}

		setLoading(false);
	};

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ headerShown: false }} />
			<Image
				source={require("@/assets/user/mainMenuLogo.png")}
				style={styles.image}
			/>
			<View style={styles.textContainer}>
				<Text style={styles.title}>Olá!</Text>
				<Text style={styles.subtitle}>
					Bem-Vindo ao Leact! Onde as pessoas se conectam lendo.
				</Text>
			</View>
			<View style={styles.buttonContainer}>
				<PHButton
					size={{ width: 250 }}
					text="Entrar"
					onPressed={() => router.navigate("/credentials/login")}
					customColor={{
						normal: PHColors.border,
						pressed: PHColors.border,
						textNormal: PHColors.background,
						textPressed: PHColors.background,
						border: PHColors.border,
					}}
				/>
				<PHButton
					size={{ width: 250 }}
					text="Cadastrar"
					onPressed={() => router.navigate("/credentials/signup")}
				/>
			</View>
			<View style={styles.otherContainer}>
				<Text style={styles.subtitle}>Ou entrar usando:</Text>
				<View style={styles.otherButtonContainer}>
					<PHIconButton
						icon={faGoogle as IconDefinition}
						iconSize={20}
						roundness={50}
						onPressed={handleGoogleSignIn}
						style={{ width: 45 }}
						customColor={{
							normal: PHColors.googleBackground,
							pressed: PHColors.googleBorder,
							iconNormal: "white",
							iconPressed: PHColors.text,
							border: PHColors.googleBorder,
						}}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: PHColors.background,
	},
	textContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
	},
	buttonContainer: {
		flexDirection: "column",
		marginBottom: 50,
		gap: 10,
	},
	otherContainer: { justifyContent: "center", alignItems: "center", gap: 10 },
	otherButtonContainer: {
		flexDirection: "row",
		gap: 10,
	},
	title: {
		color: PHColors.text,
		fontSize: 50,
		textAlign: "center",
		userSelect: "none",
	},
	subtitle: {
		color: PHColors.placeholder,
		fontSize: 16,
		textAlign: "center",
		userSelect: "none",
	},
	image: { width: 250, height: 200, marginBottom: 20 },
});
