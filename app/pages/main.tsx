import PHMainCard from "@/src/components/Cards/PHMainCard";
import { PHColors } from "@/src/constants/PHColors";
import { PHContentService } from "@/src/services/PHContentService";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	StyleSheet,
	View,
} from "react-native";

export default function Main() {
	const [analises, setAnalises] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const formatDate = (dataIso: string) => {
		const data = new Date(dataIso);
		return data.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	const loadData = async () => {
		const { data, error } = await PHContentService.fetchFeed();

		if (error) {
			console.error("Erro no Banco de Dados:", error.message);
			return;
		}

		if (data) setAnalises(data);
		setLoading(false);
		setRefreshing(false);
	};

	useEffect(() => {
		loadData();
	}, []);

	const onRefresh = () => {
		setRefreshing(true);
		loadData();
	};

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={PHColors.border} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ headerTitle: "Feed Literário" }} />

			<FlatList
				data={analises}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<PHMainCard
						userName={item.Perfil?.nome || "Usuário"}
						userPhoto={item.Perfil?.foto_url}
						bookTitle={item.Livros?.titulo || "Livro Desconhecido"}
						content={item.conteudo}
						note={item.nota}
						date={formatDate(item.created_at)}
						commentsCount={0}
						onPress={() =>
							console.log("Navegar para detalhes:", item.id)
						}
					/>
				)}
				contentContainerStyle={styles.listContent}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={PHColors.border}
					/>
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: PHColors.background,
		paddingVertical: 80,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: PHColors.background,
	},
	listContent: { padding: 15, paddingBottom: 100 },
});
