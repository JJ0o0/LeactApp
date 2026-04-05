import PHBookCard from "@/src/components/Cards/PHBookCard";
import PHTextBox from "@/src/components/PHTextBox";
import { PHColors } from "@/src/constants/PHColors";
import { PHContentHandler } from "@/src/services/PHContentHandler";
import { supabase } from "@/src/utils/SupabaseConnection";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
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

	useEffect(() => {
		const subscription = PHContentHandler.handleRealtimeBooks(
			search,
			setBooks,
			setLoading,
		);

		return () => {
			supabase.removeChannel(subscription);
		};
	}, [search]);

	const onSelectBook = (id: any) => {
		router.push({ pathname: "/book/[id]", params: { id: id } });
	};

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{ headerShown: true, headerBackVisible: false }}
			/>

			<View style={styles.header}>
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
						<PHBookCard
							item={item}
							onPressed={() => {
								onSelectBook(item.id);
							}}
						/>
					)}
					ListEmptyComponent={
						<View style={styles.emptyContainer}>
							<Text style={styles.emptyText}>
								Não encontrou o livro?
							</Text>
							<TouchableOpacity
								style={styles.addButton}
								onPress={() =>
									router.push({
										pathname: "/book/create-book",
										params: { from: "books" },
									})
								}
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
	header: { paddingHorizontal: 10, paddingVertical: 15 },
	list: { paddingHorizontal: 25, paddingBottom: 40 },
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
