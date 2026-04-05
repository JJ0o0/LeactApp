import PHButton from "@/src/components/Buttons/PHButton";
import PHTextBox from "@/src/components/PHTextBox";
import { PHColors } from "@/src/constants/PHColors";
import { PHContentHandler } from "@/src/services/PHContentHandler";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function CreateAnalise() {
	const router = useRouter();
	const params = useLocalSearchParams();

	const [livroId, setLivroId] = useState<string | null>(null);
	const [tituloLivro, setTituloLivro] = useState<string | null>(null);
	const [conteudo, setConteudo] = useState("");
	const [nota, setNota] = useState(0);

	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(false);

	const isEditing = params.edit === "true" && params.id;

	useEffect(() => {
		if (isEditing) {
			PHContentHandler.handleLoadAnaliseById(
				params.id as string,
				setConteudo,
				setNota,
				setLivroId,
				setTituloLivro,
				setFetching,
			);
		} else if (params.livroId) {
			setLivroId(params.livroId as string);
			setTituloLivro(params.tituloLivro as string);
		}
	}, [params.id, params.livroId]);

	const onSavePressed = () => {
		if (isEditing) {
			PHContentHandler.handleUpdateAnalise(
				params.id as string,
				conteudo,
				nota,
				router,
				setLoading,
			);
		} else {
			PHContentHandler.handleCreateAnalise(
				livroId as string,
				conteudo,
				nota,
				router,
				setLoading,
			);
		}
	};

	if (fetching) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={PHColors.border} />
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<Text style={styles.headerTitle}>
					{isEditing ? "Editar Análise" : "Nova Análise"}
				</Text>

				<Text style={styles.label}>Livro:</Text>
				<TouchableOpacity
					style={[
						styles.selectBookBtn,
						isEditing && { opacity: 0.6 },
					]}
					onPress={() =>
						!isEditing && router.push("/book/select-book")
					}
					disabled={!!isEditing}
				>
					<View style={styles.selectBookContent}>
						<FontAwesome
							name="book"
							size={18}
							color={PHColors.border}
						/>
						<Text
							style={styles.bookText}
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{tituloLivro || "Selecionar livro..."}
						</Text>
					</View>
					{!isEditing && (
						<FontAwesome
							name="chevron-right"
							size={14}
							color={PHColors.placeholder}
						/>
					)}
				</TouchableOpacity>

				<Text style={styles.label}>Sua nota:</Text>
				<View style={styles.starsRow}>
					{[1, 2, 3, 4, 5].map((star) => (
						<TouchableOpacity
							key={star}
							onPress={() => setNota(star)}
						>
							<FontAwesome
								name={star <= nota ? "star" : "star-o"}
								size={35}
								color={PHColors.starColor}
							/>
						</TouchableOpacity>
					))}
				</View>

				<Text style={styles.label}>Sua opinião:</Text>
				<PHTextBox
					value={conteudo}
					placeholder="O que achou..."
					placeholderColor={PHColors.placeholder}
					onChangeText={setConteudo}
					multiline={true}
					textBoxSettings={{ width: "100%", height: 180 }}
					extraStyle={styles.inputExtra}
				/>

				<View style={styles.buttonWrapper}>
					<PHButton
						text={
							loading
								? "Salvando..."
								: isEditing
									? "Salvar Alterações"
									: "Publicar Análise"
						}
						onPressed={onSavePressed}
						size={{ width: "100%", height: 60 }}
						loading={loading}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: PHColors.background },
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: PHColors.background,
	},
	scrollContent: { padding: 25, paddingTop: 80 },
	headerTitle: {
		color: PHColors.text,
		fontSize: 26,
		fontWeight: "bold",
		marginBottom: 30,
	},
	label: {
		color: PHColors.text,
		fontSize: 16,
		marginBottom: 12,
		fontWeight: "600",
	},
	selectBookBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "rgba(255,255,255,0.05)",
		padding: 18,
		borderRadius: 12,
		marginBottom: 30,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.1)",
	},
	selectBookContent: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	bookText: {
		flex: 1,
		marginRight: 10,
		color: PHColors.border,
		fontSize: 16,
		fontWeight: "500",
		textOverflow: "ellipsis",
	},
	starsRow: { flexDirection: "row", gap: 15, marginBottom: 35 },
	inputExtra: { textAlignVertical: "top", paddingTop: 15, marginBottom: 30 },
	buttonWrapper: { marginTop: 10, paddingBottom: 40 },
});
