import PHButton from "@/src/components/Buttons/PHButton";
import PHTextBox from "@/src/components/PHTextBox";
import { PHColors } from "@/src/constants/PHColors";
import { PHContentHandler } from "@/src/services/PHContentHandler";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const onVerificationResetPressed = () => {
		PHContentHandler.handleResetPasswordVerificationEmail(
			email,
			router,
			setLoading,
		);
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "padding"}
		>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.textContainer}>
					<Text style={styles.title}>Recuperar Senha</Text>
					<Text style={styles.subtitle}>
						Digite seu e-mail para receber um link de redefinição.
					</Text>
				</View>

				<View style={styles.inputContainer}>
					<PHTextBox
						value={email}
						placeholder="Seu e-mail cadastrado"
						placeholderColor={PHColors.placeholder}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
						textBoxSettings={{ width: 350, height: 50 }}
					/>
				</View>

				<View style={styles.buttonContainer}>
					<PHButton
						text="Enviar Link"
						onPressed={onVerificationResetPressed}
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
	inputContainer: { marginBottom: 20 },
	buttonContainer: { marginTop: 10 },
	title: { color: PHColors.text, fontSize: 32, textAlign: "center" },
	subtitle: {
		color: PHColors.placeholder,
		fontSize: 16,
		textAlign: "center",
		paddingHorizontal: 20,
	},
});
