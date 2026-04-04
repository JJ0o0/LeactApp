import { PHColors } from "@/src/constants/PHColors";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
	id: string;
	userName: string;
	userPhoto: string;
	bookTitle: string;
	content: string;
	note: number;
	date: string;
	commentsCount?: number;
	onPress?: (id: string) => void;
}

const PHMainCard = ({
	id,
	userName,
	userPhoto,
	bookTitle,
	content,
	note,
	date,
	commentsCount = 0,
	onPress,
}: Props) => {
	return (
		<Pressable
			style={({ pressed }) => [
				styles.card,
				{
					opacity: pressed ? 0.9 : 1,
					transform: [{ scale: pressed ? 0.99 : 1 }],
				},
			]}
			onPress={() => onPress?.(id)}
		>
			<View style={styles.header}>
				<Image
					style={styles.userPhoto}
					source={{ uri: userPhoto }}
					contentFit="cover"
					transition={500}
				/>
				<View style={styles.headerText}>
					<Text style={styles.userName}>{userName}</Text>
					<Text style={styles.timeAgo}>{date}</Text>
				</View>

				<View style={styles.noteBadge}>
					<FontAwesome
						name="star"
						size={14}
						color={PHColors.starColor}
					/>
					<Text style={styles.noteText}>{note.toFixed(1)}</Text>
				</View>
			</View>
			<View style={styles.body}>
				<Text style={styles.bookTitle}>{bookTitle}</Text>
				<Text style={styles.criticaPrevia} numberOfLines={3}>
					{content}
				</Text>
			</View>
			<View style={styles.footer}>
				<View style={styles.interactionItem}>
					<FontAwesome
						name="comment-o"
						size={16}
						color={PHColors.placeholder}
					/>
					<Text style={styles.interactionText}>
						{commentsCount} comentários
					</Text>
				</View>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		width: "100%",
		borderWidth: 1.2,
		borderColor: PHColors.border,
		borderRadius: 20,
		backgroundColor: PHColors.foreground,
		padding: 15,
		marginBottom: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
	},
	header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
	headerText: { marginLeft: 12, flex: 1 },
	userName: { color: PHColors.text, fontWeight: "bold", fontSize: 16 },
	timeAgo: { color: PHColors.placeholder, fontSize: 12 },
	userPhoto: {
		width: 45,
		height: 45,
		borderRadius: 22.5,
		backgroundColor: "#333",
	},
	body: { gap: 4 },
	bookTitle: { color: PHColors.text, fontSize: 18, fontWeight: "800" },
	criticaPrevia: {
		color: PHColors.placeholder,
		fontSize: 14,
		lineHeight: 20,
	},
	noteBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 215, 0, 0.1)",
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
		gap: 5,
	},
	noteText: { color: PHColors.starColor, fontWeight: "bold", fontSize: 14 },
	footer: {
		marginTop: 15,
		paddingTop: 10,
		borderTopWidth: 1,
		borderTopColor: "rgba(255,255,255,0.05)",
	},
	interactionItem: { flexDirection: "row", alignItems: "center", gap: 6 },
	interactionText: { color: PHColors.placeholder, fontSize: 13 },
});

export default PHMainCard;
