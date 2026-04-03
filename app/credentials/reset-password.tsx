import PHButton from "@/src/components/Buttons/PHButton";
import PHTextBox from "@/src/components/PHTextBox";
import { PHColors } from "@/src/constants/PHColors";
import { PHUserManagement } from "@/src/services/PHUserManagement";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

export default function ForgotPassword() {
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const verifyFields = () => {
		if (password.length < 8) {
			Alert.alert("Erro", "A senha deve ter pelo menos 8 caracteres.");

			return false;
		}

		if (password !== passwordConfirmation) {
			Alert.alert("Erro", "As senhas não coincidem.");

			return false;
		}

		return true;
	};

	const handleUpdate = async () => {
		if (!verifyFields()) {
			return;
		}

		setLoading(true);

		const { error } = await PHUserManagement.updatePassword(password);

		if (error) {
			Alert.alert("Erro ao atualizar: ", error.message);
		} else {
			Alert.alert("Sucesso", "Sua senha foi alterada com sucesso!", [
				{ text: "OK", onPress: () => router.replace("/") },
			]);
		}
		setLoading(false);
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "padding"}
		>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.textContainer}>
					<Text style={styles.title}>Alterar Senha</Text>
					<Text style={styles.subtitle}>Digite sua nova senha.</Text>
				</View>

				<View style={styles.inputContainer}>
					<PHTextBox
						value={password}
						placeholder="Nova Senha"
						placeholderColor={PHColors.placeholder}
						onChangeText={setPassword}
						secret={true}
						textContentType="password"
						autoComplete="password"
						autoCapitalize="none"
						textBoxSettings={{ width: 350, height: 50 }}
					/>
					<PHTextBox
						value={passwordConfirmation}
						placeholder="Nova Senha (Confirmação)"
						placeholderColor={PHColors.placeholder}
						onChangeText={setPasswordConfirmation}
						secret={true}
						textContentType="password"
						autoComplete="password"
						autoCapitalize="none"
						textBoxSettings={{ width: 350, height: 50 }}
					/>
				</View>

				<View style={styles.buttonContainer}>
					<PHButton
						text="Alterar"
						onPressed={handleUpdate}
						loading={loading}
						size={{ width: 250 }}
						customColor={{
							normal: PHColors.border,
							pressed: PHColors.border,
							textNormal: PHColors.background,
							textPressed: PHColors.background,
							border: PHColors.border,
						}}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: PHColors.background },
	scrollContainer: {
		flexGrow: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	textContainer: { alignItems: "center", marginBottom: 30, gap: 10 },
	inputContainer: { marginBottom: 20, gap: 10 },
	buttonContainer: { marginTop: 10 },
	title: { color: PHColors.text, fontSize: 32, textAlign: "center" },
	subtitle: {
		color: PHColors.placeholder,
		fontSize: 16,
		textAlign: "center",
		paddingHorizontal: 20,
	},
});
