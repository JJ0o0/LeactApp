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
	verifyCreateAnaliseFields(livroId: string, nota: number, conteudo: string) {
		if (!livroId) {
			Alert.alert("Erro", "Você precisa selecionar um livro.");
			return false;
		}
		if (nota === 0) {
			Alert.alert("Erro", "Dê uma nota para a sua leitura.");
			return false;
		}

		if (conteudo.trim().length < 10) {
			Alert.alert("Erro", "Escreva um pouco mais na sua análise.");
			return false;
		}

		return true;
	},
	verifyCreateBookFields(titulo: string, autor: string) {
		if (!titulo.trim() || !autor.trim()) {
			Alert.alert("Erro", "Título e Autor são obrigatórios.");
			return false;
		}

		return true;
	},
	formatRelativeDate(dataIso: string) {
		const data = new Date(dataIso);
		const agora = new Date();

		const hoje = new Date(
			agora.getFullYear(),
			agora.getMonth(),
			agora.getDate(),
		);
		const dataComentario = new Date(
			data.getFullYear(),
			data.getMonth(),
			data.getDate(),
		);

		const diffTempo = hoje.getTime() - dataComentario.getTime();
		const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24));

		if (diffDias === 0) {
			return data.toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else if (diffDias === 1) {
			return "Ontem";
		} else if (diffDias < 7) {
			return `há ${diffDias} dias`;
		} else {
			return data.toLocaleDateString("pt-BR", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			});
		}
	},
};
