import PHCommentCard from "@/src/components/Cards/PHCommentCard";
import { PHColors } from "@/src/constants/PHColors";
import { PHContentHandler } from "@/src/services/PHContentHandler";
import { PHUtils } from "@/src/utils/PHUtils";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export default function AnaliseInfo() {
	const { id } = useLocalSearchParams();
	const [analise, setAnalise] = useState<any>(null);
	const [userData, setUserData] = useState<any>(null);
	const [newComment, setNewComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingCommentId, setEditingCommentId] = useState<string | null>(
		null,
	);

	const handleSendComment = async () => {
		if (newComment.trim() === "") return;
		setIsSubmitting(true);

		if (editingCommentId) {
			await PHContentHandler.handleUpdateComment(
				editingCommentId,
				newComment,
				id as string,
				setAnalise,
			);
			setEditingCommentId(null);
		} else {
			await PHContentHandler.handlePostComment(
				id as string,
				newComment,
				setNewComment,
				setIsSubmitting,
				setAnalise,
			);
		}

		setNewComment("");
		setIsSubmitting(false);
	};

	const onEditPressed = (comment: any) => {
		setNewComment(comment.texto);
		setEditingCommentId(comment.id);
	};

	const onCancelEditPressed = () => {
		setEditingCommentId(null);
		setNewComment("");
	};

	const onDeletePressed = (commentId: string) => {
		if (Platform.OS === "web") {
			PHContentHandler.handleDeleteComment(
				commentId,
				id as string,
				setAnalise,
			);
			return;
		}

		Alert.alert("Apagar Comentário", "Tem certeza que deseja remover?", [
			{ text: "Cancelar", style: "cancel" },
			{
				text: "Apagar",
				style: "destructive",
				onPress: () =>
					PHContentHandler.handleDeleteComment(
						commentId,
						id as string,
						setAnalise,
					),
			},
		]);
	};

	const getUser = () => {
		PHContentHandler.handleGetUser(setUserData);
	};

	useEffect(() => {
		getUser();

		PHContentHandler.handleAnaliseDataFetch(id as string, setAnalise);
	}, [id]);

	if (!analise) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={PHColors.border} />
			</View>
		);
	}

	const dadosLivro = Array.isArray(analise?.Livros)
		? analise.Livros[0]
		: analise?.Livros;

	const titulo = dadosLivro?.titulo || analise?.titulo || "Livro sem título";
	const autorLivro =
		dadosLivro?.autor || analise?.autor || "Autor Desconhecido";
	const fotoLivro = dadosLivro?.capa_url || analise?.capa_url || "";

	const nota = analise?.nota || 0;
	const nomeAutor = analise?.Perfil?.nome || "Usuário Desconhecido";
	const fotoAutor = analise?.Perfil?.foto_url;
	const conteudo = analise?.conteudo || "Nenhum conteúdo disponível.";
	const comentarios = analise?.Comentarios || [];

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
		>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={true}
			>
				<Image
					source={{ uri: fotoLivro }}
					contentFit="fill"
					style={styles.bookCover}
				/>
				<Text style={styles.title}>{titulo}</Text>
				<Text style={styles.bookAuthorName}>{autorLivro}</Text>

				<View style={styles.ratingContainer}>
					<FontAwesome
						name="star"
						size={22}
						color={PHColors.starColor}
					/>
					<Text style={styles.ratingText}>{nota.toFixed(1)}</Text>
				</View>

				<View style={styles.authorContainer}>
					{fotoAutor ? (
						<Image
							source={{ uri: fotoAutor }}
							style={styles.authorPhoto}
						/>
					) : (
						<View style={styles.authorPhotoPlaceholder}>
							<FontAwesome
								name="user"
								size={20}
								color={PHColors.placeholder}
							/>
						</View>
					)}
					<View style={styles.authorTextInfo}>
						<Text style={styles.authorName}>{nomeAutor}</Text>
						<Text style={styles.dateText}>
							{PHUtils.formatRelativeDate(analise?.created_at)}
						</Text>
					</View>
				</View>

				<View style={styles.contentContainer}>
					<Text style={styles.contentText}>{conteudo}</Text>
				</View>

				<View style={styles.separator} />

				<Text style={styles.commentsHeader}>
					Comentários ({comentarios.length})
				</Text>

				{comentarios.map((c: any) => (
					<PHCommentCard
						key={c.id}
						text={c?.texto}
						createdAt={c.created_at}
						username={c?.Perfil?.nome || "Usuário"}
						photo_url={c.Perfil?.foto_url}
						commentUserId={c.usuario_id}
						currentUserId={userData?.id}
						onDelete={() => onDeletePressed(c.id)}
						onEdit={() => onEditPressed(c)}
					/>
				))}
			</ScrollView>

			{editingCommentId && (
				<View style={styles.editingBadge}>
					<Text style={styles.editingText}>
						A editar comentário...
					</Text>
					<TouchableOpacity onPress={onCancelEditPressed}>
						<Text style={styles.cancelText}>Cancelar</Text>
					</TouchableOpacity>
				</View>
			)}

			<View style={styles.inputArea}>
				<TextInput
					style={styles.textInput}
					placeholder="Adicione um comentário..."
					placeholderTextColor={PHColors.placeholder}
					value={newComment || ""}
					onChangeText={setNewComment}
					multiline
				/>
				<TouchableOpacity
					style={[
						styles.sendButton,
						(!newComment?.trim() || isSubmitting) &&
							styles.sendButtonDisabled,
					]}
					onPress={handleSendComment}
					disabled={!newComment?.trim() || isSubmitting}
				>
					<FontAwesome
						name={editingCommentId ? "check" : "send"}
						size={16}
						color={PHColors.background}
					/>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: PHColors.background, marginTop: 70 },
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: PHColors.background,
	},
	scrollView: { flex: 1 },
	scrollContent: { padding: 20, paddingBottom: 20 },
	title: {
		color: PHColors.text,
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 10,
	},
	ratingContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 25,
		gap: 8,
	},
	ratingText: { color: PHColors.starColor, fontSize: 20, fontWeight: "bold" },
	authorContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 25,
	},
	authorPhoto: { width: 46, height: 46, borderRadius: 23 },
	authorPhotoPlaceholder: {
		width: 46,
		height: 46,
		borderRadius: 23,
		backgroundColor: "rgba(255,255,255,0.1)",
		justifyContent: "center",
		alignItems: "center",
	},
	authorTextInfo: { marginLeft: 15, justifyContent: "center" },
	authorName: { color: PHColors.text, fontSize: 16, fontWeight: "bold" },
	bookAuthorName: {
		color: PHColors.placeholder,
		fontSize: 16,
		marginBottom: 10,
	},
	bookCover: {
		width: "60%",
		height: 300,
		alignSelf: "center",
		marginBottom: 20,
		borderWidth: 6,
		borderColor: PHColors.border,
		borderRadius: 4,
	},
	dateText: { color: PHColors.placeholder, fontSize: 13, marginTop: 2 },
	contentContainer: {
		backgroundColor: "rgba(255,255,255,0.03)",
		padding: 20,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.05)",
	},
	contentText: { color: PHColors.text, fontSize: 16, lineHeight: 24 },
	separator: {
		height: 1,
		backgroundColor: "rgba(255,255,255,0.1)",
		marginVertical: 30,
	},
	commentsHeader: {
		color: PHColors.text,
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20,
	},
	commentCard: {
		backgroundColor: "rgba(255,255,255,0.02)",
		padding: 15,
		borderRadius: 10,
		marginBottom: 12,
	},
	commentUser: {
		color: PHColors.border,
		fontWeight: "bold",
		fontSize: 14,
		marginBottom: 5,
	},
	commentText: { color: PHColors.text, fontSize: 15, lineHeight: 22 },
	emptyComments: {
		color: PHColors.placeholder,
		fontSize: 15,
		fontStyle: "italic",
		textAlign: "center",
		marginTop: 10,
	},

	inputArea: {
		flexDirection: "row",
		alignItems: "flex-end",
		padding: 15,
		paddingBottom: Platform.OS === "ios" ? 25 : 15,
		backgroundColor: PHColors.foreground,
		borderTopWidth: 1,
		borderTopColor: "rgba(255,255,255,0.05)",
	},
	textInput: {
		flex: 1,
		backgroundColor: "rgba(255,255,255,0.05)",
		color: PHColors.text,
		borderRadius: 20,
		paddingHorizontal: 15,
		paddingTop: 12,
		paddingBottom: 12,
		maxHeight: 100,
		minHeight: 45,
		fontSize: 16,
	},
	sendButton: {
		backgroundColor: PHColors.border,
		width: 45,
		height: 45,
		borderRadius: 22.5,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 10,
		marginBottom: 2,
	},
	sendButtonDisabled: {
		opacity: 0.5,
	},
	editingBadge: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		paddingHorizontal: 20,
		paddingVertical: 8,
		borderTopWidth: 1,
		borderTopColor: "rgba(255, 255, 255, 0.1)",
	},
	editingText: {
		color: PHColors.border,
		fontSize: 12,
		fontWeight: "bold",
	},
	cancelText: {
		color: "#ff4444",
		fontSize: 12,
		fontWeight: "bold",
	},
});
