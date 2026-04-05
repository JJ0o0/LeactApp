import PHTextBox from "@/src/components/PHTextBox";
import { PHColors } from "@/src/constants/PHColors";
import { PHContentHandler } from "@/src/services/PHContentHandler";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function SelectBook() {
	const router = useRouter();
	const [books, setBooks] = useState<any[]>([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const delay = setTimeout(() => {
			PHContentHandler.handleFetchBooks(search, setBooks, setLoading);
		}, 400);
		return () => clearTimeout(delay);
	}, [search]);

	const handleSelect = (book: any) => {
		router.back();
		router.back();
		router.push({
			pathname: "/analise/create-analise",
			params: { livroId: book.id, tituloLivro: book.titulo },
		});
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Selecionar Livro</Text>
				<PHTextBox
					value={search}
					placeholder="Busque pelo título..."
					placeholderColor={PHColors.placeholder}
					onChangeText={setSearch}
					textBoxSettings={{ width: "100%" }}
				/>
			</View>

			{loading ? (
				<ActivityIndicator
					style={{ marginTop: 40 }}
					color={PHColors.border}
				/>
			) : (
				<FlatList
					data={books}
					keyExtractor={(item) => item.id.toString()}
					contentContainerStyle={styles.list}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={styles.bookItem}
							onPress={() => handleSelect(item)}
						>
							<View style={styles.bookInfo}>
								<View style={styles.coverWrapper}>
									{item.capa_url ? (
										<Image
											source={{ uri: item.capa_url }}
											style={styles.bookCover}
											resizeMode="cover"
										/>
									) : (
										<FontAwesome
											name="book"
											size={20}
											color={PHColors.border}
										/>
									)}
								</View>

								<View style={{ flex: 1 }}>
									<Text
										style={styles.bookTitle}
										numberOfLines={1}
									>
										{item.titulo}
									</Text>
									<Text
										style={styles.bookAuthor}
										numberOfLines={1}
									>
										{item.autor}
									</Text>
								</View>
							</View>
							<FontAwesome
								name="chevron-right"
								size={14}
								color={PHColors.placeholder}
							/>
						</TouchableOpacity>
					)}
					ListEmptyComponent={
						<View style={styles.emptyContainer}>
							<Text style={styles.emptyText}>
								Não encontrou o livro?
							</Text>
							<TouchableOpacity
								style={styles.addButton}
								onPress={() => router.push("/book/create-book")}
							>
								<Text style={styles.addButtonText}>
									+ Cadastrar Novo Livro
								</Text>
							</TouchableOpacity>
						</View>
					}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: PHColors.background },
	header: { padding: 25, paddingTop: 80 },
	title: {
		color: PHColors.text,
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 15,
	},
	list: { paddingHorizontal: 25, paddingBottom: 40 },
	bookItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "rgba(255,255,255,0.05)",
		padding: 12,
		borderRadius: 12,
		marginBottom: 12,
	},
	bookInfo: { flexDirection: "row", alignItems: "center", gap: 15, flex: 1 },

	coverWrapper: {
		width: 45,
		height: 65,
		backgroundColor: "rgba(255,255,255,0.05)",
		borderRadius: 6,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
	},
	bookCover: {
		width: "100%",
		height: "100%",
	},

	bookTitle: {
		color: PHColors.text,
		fontSize: 16,
		fontWeight: "600",
	},
	bookAuthor: { color: PHColors.placeholder, fontSize: 13, marginTop: 2 },
	emptyContainer: { alignItems: "center", marginTop: 40 },
	emptyText: { color: PHColors.text, fontSize: 16, marginBottom: 15 },
	addButton: {
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: PHColors.border,
		paddingVertical: 12,
		paddingHorizontal: 25,
		borderRadius: 10,
	},
	addButtonText: { color: PHColors.border, fontWeight: "bold", fontSize: 15 },
});
