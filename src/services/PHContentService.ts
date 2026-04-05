import { User } from "@supabase/supabase-js";
import { supabase } from "../utils/SupabaseConnection";

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
		const user = await this.getUser();

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
	async getUserAnalises(user: User | null) {
		if (!user) {
			return;
		}

		const { data, error } = await supabase
			.from("Analises")
			.select(
				`
                id, 
                conteudo, 
                nota, 
                created_at,
                Perfil (nome, foto_url),
                Livros (titulo),
                Comentarios (count)
            `,
			)
			.eq("usuario_id", user.id)
			.order("created_at", { ascending: false });

		return { data, error };
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
		const user = await this.getUser();
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
	async fetchBooks(searchTerm: string = "") {
		let query = supabase.from("Livros").select("*");

		if (searchTerm) {
			query = query.ilike("titulo", `%${searchTerm}%`);
		}

		const { data, error } = await query.limit(15);
		return { data, error };
	},
	async getUser() {
		const { data } = await supabase.auth.getUser();

		return data.user;
	},
};
