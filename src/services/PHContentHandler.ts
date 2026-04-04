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
	//#region Manuseamento de Informação da Publicação
	async handleCreateAnalise(
		livroId: string,
		conteudo: string,
		nota: number,
		router: Router,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		if (!PHUtils.verifyCreateAnaliseFields(livroId, nota, conteudo)) {
			return false;
		}

		setLoading(true);
		try {
			const { error } = await PHContentService.createAnalise(
				livroId,
				conteudo,
				nota,
			);
			if (error) throw error;

			Alert.alert("Sucesso!", "Sua análise foi publicada.");
			router.replace("/(tabs)");
		} catch (e: any) {
			Alert.alert("Erro", e.message);
		} finally {
			setLoading(false);
		}
	},
	async handleUpdateAnalise(
		id: string,
		conteudo: string,
		nota: number,
		router: any,
		setLoading: any,
	) {
		setLoading(true);
		const { error } = await PHContentService.handleUpdateAnalise(
			id,
			conteudo,
			nota,
		);

		setLoading(false);
		if (error) {
			Alert.alert("Erro", "Não foi possível atualizar a análise.");
		} else {
			Alert.alert("Sucesso", "Análise atualizada!");

			router.back();
		}
	},
	async handleLoadAnaliseById(
		id: string,
		setConteudo: React.Dispatch<React.SetStateAction<string>>,
		setNota: React.Dispatch<React.SetStateAction<number>>,
		setLivroId: React.Dispatch<React.SetStateAction<string | null>>,
		setTituloLivro: React.Dispatch<React.SetStateAction<string | null>>,
		setFetching: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		setFetching(true);
		const { data, error } = await PHContentService.getAnaliseById(id);
		if (data && !error) {
			setConteudo(data.conteudo);
			setNota(data.nota);
			setLivroId(data.livro_id);
			setTituloLivro((data.Livros as any)?.titulo);
		}
		setFetching(false);
	},
	async handleAnaliseDataFetch(id: string, setAnalise: React.Dispatch<any>) {
		try {
			const { data, error } =
				await PHContentService.getAnaliseWithComments(id);

			setAnalise(data || null);
		} catch (error) {
			console.error("Erro ao buscar os dados da Analise: ", error);

			setAnalise(null);
		}
	},
	async handleFetchUserAnalises(
		setMyAnalises: React.Dispatch<React.SetStateAction<any[]>>,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		const user = await PHContentService.getUser();
		const response = await PHContentService.getUserAnalises(user);

		if (response && !response.error) {
			setMyAnalises(response.data || []);
		} else if (response?.error) {
			console.error("Erro ao buscar análises:", response.error.message);
		}

		setLoading(false);
	},
	async handleDeleteUserAnalise(
		id: string,
		setMyAnalises: React.Dispatch<React.SetStateAction<any[]>>,
	) {
		const { data, error } = await PHContentService.deleteAnalise(id);

		if (!error) {
			setMyAnalises((prev) => prev.filter((a) => a.id !== id));
		}
	},
	async handlePostComment(
		analiseId: string,
		conteudo: string,
		setNewComment: React.Dispatch<React.SetStateAction<string>>,
		setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
		setAnalise: React.Dispatch<any>,
	) {
		setIsSubmitting(true);

		try {
			const { error } = await PHContentService.createComment(
				analiseId,
				conteudo,
			);

			if (error) {
				console.error("Erro ao comentar:", error);
				alert("Não foi possível enviar o comentário.");
			} else {
				setNewComment("");
				await this.handleAnaliseDataFetch(analiseId, setAnalise);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	},
	async handleUpdateComment(
		commentId: string,
		novoTexto: string,
		analiseId: string,
		setAnalise: any,
	) {
		const { error } = await PHContentService.updateComment(
			commentId,
			novoTexto,
		);

		if (!error) {
			this.handleAnaliseDataFetch(analiseId, setAnalise);
		}
	},
	async handleDeleteComment(
		commentId: string,
		analiseId: string,
		setAnalise: any,
	) {
		const { error } = await PHContentService.deleteComment(commentId);

		if (!error) {
			this.handleAnaliseDataFetch(analiseId, setAnalise);
		}
	},
	async handleCreateBook(
		form: {
			titulo: string;
			autor: string;
			capa_url: string;
			isbn: string;
		},
		router: Router,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		if (!PHUtils.verifyCreateBookFields(form.titulo, form.autor)) {
			return;
		}

		setLoading(true);
		try {
			const { data, error } = await PHContentService.createBook(
				form.titulo,
				form.autor,
				form.capa_url,
				form.isbn,
			);

			if (error) {
				throw error;
			}

			if (data) {
				Alert.alert("Sucesso!", "Livro cadastrado com sucesso.");

				router.push({
					pathname: "/analise/create-analise",
					params: { livroId: data.id, tituloLivro: data.titulo },
				});
			}
		} catch (error: any) {
			Alert.alert("Erro ao cadastrar", error.message);
		} finally {
			setLoading(false);
		}
	},
	async handleFetchBooks(
		term: string,
		setBooks: React.Dispatch<React.SetStateAction<any[]>>,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		setLoading(true);
		try {
			const { data, error } = await PHContentService.fetchBooks(term);

			if (error) {
				throw error;
			}

			setBooks(data || []);
		} catch (error) {
			console.error("Erro ao buscar livros:", error);
		} finally {
			setLoading(false);
		}
	},
	async handleGetUser(setUserData: React.Dispatch<any>) {
		const user = await PHContentService.getUser();

		setUserData(user);
	},
};
