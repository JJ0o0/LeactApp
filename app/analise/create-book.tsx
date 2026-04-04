import PHButton from "@/src/components/Buttons/PHButton";
import PHTextBox from "@/src/components/PHTextBox";
import { PHColors } from "@/src/constants/PHColors";
import { PHContentHandler } from "@/src/services/PHContentHandler";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

export default function CreateBook() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState({
		titulo: "",
		autor: "",
		capa_url: "",
		isbn: "",
	});

	const onCreateBookPressed = () => {
		PHContentHandler.handleCreateBook(form, router, setLoading);
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<Text style={styles.headerTitle}>Novo Livro</Text>
				<Text style={styles.subtitle}>
					Não achou o livro na busca? Cadastre os detalhes dele
					abaixo.
				</Text>

				<View style={styles.form}>
					<Text style={styles.label}>Título do Livro *</Text>
					<PHTextBox
						value={form.titulo}
						placeholder="Ex: O Senhor dos Anéis"
						placeholderColor={PHColors.placeholder}
						onChangeText={(t) => setForm({ ...form, titulo: t })}
						autoCapitalize="words"
						textBoxSettings={{ width: "100%" }}
					/>

					<Text style={styles.label}>Autor *</Text>
					<PHTextBox
						value={form.autor}
						placeholder="Ex: J.R.R. Tolkien"
						placeholderColor={PHColors.placeholder}
						onChangeText={(t) => setForm({ ...form, autor: t })}
						autoCapitalize="words"
						textBoxSettings={{ width: "100%" }}
					/>

					<Text style={styles.label}>URL da Capa (Opcional)</Text>
					<PHTextBox
						value={form.capa_url}
						placeholder="https://link-da-imagem.com/capa.jpg"
						placeholderColor={PHColors.placeholder}
						onChangeText={(t) => setForm({ ...form, capa_url: t })}
						keyboardType="email-address"
						textBoxSettings={{ width: "100%" }}
					/>

					<Text style={styles.label}>ISBN (Opcional)</Text>
					<PHTextBox
						value={form.isbn}
						placeholder="Código de barras do livro"
						placeholderColor={PHColors.placeholder}
						onChangeText={(t) => setForm({ ...form, isbn: t })}
						keyboardType="numeric"
						textBoxSettings={{ width: "100%" }}
					/>

					<View style={{ marginTop: 20 }}>
						<PHButton
							text={"Cadastrar e Selecionar"}
							onPressed={onCreateBookPressed}
							size={{
								width: "100%",
								height: 60,
							}}
							loading={loading}
						/>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: PHColors.background },
	scrollContent: { padding: 25, paddingTop: 80 },
	headerTitle: {
		color: PHColors.text,
		fontSize: 26,
		fontWeight: "bold",
		marginBottom: 10,
	},
	subtitle: {
		color: PHColors.placeholder,
		fontSize: 14,
		marginBottom: 15,
		lineHeight: 20,
	},
	form: { gap: 5 },
	label: {
		color: PHColors.text,
		fontSize: 14,
		fontWeight: "600",
		marginTop: 15,
		marginBottom: 5,
		marginLeft: 5,
	},
});
