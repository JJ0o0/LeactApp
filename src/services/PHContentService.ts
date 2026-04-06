import { User } from "@supabase/supabase-js";
import { Platform } from "react-native";
import { supabase } from "../utils/SupabaseConnection";
import { PHUserService } from "./PHUserService";

export const PHContentService = {
	async fetchFeed() {
		const { data, error } = await supabase
			.from("Analises")
			.select(
				`
                id,
                conteudo,
                nota,
                created_at,
                Perfil:usuario_id (nome, foto_url),
                Livros:livro_id (titulo),
				Comentarios (count)
                `,
			)
			.order("created_at", { ascending: false });

		return { data, error };
	},
	async searchBook(bookName: string) {
		const { data, error } = await supabase
			.from("Analises")
			.select(
				`
                id,
                conteudo,
                nota,
                created_at,
                Perfil:usuario_id (nome, foto_url),
                Livros:livro_id!inner (titulo)
                `,
			)
			.ilike("Livros.titulo", `%${bookName}%`)
			.order("created_at", { ascending: false });

		return { data, error };
	},
	async createAnalise(livroId: string, conteudo: string, nota: number) {
		const user = await PHUserService.getUser();

		if (!user) {
			throw new Error("Usuário não autenticado");
		}

		const { data, error } = await supabase
			.from("Analises")
			.insert([
				{
					usuario_id: user.id,
					livro_id: livroId,
					conteudo: conteudo,
					nota: nota,
				},
			])
			.select();

		return { data, error };
	},
	async handleUpdateAnalise(id: string, conteudo: string, nota: number) {
		const { data, error } = await supabase
			.from("Analises")
			.update({ conteudo, nota })
			.eq("id", id);

		return { data, error };
	},
	async getAnaliseWithComments(analiseId: string) {
		const { data, error } = await supabase
			.from("Analises")
			.select(
				`
            *,
            Perfil:usuario_id (nome, foto_url),
            Livros:livro_id (titulo, autor, capa_url),
            Comentarios (
                *,
                Perfil:usuario_id (nome, foto_url) 
            )
        `,
			)
			.eq("id", analiseId)
			.single();

		return { data, error };
	},
	async getAnaliseById(id: string) {
		const { data, error } = await supabase
			.from("Analises")
			.select(
				`
            id, conteudo, nota, livro_id,
            Livros (titulo)
        `,
			)
			.eq("id", id)
			.single();

		return { data, error };
	},
	async getAnalisesByBookId(bookId: string) {
		try {
			const { data, error } = await supabase
				.from("Analises")
				.select(
					`
                *,
                Perfil:usuario_id (
                    nome,
                    foto_url
                )
            `,
				)
				.eq("livro_id", bookId)
				.order("created_at", { ascending: false });

			if (error) throw error;
			return { success: true, data };
		} catch (error) {
			console.error("Erro ao buscar análises:", error);
			return { success: false, data: [] };
		}
	},
	async deleteAnalise(id: string) {
		const { data, error } = await supabase
			.from("Analises")
			.delete()
			.eq("id", id);

		return { data, error };
	},
	async createComment(analiseId: string, conteudo: string) {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { data: null, error: new Error("Usuário não autenticado") };
		}

		const { data, error } = await supabase.from("Comentarios").insert([
			{
				analise_id: analiseId,
				usuario_id: user.id,
				texto: conteudo,
			},
		]);

		return { data, error };
	},
	async updateComment(commentId: string, novoTexto: string) {
		const { data, error } = await supabase
			.from("Comentarios")
			.update({ texto: novoTexto })
			.eq("id", commentId);

		return { data, error };
	},
	async deleteComment(commentId: string) {
		const { data, error } = await supabase
			.from("Comentarios")
			.delete()
			.eq("id", commentId);

		return { data, error };
	},
	async createBook(
		titulo: string,
		autor: string,
		capa_url: string,
		isbn: string,
	) {
		const user = await PHUserService.getUser();
		const { data, error } = await supabase
			.from("Livros")
			.insert([
				{
					titulo: titulo,
					autor: autor,
					capa_url: capa_url,
					isbn: isbn,
					criado_por: user?.id,
				},
			])
			.select()
			.single();

		return { data, error };
	},
	async deleteBook(bookId: string) {
		try {
			const { error } = await supabase
				.from("Livros")
				.delete()
				.eq("id", bookId);

			if (error) throw error;
			return { success: true };
		} catch (error) {
			console.error("Erro ao deletar livro:", error);
			return { success: false };
		}
	},
	async getBookById(id: string) {
		const { data, error } = await supabase
			.from("Livros")
			.select(
				`
            *,
            Perfil:criado_por (
                nome,
				foto_url
            )
        `,
			)
			.eq("id", id)
			.single();

		if (error) {
			console.error("Erro no Service:", error.message);
			return { success: false, data: null };
		}
		return { success: true, data };
	},
	async fetchBooks(searchTerm: string = "") {
		let query = supabase.from("Livros").select("*");

		if (searchTerm) {
			query = query.ilike("titulo", `%${searchTerm}%`);
		}

		const { data, error } = await query.limit(15);
		return { data, error };
	},
	realtimeComments(id: string, callback: any) {
		const randomId = Math.random().toString(36).substring(7);

		return supabase
			.channel(`comments_${id}_${randomId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "Comentarios",
					filter: `analise_id=eq.${id}`,
				},
				(payload) => {
					console.log(
						"Novo evento de comentário!",
						payload.eventType,
					);
					callback(payload);
				},
			)
			.subscribe();
	},
	realtimeFeed(callback: () => void) {
		const channelId = `feed_${Math.random().toString(36).substring(7)}`;

		const channel = supabase
			.channel(channelId)
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "Analises" },
				() => {
					console.log("Realtime: Mudança detectada no Feed");
					callback();
				},
			)
			.subscribe((status) => {
				if (status !== "SUBSCRIBED") {
					console.warn("Realtime: Status da inscrição:", status);
				}
			});

		return channel;
	},
	realtimeUsers(callback: () => void) {
		const randomId = Math.random().toString(36).substring(7);

		return supabase
			.channel(`users_channel_${randomId}`)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "Perfil",
				},
				(payload) => {
					console.log("Mudança de perfil detectada!", payload);
					callback();
				},
			)
			.subscribe();
	},
	realtimeBooks(onUpdate: (payload: any) => void) {
		return supabase
			.channel("public:Livros")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "Livros",
				},
				(payload) => {
					onUpdate(payload);
				},
			)
			.subscribe();
	},
	async uploadAvatar(userId: string, fileUri: string) {
		try {
			const fileExt = fileUri.split(".").pop()?.toLowerCase() || "jpg";
			const fileName = `${userId}-${Date.now()}.${fileExt}`;
			const filePath = `avatars/${fileName}`;
			const mimeType = `image/${fileExt === "png" ? "png" : "jpeg"}`;

			let fileBody;

			if (Platform.OS === "web") {
				const response = await fetch(fileUri);
				fileBody = await response.blob();
			} else {
				const formData = new FormData();
				formData.append("files", {
					uri:
						Platform.OS === "ios"
							? fileUri.replace("file://", "")
							: fileUri,
					name: fileName,
					type: mimeType,
				} as any);
				fileBody = formData;
			}

			const { error: uploadError } = await supabase.storage
				.from("perfil-fotos")
				.upload(filePath, fileBody, {
					contentType: mimeType,
					upsert: true,
				});

			if (uploadError) throw uploadError;

			const { data: urlData } = supabase.storage
				.from("perfil-fotos")
				.getPublicUrl(filePath);

			return { success: true, url: urlData.publicUrl };
		} catch (error) {
			console.error("Erro detalhado no Upload:", error);
			return { success: false, error };
		}
	},
	async updateProfile(
		userId: string,
		updates: { nome: string; avatar_url?: string },
	) {
		const { error } = await supabase
			.from("Perfil")
			.update(updates)
			.eq("id", userId);

		return { success: !error, error };
	},
	async signOut() {
		const { error } = await supabase.auth.signOut();
		return { success: !error, error };
	},
	async deleteAccount(userId: string) {
		try {
			const { error: profileError } = await supabase
				.from("Perfil")
				.delete()
				.eq("id", userId);

			if (profileError) throw profileError;

			await this.signOut();

			return { success: true };
		} catch (error) {
			return { success: false, error };
		}
	},
};
