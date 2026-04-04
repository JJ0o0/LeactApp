import PHButton from "@/src/components/Buttons/PHButton";
import PHTextBox from "@/src/components/PHTextBox";
import { PHColors } from "@/src/constants/PHColors";
import { PHContentHandler } from "@/src/services/PHContentHandler";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from "react-native";

export default function Login() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const onLoginPressed = () => {
		PHContentHandler.handleLogin(email, password, router, setLoading);
	};

	const onForgotPasswordPressed = () => {
		router.push("/(auth)/forgot-password");
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "padding"}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={[styles.container, { width: "100%", flex: 1 }]}>
					<Image
						source={require("@/assets/user/signupLogo.png")}
						style={styles.image}
						contentFit="fill"
					/>
					<View style={styles.textContainer}>
						<Text style={styles.title}>Entrar</Text>
					</View>
					<View style={styles.inputContainer}>
						<PHTextBox
							value={email}
							placeholder="Email"
							placeholderColor={PHColors.placeholder}
							onChangeText={setEmail}
							keyboardType="email-address"
							textContentType="emailAddress"
							autoComplete="email"
							textBoxSettings={{ width: 350, height: 50 }}
						/>
						<PHTextBox
							value={password}
							placeholder="Senha"
							placeholderColor={PHColors.placeholder}
							onChangeText={setPassword}
							secret={true}
							textContentType="password"
							autoComplete="password"
							textBoxSettings={{ width: 350, height: 50 }}
						/>
						<Text
							style={styles.forgotPassword}
							onPress={onForgotPasswordPressed}
						>
							Esqueceu sua senha?
						</Text>
					</View>
					<View style={styles.buttonContainer}>
						<PHButton
							size={{ width: 250 }}
							text="Entrar"
							onPressed={onLoginPressed}
							customColor={{
								normal: PHColors.border,
								pressed: PHColors.border,
								textNormal: PHColors.background,
								textPressed: PHColors.background,
								border: PHColors.border,
							}}
							loading={loading}
						/>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
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
		gap: 4,
		marginBottom: 20,
	},
	inputContainer: {
		justifyContent: "center",
		alignItems: "center",
		gap: 10,
		marginBottom: 20,
	},
	buttonContainer: {
		flexDirection: "column",
		marginBottom: 50,
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
	image: { width: 150, height: 250 },
	forgotPassword: {
		color: PHColors.placeholder,
		textAlign: "left",
		width: 350,
		paddingLeft: 5,
	},
});
