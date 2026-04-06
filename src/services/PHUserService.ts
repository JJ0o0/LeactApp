import { User } from "@supabase/supabase-js";
import { Platform } from "react-native";
import { supabase } from "../utils/SupabaseConnection";

export const PHUserService = {
    async getUser() {
        const { data } = await supabase.auth.getUser();

        return data.user;
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
    async getProfileAndLastReview() {
        try {
            const user = await this.getUser();
            if (!user) return { success: false, error: "Usuário não logado" };

            const { data: profile, error: profileError } = await supabase
                .from("Perfil")
                .select("*")
                .eq("id", user.id)
                .single();

            const { data: lastReview } = await supabase
                .from("Analises")
                .select(`*, Livros (titulo, capa_url)`)
                .eq("usuario_id", user.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            return {
                success: true,
                authData: user,
                profileData: profile,
                lastReview,
            };
        } catch (error) {
            return { success: false, error };
        }
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

}