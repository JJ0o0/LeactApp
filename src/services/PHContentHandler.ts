import { Router } from "expo-router";
import { Alert } from "react-native";
import { PHUtils } from "../utils/PHUtils";
import { PHContentService } from "./PHContentService";
import { PHUserManagement } from "./PHUserManagement";

export const PHContentHandler = {
	//#region Manuseamento de Credenciais do Usuário
	async handleLogin(
		email: string,
		password: string,
		router: Router,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		if (!PHUtils.verifyLoginFields(email, password)) {
			return;
		}

		setLoading(true);

		const { data, error } = await PHUserManagement.login(email, password);

		if (error) {
			Alert.alert("Erro ao entrar na conta: " + error);
		} else {
			router.replace("/(tabs)");
		}

		setLoading(false);
	},
	async handleSignup(
		name: string,
		email: string,
		password: string,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		if (!PHUtils.verifySignupFields(name, email, password)) {
			return;
		}

		setLoading(true);

		const { data, error } = await PHUserManagement.signUp(
			email,
			password,
			name,
		);

		if (!error && data?.user?.identities?.length === 0) {
			Alert.alert(
				"Aviso",
				"Este e-mail já está sendo usado ou aguarda confirmação.",
			);

			setLoading(false);
			return;
		}

		if (error) {
			Alert.alert("Erro ao cadastrar: " + error);
		} else {
			Alert.alert("Conta criada! Verifique seu email.");
		}

		setLoading(false);
	},
	async handleGoogleSignin(
		router: Router,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		setLoading(true);

		const { error } = await PHUserManagement.loginWithGoogle();

		if (error) {
			if (error.message !== "Login cancelado") {
				Alert.alert("Erro no Login: ", error.message);
			}
		} else {
			router.replace("/(tabs)");
		}

		setLoading(false);
	},
	async handleResetPasswordVerificationEmail(
		email: string,
		router: Router,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		if (!PHUtils.verifyForgotPasswordFields(email)) {
			return;
		}

		setLoading(true);
		const { error } = await PHUserManagement.resetPassword(email);

		if (error) {
			Alert.alert("Erro", error.message);
		} else {
			Alert.alert(
				"Sucesso",
				"Link de recuperação enviado para o seu e-mail!",
			);

			router.back();
		}

		setLoading(false);
	},
	async handleResetPassword(
		password: string,
		passwordConfirmation: string,
		router: Router,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		if (
			!PHUtils.verifyResetPasswordFields(password, passwordConfirmation)
		) {
			return;
		}

		setLoading(true);

		const { error } = await PHUserManagement.updatePassword(password);

		if (error) {
			Alert.alert("Erro ao atualizar: ", error.message);
		} else {
			const onSuccessPressed = () => {
				router.replace("/");
			};

			Alert.alert("Sucesso", "Sua senha foi alterada com sucesso!", [
				{ text: "OK", onPress: onSuccessPressed },
			]);
		}

		setLoading(false);
	},
	//#endregion
	//#region Manuseamento de Data do Feed
	async handleFeedDataLoading(
		setAnalises: React.Dispatch<React.SetStateAction<any[]>>,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>,
		setRefreshing: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		try {
			const { data, error } = await PHContentService.fetchFeed();
			setAnalises(data ?? []);
		} catch (error) {
			console.error("Erro no Supabase:", error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	},
	async handleFeedDataSearch(
		searchQuery: string,
		setAnalises: React.Dispatch<React.SetStateAction<any[]>>,
	) {
		try {
			const { data, error } =
				await PHContentService.searchBook(searchQuery);
			setAnalises(data ?? []);
		} catch (error) {
			console.error("Erro na busca:", error);
		}
	},
	//#endregion
};
