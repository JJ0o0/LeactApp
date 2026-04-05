import PHMainCard from "@/src/components/Cards/PHMainCard";
import { PHColors } from "@/src/constants/PHColors";
import { PHContentHandler } from "@/src/services/PHContentHandler";
import { PHUtils } from "@/src/utils/PHUtils";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function UserAnalises() {
	const router = useRouter();
	const [myAnalises, setMyAnalises] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useFocusEffect(
		useCallback(() => {
			PHContentHandler.handleFetchUserAnalises(setMyAnalises, setLoading);
		}, []),
	);

	const handleDelete = (id: string) => {
		if (Platform.OS === "web") {
			if (window.confirm("Deseja mesmo apagar sua publicação?")) {
				PHContentHandler.handleDeleteUserAnalise(id, setMyAnalises);
			}

			return;
		}

		Alert.alert("Excluir Análise", "Deseja mesmo apagar sua publicação?", [
			{ text: "Cancelar", style: "cancel" },
			{
				text: "Excluir",
				style: "destructive",
				onPress: () =>
					PHContentHandler.handleDeleteUserAnalise(id, setMyAnalises),
			},
		]);
	};

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{ headerShown: true, headerBackVisible: false }}
			/>
			{loading ? (
				<View style={styles.center}>
					<ActivityIndicator color={PHColors.border} size="large" />
				</View>
			) : (
				<FlatList
					data={myAnalises}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.listPadding}
					renderItem={({ item }) => {
						const totalComentarios =
							item.Comentarios?.[0]?.count || 0;

						return (
							<View style={styles.cardContainer}>
								<PHMainCard
									id={item.id}
									userName={item.Perfil?.nome || "Eu"}
									userPhoto={item.Perfil?.foto_url}
									bookTitle={item.Livros?.titulo || "Livro"}
									content={item.conteudo}
									note={item.nota}
									date={PHUtils.formatRelativeDate(
										item.created_at,
									)}
									commentsCount={totalComentarios}
									onPress={(id) =>
										router.push(`/analise/${id}`)
									}
								/>

								<View style={styles.actionsRow}>
									<TouchableOpacity
										style={styles.actionBtn}
										onPress={() =>
											router.push({
												pathname:
													"/analise/create-analise",
												params: {
													id: item.id,
													edit: "true",
												},
											})
										}
									>
										<FontAwesome
											name="edit"
											size={16}
											color={PHColors.border}
										/>
										<Text style={styles.actionText}>
											Editar
										</Text>
									</TouchableOpacity>

									<TouchableOpacity
										style={styles.actionBtn}
										onPress={() => handleDelete(item.id)}
									>
										<FontAwesome
											name="trash"
											size={16}
											color="#ff4444"
										/>
										<Text
											style={[
												styles.actionText,
												{ color: "#ff4444" },
											]}
										>
											Excluir
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						);
					}}
					ListEmptyComponent={
						<View style={styles.emptyContainer}>
							<Text style={styles.emptyText}>
								Você ainda não tem publicações.
							</Text>
						</View>
					}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: PHColors.background,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	pageTitle: {
		color: PHColors.text,
		fontSize: 28,
		fontWeight: "bold",
		marginTop: 60,
		marginBottom: 25,
		marginLeft: 5,
	},
	listPadding: {
		marginTop: 15,
		paddingHorizontal: 20,
		paddingBottom: 40,
	},
	cardContainer: {
		marginBottom: 30,
	},
	actionsRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: -8,
		marginRight: 10,
		gap: 12,
	},
	actionBtn: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: PHColors.foreground,
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 14,
		borderWidth: 1.2,
		borderColor: PHColors.border,
		gap: 8,
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
	},
	actionText: {
		color: PHColors.text,
		fontSize: 13,
		fontWeight: "700",
	},
	emptyContainer: {
		marginTop: 100,
		alignItems: "center",
	},
	emptyText: {
		color: PHColors.placeholder,
		fontSize: 16,
	},
});
