import * as ImagePicker from "expo-image-picker";
import { Router } from "expo-router";
import { Alert, Platform } from "react-native";
import { PHUtils } from "../utils/PHUtils";
import { PHContentService } from "./PHContentService";
import { PHUserService } from "./PHUserService";
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
			if (Platform.OS === "web") {
				window.alert("Erro ao entrar na conta: " + error);
			} else {
				Alert.alert("Erro ao entrar na conta: " + error);
			}
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
			if (Platform.OS === "web") {
				window.alert(
					"Aviso, este e-mail já está sendo usado ou aguarda confirmação.",
				);
			} else {
				Alert.alert(
					"Aviso",
					"Este e-mail já está sendo usado ou aguarda confirmação.",
				);
			}

			setLoading(false);
			return;
		}

		if (error) {
			if (Platform.OS === "web") {
				window.alert("Erro ao cadastrar: " + error);
			} else {
				Alert.alert("Erro ao cadastrar: " + error);
			}
		} else {
			if (Platform.OS === "web") {
				window.alert("Conta criada! Verifique seu email.");
			} else {
				Alert.alert("Conta criada! Verifique seu email.");
			}
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
				if (Platform.OS === "web") {
					window.alert("Erro no Login: " + error.message);
				} else {
					Alert.alert("Erro no Login: ", error.message);
				}
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
			if (Platform.OS === "web") {
				window.alert("Erro: " + error.message);
			} else {
				Alert.alert("Erro", error.message);
			}
		} else {
			if (Platform.OS === "web") {
				window.alert(
					"Sucesso! Link de recuperação enviado para o seu e-mail!",
				);
			} else {
				Alert.alert(
					"Sucesso",
					"Link de recuperação enviado para o seu e-mail!",
				);
			}

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
			if (Platform.OS === "web") {
				window.alert("Erro ao atualizar: " + error.message);
			} else {
				Alert.alert("Erro ao atualizar: ", error.message);
			}
		} else {
			const onSuccessPressed = () => {
				router.replace("/");
			};

			if (Platform.OS === "web") {
				window.alert("Sucesso, sua análise foi publicada.");
				onSuccessPressed();
			} else {
				Alert.alert("Sucesso", "Sua senha foi alterada com sucesso!", [
					{ text: "OK", onPress: onSuccessPressed },
				]);
			}
		}

		setLoading(false);
	},
	handleLogout(router: any) {
		const performLogout = async () => {
			const { success } = await PHContentService.signOut();
			if (success) router.replace("/");
		};

		if (Platform.OS === "web") {
			if (window.confirm("Deseja realmente sair da conta?"))
				performLogout();
		} else {
			Alert.alert("Sair", "Deseja realmente encerrar a sessão?", [
				{ text: "Cancelar", style: "cancel" },
				{ text: "Sair", style: "destructive", onPress: performLogout },
			]);
		}
	},
	handleDeleteAccount(userId: string, router: any) {
		const performDelete = async () => {
			const { success } = await PHContentService.deleteAccount(userId);
			if (success) router.replace("/");
		};

		const message =
			"ATENÇÃO: Isso apagará permanentemente seu perfil e todas as suas análises. Esta ação não pode ser desfeita.";

		if (Platform.OS === "web") {
			if (window.confirm(message)) performDelete();
		} else {
			Alert.alert("DELETAR CONTA", message, [
				{ text: "Cancelar", style: "cancel" },
				{
					text: "DELETAR TUDO",
					style: "destructive",
					onPress: performDelete,
				},
			]);
		}
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

			if (Platform.OS === "web") {
				window.alert("Sucesso, sua análise foi publicada.");
			} else {
				Alert.alert("Sucesso!", "Sua análise foi publicada.");
			}

			router.replace("/(tabs)");
		} catch (e: any) {
			if (Platform.OS === "web") {
				window.alert("Erro: " + e.message);
			} else {
				Alert.alert("Erro", e.message);
			}
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
			if (Platform.OS === "web") {
				window.alert("Erro, Não foi possível atualizar a análise.");
			} else {
				Alert.alert("Erro", "Não foi possível atualizar a análise.");
			}
		} else {
			if (Platform.OS === "web") {
				window.alert("Sucesso, análise atualizada!");
			} else {
				Alert.alert("Sucesso", "Análise atualizada!");
			}

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
		const user = await PHUserService.getUser();
		const response = await PHUserService.getUserAnalises(user);

		if (response && !response.error) {
			setMyAnalises(response.data || []);
		} else if (response?.error) {
			console.error("Erro ao buscar análises:", response.error.message);
		}

		setLoading(false);
	},
	async handleFetchBookAnalises(
		bookId: string,
		setAnalises: React.Dispatch<React.SetStateAction<any[]>>,
	) {
		const result = await PHContentService.getAnalisesByBookId(bookId);
		if (result.success) {
			setAnalises(result.data);
		}
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

				window.alert("Não foi possível enviar o comentário.");
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
			setAnalise((prev: { Comentarios: any[] }) => ({
				...prev,
				Comentarios: prev.Comentarios.filter(
					(c: { id: string }) => c.id !== commentId,
				),
			}));
		}
	},
	async handleCreateBook(
		form: {
			titulo: string;
			autor: string;
			capa_url: string;
			isbn: string;
		},
		fromAnalise: boolean,
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
				if (Platform.OS === "web") {
					window.alert("Sucesso! Livro cadastrado com sucesso.");
				} else {
					Alert.alert("Sucesso!", "Livro cadastrado com sucesso.");
				}

				router.back();

				if (fromAnalise) {
					router.push({
						pathname: "/analise/create-analise",
						params: { livroId: data.id, tituloLivro: data.titulo },
					});
				}
			}
		} catch (error: any) {
			Alert.alert("Erro ao cadastrar", error.message);
		} finally {
			setLoading(false);
		}
	},
	async handleDeleteBook(bookId: string, onSuccess: () => void) {
		if (Platform.OS === "web") {
			if (
				window.confirm(
					"Tem certeza? Isso apagará o livro e todas as análises permanentemente.",
				)
			) {
				const result = await PHContentService.deleteBook(bookId);
				if (result.success) onSuccess();
			}

			return;
		}

		Alert.alert(
			"Excluir Livro",
			"Tem certeza? Isso apagará o livro e todas as análises permanentemente.",
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Excluir",
					style: "destructive",
					onPress: async () => {
						const result =
							await PHContentService.deleteBook(bookId);
						if (result.success) onSuccess();
					},
				},
			],
		);
	},
	async handleGetBookDetails(
		id: string,
		setBook: React.Dispatch<React.SetStateAction<any>>,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		setLoading(true);

		const result = await PHContentService.getBookById(id);

		if (result.success && result.data) {
			setBook(result.data);
		} else {
			console.error("Handler: Falha ao setar o livro");
		}

		setLoading(false);
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
	//#endregion
	//#region REALTIME
	handleRealtimeComments(id: string, setAnalise: React.Dispatch<any>) {
		return PHContentService.realtimeComments(id, () => {
			this.handleAnaliseDataFetch(id, setAnalise);
		});
	},
	handleRealtimeFeed(
		setAnalises: React.Dispatch<React.SetStateAction<any[]>>,
	) {
		return PHContentService.realtimeFeed(() => {
			this.handleFeedDataLoading(
				setAnalises,
				() => {},
				() => {},
			);
		});
	},
	handleRealtimeUsers(
		setAnalises: React.Dispatch<React.SetStateAction<any[]>>,
	) {
		return PHContentService.realtimeUsers(() => {
			this.handleFeedDataLoading(
				setAnalises,
				() => {},
				() => {},
			);
		});
	},
	handleRealtimeBooks(
		search: string,
		setBooks: React.Dispatch<React.SetStateAction<any[]>>,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		return PHContentService.realtimeBooks((payload) => {
			console.log("Mudança real-time detectada:", payload.eventType);
			this.handleFetchBooks(search, setBooks, setLoading);
		});
	},
	async handleFetchProfileData(
		setUserData: (data: any) => void,
		setLastReview: (data: any) => void,
		setLoading: (loading: boolean) => void,
	) {
		setLoading(true);
		const result = await PHUserService.getProfileAndLastReview();

		if (result.success) {
			const unifiedUser = {
				...result.profileData,
				accountCreated: result.authData?.created_at,
			};
			setUserData(unifiedUser);
			setLastReview(result.lastReview);
		}
		setLoading(false);
	},
	async handlePickImage(setImage: (uri: string) => void) {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.5,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	},
	async handleSaveProfile(
		userId: string,
		nome: string,
		newImageUri: string | null,
		onSuccess: () => void,
	) {
		let updates: any = { nome };

		if (newImageUri && !newImageUri.startsWith("http")) {
			const uploadResult = await PHContentService.uploadAvatar(
				userId,
				newImageUri,
			);

			if (uploadResult.success) {
				console.log("URL gerada com sucesso:", uploadResult.url);
				updates.foto_url = uploadResult.url;
			} else {
				Alert.alert("Erro", "Falha ao subir imagem.");
				return;
			}
		}

		console.log("Enviando updates para o banco:", updates);

		const result = await PHContentService.updateProfile(userId, updates);

		if (result.success) {
			onSuccess();
		} else {
			console.error("Erro ao atualizar tabela Perfil:", result.error);
			Alert.alert(
				"Erro",
				"Não foi possível atualizar os dados do perfil.",
			);
		}
	},
	async handleGetUser(setUserData: React.Dispatch<any>) {
		const user = await PHUserService.getUser();

		setUserData(user);
	},
};
