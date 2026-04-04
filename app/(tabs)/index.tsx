import PHMainCard from "@/src/components/Cards/PHMainCard";
import PHTextBox from "@/src/components/PHTextBox";
import { PHColors } from "@/src/constants/PHColors";
import { PHContentHandler } from "@/src/services/PHContentHandler";
import { PHUtils } from "@/src/utils/PHUtils";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	StyleSheet,
	Text,
	View,
} from "react-native";

export default function Main() {
	const [analises, setAnalises] = useState<any[]>([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const loadData = () => {
		PHContentHandler.handleFeedDataLoading(
			setAnalises,
			setLoading,
			setRefreshing,
		);
	};

	const onSearch = () => {
		PHContentHandler.handleFeedDataSearch(search, setAnalises);
	};

	const onRefresh = () => {
		setRefreshing(true);

		loadData();
	};

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		if (search.trim() === "") {
			setAnalises([]);
			loadData();

			return;
		}

		const delayDebounceFn = setTimeout(() => {
			onSearch();
		}, 500);

		return () => clearTimeout(delayDebounceFn);
	}, [search]);

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={PHColors.border} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.searchWrapper}>
				<PHTextBox
					value={search}
					placeholder="Pesquisar..."
					placeholderColor={PHColors.placeholder}
					textBoxSettings={{ width: "92%" }}
					onChangeText={setSearch}
				/>
			</View>
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
						date={PHUtils.formatDate(item.created_at)}
						commentsCount={0}
						onPress={() =>
							console.log("Navegar para detalhes:", item.id)
						}
					/>
				)}
				contentContainerStyle={styles.listContent}
				style={styles.list}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={PHColors.border}
					/>
				}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<FontAwesome
							name="search"
							size={50}
							color={PHColors.placeholder}
							style={{ opacity: 0.5 }}
						/>
						<Text style={styles.emptyTitle}>
							Nenhuma análise encontrada
						</Text>
						<Text style={styles.emptySubtitle}>
							Tente buscar por outro título de livro ou limpe o
							campo de pesquisa.
						</Text>
					</View>
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: PHColors.background,
	},
	list: {
		flex: 1,
		width: "100%",
	},
	listContent: {
		width: "100%",
		paddingHorizontal: 15,
		paddingBottom: 100,
		paddingTop: 10,
	},
	searchWrapper: {
		width: "100%",
		alignItems: "center",
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: PHColors.background,
	},
	emptyContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 40,
		marginTop: 50,
	},
	emptyTitle: {
		color: PHColors.text,
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 15,
		textAlign: "center",
	},
	emptySubtitle: {
		color: PHColors.placeholder,
		fontSize: 14,
		textAlign: "center",
		marginTop: 8,
		lineHeight: 20,
	},
});
