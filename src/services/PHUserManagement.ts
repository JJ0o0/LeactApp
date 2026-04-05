import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../utils/SupabaseConnection";

WebBrowser.maybeCompleteAuthSession();

const DEFAULT_AVATAR =
	"https://ui-avatars.com/api/?name=User&background=random";
export const PHUserManagement = {
	/* 
        Realiza o cadastro de um novo usuário acionando o Trigger da 
        tabela Perfil no Supabase. 
    */
	async signUp(email: string, password: string, name: string) {
		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: { nome: name },
				},
			});

			if (error) throw error;
			return { data, error: null };
		} catch (error: any) {
			return { data: null, error: error.message };
		}
	},

	/* 
        Realiza o login de um usuário já existente.
    */
	async login(email: string, password: string) {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email,
				password: password,
			});

			if (error) {
				throw error;
			}

			if (data.user) {
				await supabase.from("Perfil").upsert({
					id: data.user.id,
					email: data.user.email,
				});
			}

			return { data, error: null };
		} catch (error: any) {
			return { data: null, error: error.message };
		}
	},

	/* 
        Desloga o usuário atualmente conectado.
    */
	async logout() {
		const { error } = await supabase.auth.signOut();

		return { error };
	},

	/* 
        Envia um email para resetar a senha do usuário.
    */
	async resetPassword(email: string) {
		const redirectTo = Linking.createURL("reset-password");
		const { data, error } = await supabase.auth.resetPasswordForEmail(
			email,
			{
				redirectTo: redirectTo,
			},
		);

		return { data, error };
	},

	/*
		Atualiza a senha após recebermos o email de resetar a senha.
	*/
	async updatePassword(newPassword: string) {
		const { data, error } = await supabase.auth.updateUser({
			password: newPassword,
		});

		return { data, error };
	},

	/* 
		Realiza o login/cadastro de um usuário usando o Google.
	*/
	async loginWithGoogle() {
		const redirectTo = Linking.createURL("auth-callback");

		console.log("URL DE VOLTA:", redirectTo);

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo,
				skipBrowserRedirect: true,
			},
		});

		if (error || !data?.url)
			return { error: error || new Error("Erro na URL") };

		const authResponse = await WebBrowser.openAuthSessionAsync(
			data.url,
			redirectTo,
			{ showInRecents: true },
		);

		if (authResponse.type === "success" && authResponse.url) {
			const url = authResponse.url.replace("#", "?");
			const params = new URL(url).searchParams;
			const access_token = params.get("access_token");
			const refresh_token = params.get("refresh_token");

			if (access_token) {
				await supabase.auth.setSession({
					access_token,
					refresh_token: refresh_token || "",
				});

				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (user) {
					const rawPhotoUrl =
						user.user_metadata.avatar_url ||
						user.user_metadata.picture;

					const highResPhotoUrl = rawPhotoUrl
						? rawPhotoUrl.replace("=s96-c", "=s400-c")
						: DEFAULT_AVATAR;

					const { error: upsertError } = await supabase
						.from("Perfil")
						.upsert({
							id: user.id,
							email: user.email,
							nome: user.user_metadata.full_name,
							foto_url: highResPhotoUrl,
						});

					if (upsertError) {
						console.error(
							"Erro ao salvar no Perfil:",
							upsertError.message,
						);
					}
				}

				return { error: null };
			}
		}

		return { error: new Error("Browser fechado ou sem token") };
	},
};
