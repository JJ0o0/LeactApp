import PHIconButton from "@/src/components/Buttons/PHIconButton";
import PHMainCard from "@/src/components/Cards/PHMainCard";
import { PHColors } from "@/src/constants/PHColors";
import { PHContentHandler } from "@/src/services/PHContentHandler";
import { PHUtils } from "@/src/utils/PHUtils";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faGear, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

export default function ProfileScreen() {
	const [profile, setProfile] = useState<any>(null);
	const [lastReview, setLastReview] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		PHContentHandler.handleFetchProfileData(
			setProfile,
			setLastReview,
			setLoading,
		);
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			PHContentHandler.handleFetchProfileData(
				setProfile,
				setLastReview,
				setLoading,
			);
		}, []),
	);

	if (loading)
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={PHColors.border} />
			</View>
		);

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.content}
		>
			<View style={styles.topActions}>
				<PHIconButton
					icon={faUserPen as IconDefinition}
					iconSize={22}
					onPressed={() => router.push("/user/editProfile")}
					customColor={{
						normal: PHColors.background,
						pressed: PHColors.foreground,
						iconNormal: PHColors.text,
						iconPressed: PHColors.text,
						border: PHColors.border,
					}}
				/>
				<PHIconButton
					icon={faGear as IconDefinition}
					iconSize={22}
					onPressed={() => router.push("/user/profileSettings")}
					customColor={{
						normal: PHColors.background,
						pressed: PHColors.foreground,
						iconNormal: PHColors.text,
						iconPressed: PHColors.text,
						border: PHColors.border,
					}}
				/>
			</View>

			<View style={styles.profileSection}>
				<View style={styles.avatarWrapper}>
					<Image
						source={{
							uri:
								profile?.foto_url ||
								"https://www.gravatar.com/avatar/0?d=mp",
						}}
						style={styles.avatar}
						contentFit="cover"
						transition={500}
					/>
				</View>
				<Text style={styles.userName}>
					{profile?.nome || "Carregando..."}
				</Text>
				<Text style={styles.userJoin}>
					{profile?.accountCreated
						? "Conta criada " +
							PHUtils.formatRelativeDate(profile.accountCreated)
						: "----"}
				</Text>
			</View>

			<View style={styles.reviewSection}>
				<Text style={styles.sectionTitle}>Sua última avaliação</Text>
				{lastReview ? (
					<PHMainCard
						id={lastReview.id}
						userName={profile?.nome}
						userPhoto={profile?.foto_url}
						bookTitle={lastReview.Livros?.titulo}
						content={lastReview.conteudo}
						note={lastReview.nota}
						date={PHUtils.formatRelativeDate(lastReview.created_at)}
						onPress={() =>
							router.push(`/book/${lastReview.livro_id}`)
						}
					/>
				) : (
					<View style={styles.emptyCard}>
						<Text style={styles.emptyText}>
							Você ainda não fez nenhuma análise.
						</Text>
					</View>
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: PHColors.background },
	content: { paddingBottom: 50 },
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: PHColors.background,
	},
	topActions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		paddingHorizontal: 10,
		paddingVertical: 5,
		gap: 5,
	},
	profileSection: { alignItems: "center", marginBottom: 40 },
	avatarWrapper: {
		width: 200,
		height: 200,
		borderRadius: 100,
		borderWidth: 4,
		borderColor: PHColors.border,
		overflow: "hidden",
		backgroundColor: PHColors.foreground,
	},
	avatar: { width: "100%", height: "100%" },
	userName: {
		color: PHColors.text,
		fontSize: 26,
		fontWeight: "800",
		marginTop: 15,
	},
	userJoin: { color: PHColors.placeholder, fontSize: 14, marginTop: 4 },
	reviewSection: { paddingHorizontal: 20 },
	sectionTitle: {
		color: PHColors.text,
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 15,
	},
	emptyCard: {
		padding: 40,
		backgroundColor: PHColors.foreground,
		borderRadius: 20,
		borderWidth: 1.5,
		borderColor: PHColors.border,
		borderStyle: "dashed",
		alignItems: "center",
	},
	emptyText: { color: PHColors.placeholder, fontSize: 14 },
});
