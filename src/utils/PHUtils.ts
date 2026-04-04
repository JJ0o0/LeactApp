import { Alert } from "react-native";

export const PHUtils = {
	verifyLoginFields(email: string, password: string) {
		if (!email.trim() || password.length < 8) {
			Alert.alert("Erro", "Preencha os dados corretamente.");
			return false;
		}

		return true;
	},
	verifySignupFields(name: string, email: string, password: string) {
		if (!name.trim()) {
			Alert.alert("Erro", "Por favor, digite seu nome completo.");

			return false;
		}

		if (!email.trim() || !email.includes("@")) {
			Alert.alert("Erro", "Por favor, digite um e-mail válido.");

			return false;
		}

		if (password.length < 8) {
			Alert.alert("Erro", "A senha deve ter pelo menos 8 caracteres.");

			return false;
		}

		return true;
	},
	verifyForgotPasswordFields(email: string) {
		if (!email.trim() || !email.includes("@")) {
			Alert.alert("Erro", "Por favor, digite um e-mail válido.");
			return false;
		}

		return true;
	},
	verifyResetPasswordFields(password: string, passwordConfirmation: string) {
		if (password.length < 8) {
			Alert.alert("Erro", "A senha deve ter pelo menos 8 caracteres.");

			return false;
		}

		if (password !== passwordConfirmation) {
			Alert.alert("Erro", "As senhas não coincidem.");

			return false;
		}

		return true;
	},
	formatDate(dataIso: string) {
		const data = new Date(dataIso);
		return data.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	},
};
