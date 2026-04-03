import PHButton from "@/src/components/Buttons/PHButton";
import { PHColors } from "@/src/constants/PHColors";
import { PHUserManagement } from "@/src/services/PHUserManagement";
import { supabase } from "@/src/utils/SupabaseConnection";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	StyleSheet,
	Text,
	View,
} from "react-native";

interface UserProfile {
	id: string;
	nome: string;
	foto_url: string;
}

export default function Main() {
	const [perfil, setPerfil] = useState<UserProfile | null>(null);
	const [usuarios, setUsuarios] = useState<UserProfile[]>([]);
	const [loading, setLoading] = useState(true);

	const loadData = async () => {
		setLoading(true);
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				const { data: myData } = await supabase
					.from("Perfil")
					.select("*")
					.eq("id", user.id)
					.single();
				if (myData) setPerfil(myData);
			}

			const { data: allUsers, error } = await supabase
				.from("Perfil")
				.select("id, nome, foto_url")
				.order("nome", { ascending: true });

			if (error) throw error;
			if (allUsers) setUsuarios(allUsers);
		} catch (err: any) {
			console.error("Erro ao carregar dados:", err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const handleLogout = async () => {
		const { error } = await PHUserManagement.logout();
		if (error) Alert.alert("Erro ao sair: ", error.message);
	};

	const renderUserItem = ({ item }: { item: UserProfile }) => (
		<View style={styles.userItem}>
			<Image source={{ uri: item.foto_url }} style={styles.miniAvatar} />
			<View>
				<Text style={styles.userName}>{item.nome}</Text>
				<Text style={styles.userStatus}>Online</Text>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ headerShown: false }} />

			<View style={styles.header}>
				{loading ? (
					<ActivityIndicator color={PHColors.border} />
				) : (
					<>
						<Image
							source={{ uri: perfil?.foto_url }}
							style={styles.avatar}
						/>
						<Text style={styles.title}>Olá, {perfil?.nome}!</Text>
					</>
				)}
			</View>

			<View style={styles.divider} />
			<Text style={styles.sectionTitle}>Outros Usuários</Text>

			<FlatList
				data={usuarios}
				keyExtractor={(item) => item.id}
				renderItem={renderUserItem}
				contentContainerStyle={styles.listContent}
				ListEmptyComponent={
					<Text style={{ color: "#888" }}>
						Nenhum outro usuário encontrado.
					</Text>
				}
			/>

			<View style={styles.buttonContainer}>
				<PHButton
					text="Sair da Conta"
					onPressed={handleLogout}
					size={{ width: 300 }}
					customColor={{
						normal: PHColors.background,
						pressed: PHColors.border,
						textNormal: "#FF4444",
						textPressed: PHColors.background,
						border: "#FF4444",
					}}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: PHColors.background,
		paddingTop: 60,
	},
	header: {
		alignItems: "center",
		marginBottom: 20,
	},
	avatar: {
		width: 120,
		height: 120,
		borderRadius: 60,
		borderWidth: 3,
		borderColor: PHColors.border,
		marginBottom: 10,
	},
	title: {
		color: PHColors.text,
		fontSize: 22,
		fontWeight: "bold",
	},
	divider: {
		height: 1,
		backgroundColor: PHColors.border,
		marginHorizontal: 20,
		opacity: 0.3,
	},
	sectionTitle: {
		color: PHColors.placeholder,
		fontSize: 14,
		textTransform: "uppercase",
		marginLeft: 20,
		marginTop: 20,
		marginBottom: 10,
		fontWeight: "bold",
	},
	listContent: {
		paddingHorizontal: 20,
		paddingBottom: 100,
	},
	userItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#1A1A1A",
		padding: 12,
		borderRadius: 12,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.05)",
	},
	miniAvatar: {
		width: 45,
		height: 45,
		borderRadius: 22.5,
		marginRight: 15,
	},
	userName: {
		color: PHColors.text,
		fontSize: 16,
		fontWeight: "600",
	},
	userStatus: {
		color: "#4CAF50",
		fontSize: 12,
	},
	buttonContainer: {
		position: "absolute",
		bottom: 30,
		width: "100%",
		alignItems: "center",
	},
});
