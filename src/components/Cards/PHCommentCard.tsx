import { PHColors } from "@/src/constants/PHColors";
import { PHUtils } from "@/src/utils/PHUtils";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
	text: string;
	username: string;
	photo_url: string;
	commentUserId: string;
	currentUserId: string;
	createdAt: string;
	onDelete: () => void;
	onEdit: () => void;
}

const PHCommentCard = (props: Props) => {
	const isMyComment = props.commentUserId === props.currentUserId;
	const canEdit = () => {
		if (!isMyComment) return false;

		const now = new Date();
		const createdAt = new Date(props.createdAt);
		const diffInMinutes =
			(now.getTime() - createdAt.getTime()) / (1000 * 60);

		return diffInMinutes < 15;
	};

	return (
		<View style={styles.card}>
			<View style={styles.header}>
				<View style={styles.userInfo}>
					<Image
						source={{ uri: props.photo_url }}
						style={styles.photo}
					/>
					<Text style={styles.user}>{props.username}</Text>
					<Text style={styles.dateText}>
						{PHUtils.formatRelativeDate(props.createdAt)}
					</Text>
				</View>

				{isMyComment && (
					<View style={styles.actions}>
						{canEdit() && (
							<TouchableOpacity
								onPress={props.onEdit}
								style={styles.actionBtn}
							>
								<FontAwesome
									name="pencil"
									size={14}
									color={PHColors.border}
								/>
							</TouchableOpacity>
						)}

						<TouchableOpacity
							onPress={props.onDelete}
							style={styles.actionBtn}
						>
							<FontAwesome
								name="trash"
								size={14}
								color="#ff4444"
							/>
						</TouchableOpacity>
					</View>
				)}
			</View>

			<Text style={styles.text}>{props.text}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "rgba(255,255,255,0.03)",
		padding: 15,
		borderRadius: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.05)",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	dateText: {
		color: PHColors.placeholder,
		fontSize: 10,
		marginLeft: 5,
		marginTop: 2,
	},
	userInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	photo: {
		width: 26,
		height: 26,
		borderRadius: 13,
		marginRight: 10,
		backgroundColor: "#333",
	},
	user: {
		color: PHColors.text,
		fontWeight: "bold",
		fontSize: 14,
	},
	text: {
		color: PHColors.text,
		fontSize: 15,
		lineHeight: 22,
		opacity: 0.8,
	},
	actions: {
		flexDirection: "row",
		gap: 15,
	},
	actionBtn: {
		padding: 5,
	},
});

export default PHCommentCard;
