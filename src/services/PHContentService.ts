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
                Livros:livro_id (titulo)
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
};
