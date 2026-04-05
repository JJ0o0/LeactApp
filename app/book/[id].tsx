import PHIconButton from "@/src/components/Buttons/PHIconButton";
import PHMainCard from "@/src/components/Cards/PHMainCard";
import { PHColors } from "@/src/constants/PHColors";
import { PHContentHandler } from "@/src/services/PHContentHandler";
import { PHUtils } from "@/src/utils/PHUtils";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
	faHashtag,
	faPen,
	faTrash,
	faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function LivroInfo() {
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const [book, setBook] = useState<any>(null);
	const [analises, setAnalises] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<any>(null);

	const onCardPress = useCallback(
		(analiseId: string) => {
			router.push(`/analise/${analiseId}`);
		},
		[router],
	);

	useEffect(() => {
		if (id) {
			const loadData = async () => {
				setLoading(true);

				await PHContentHandler.handleGetBookDetails(
					id as string,
					setBook,
					setLoading,
				);
				await PHContentHandler.handleFetchBookAnalises(
					id as string,
					setAnalises,
				);

				await PHContentHandler.handleGetUser(setUser);
				setLoading(false);
			};

			loadData();
		}
	}, [id]);

	const isOwner = user?.id === book?.criado_por;

	if (loading || !book) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={PHColors.border} />
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: PHColors.background }}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<View style={styles.coverContainer}>
						<Image
							source={{
								uri:
									book?.capa_url ||
									"https://placehold.co/300x450/000/fff?text=Sem+Capa",
							}}
							style={styles.cover}
							resizeMode="cover"
						/>
					</View>
					<Text style={styles.title}>{book?.titulo}</Text>
					<Text style={styles.author}>{book?.autor}</Text>
				</View>

				<View style={styles.content}>
					<Text style={styles.sectionTitle}>Informações Gerais</Text>

					<View style={styles.infoCard}>
						<View style={styles.infoItem}>
							<View style={styles.iconCircle}>
								<FontAwesomeIcon
									icon={faHashtag as IconDefinition}
									color={PHColors.border}
									size={14}
								/>
							</View>
							<View>
								<Text style={styles.label}>ISBN</Text>
								<Text style={styles.value}>
									{book?.isbn || "Não registrado"}
								</Text>
							</View>
						</View>

						<View style={styles.divider} />

						<View style={styles.infoItem}>
							<View style={styles.iconCircle}>
								{book?.Perfil?.avatar_url ? (
									<Image
										source={{ uri: book.Perfil.avatar_url }}
										style={styles.avatarImage}
									/>
								) : (
									<FontAwesomeIcon
										icon={faUserCircle as IconDefinition}
										color={PHColors.border}
										size={16}
									/>
								)}
							</View>
							<View>
								<Text style={styles.label}>Postado por</Text>
								<Text style={styles.value}>
									{book?.Perfil?.nome ||
										"Usuário desconhecido"}
								</Text>
							</View>
						</View>
					</View>

					{analises.length > 0 ? (
						analises.map((item) => {
							const totalComentarios =
								item.Comentarios?.[0]?.count || 0;

							return (
								<PHMainCard
									key={item.id}
									id={item.id}
									userName={item.Perfil?.nome || "Usuário"}
									userPhoto={item.Perfil?.foto_url}
									bookTitle={
										book.titulo || "Livro Desconhecido"
									}
									content={item.conteudo}
									note={item.nota}
									date={PHUtils.formatRelativeDate(
										item.created_at,
									)}
									commentsCount={totalComentarios}
									onPress={onCardPress}
								/>
							);
						})
					) : (
						<View style={styles.analysisPlaceholder}>
							<Text style={styles.placeholderText}>
								Nenhuma análise ainda. Seja o primeiro a opinar!
							</Text>
						</View>
					)}
				</View>

				<View style={{ height: 120 }} />
			</ScrollView>

			<View style={styles.fab}>
				{isOwner && (
					<PHIconButton
						icon={faTrash as IconDefinition}
						onPressed={() =>
							PHContentHandler.handleDeleteBook(
								id as string,
								() => router.back(),
							)
						}
						customColor={{
							normal: PHColors.background,
							pressed: "#ff4444",
							iconNormal: "#ff4444",
							iconPressed: "white",
							border: "#ff4444",
						}}
						iconSize={30}
						roundness={15}
						style={styles.miniFab}
					/>
				)}

				<PHIconButton
					icon={faPen as IconDefinition}
					iconSize={30}
					onPressed={() =>
						router.push({
							pathname: "/analise/create-analise",
							params: { bookId: id, bookTitle: book?.titulo },
						})
					}
					style={styles.mainFab}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: PHColors.background,
	},
	header: {
		alignItems: "center",
		paddingTop: 50,
		paddingBottom: 30,
		backgroundColor: PHColors.foreground,
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
	},
	coverContainer: {
		width: 250,
		height: 350,
		borderRadius: 15,
		elevation: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.5,
		shadowRadius: 12,
		backgroundColor: "#000",
	},
	cover: {
		width: "100%",
		height: "100%",
		borderRadius: 15,
	},
	title: {
		color: PHColors.text,
		fontSize: 26,
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 25,
		paddingHorizontal: 30,
	},
	author: {
		color: PHColors.border,
		fontSize: 18,
		marginTop: 8,
		fontWeight: "500",
	},
	content: {
		padding: 25,
	},
	sectionTitle: {
		color: PHColors.text,
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 15,
		letterSpacing: 0.5,
	},
	infoCard: {
		backgroundColor: PHColors.foreground,
		borderRadius: 20,
		padding: 20,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.05)",
		marginBottom: 15,
	},
	infoItem: {
		flexDirection: "row",
		alignItems: "center",
	},
	iconCircle: {
		width: 35,
		height: 35,
		borderRadius: 18,
		backgroundColor: "rgba(212, 161, 102, 0.1)",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15,
		overflow: "hidden",
	},
	avatarImage: {
		width: "100%",
		height: "100%",
		borderRadius: 18,
	},
	label: {
		color: PHColors.placeholder,
		fontSize: 12,
		textTransform: "uppercase",
	},
	value: {
		color: PHColors.text,
		fontSize: 15,
		fontWeight: "600",
		marginTop: 2,
	},
	divider: {
		height: 1,
		backgroundColor: "rgba(255,255,255,0.05)",
		marginVertical: 15,
		marginLeft: 50,
	},
	analysisPlaceholder: {
		marginTop: 30,
		padding: 25,
		borderRadius: 20,
		borderStyle: "dashed",
		borderWidth: 1,
		borderColor: PHColors.placeholder,
		alignItems: "center",
	},
	placeholderText: {
		color: PHColors.placeholder,
		textAlign: "center",
		lineHeight: 22,
		fontSize: 14,
	},
	fab: {
		position: "absolute",
		bottom: 30,
		right: 20,
		gap: 5,
		alignItems: "flex-end",
		zIndex: 999,
	},
	mainFab: {
		position: "relative",
		bottom: 0,
		width: 65,
		height: 65,
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
	},
	miniFab: {
		position: "relative",
		bottom: 0,
		width: 50,
		height: 50,
		elevation: 5,
	},
});
