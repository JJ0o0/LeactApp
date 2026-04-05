import { PHColors } from "@/src/constants/PHColors";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
	GestureResponderEvent,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

type Props = {
	item: any;
	onPressed?: (event: GestureResponderEvent) => void;
};

const PHBookCard = (props: Props) => {
	return (
		<TouchableOpacity style={styles.bookItem} onPress={props.onPressed}>
			<View style={styles.bookInfo}>
				<View style={styles.coverWrapper}>
					{props.item.capa_url ? (
						<Image
							source={{ uri: props.item.capa_url }}
							style={styles.bookCover}
							contentFit="cover"
							transition={300}
						/>
					) : (
						<FontAwesome
							name="book"
							size={20}
							color={PHColors.border}
						/>
					)}
				</View>

				<View style={{ flex: 1 }}>
					<Text style={styles.bookTitle} numberOfLines={1}>
						{props.item.titulo}
					</Text>
					<Text style={styles.bookAuthor} numberOfLines={1}>
						{props.item.autor}
					</Text>
				</View>
			</View>
			<FontAwesome
				name="chevron-right"
				size={14}
				color={PHColors.placeholder}
			/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	bookItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "rgba(255,255,255,0.05)",
		padding: 12,
		borderRadius: 12,
		marginBottom: 12,
	},
	bookInfo: { flexDirection: "row", alignItems: "center", gap: 15, flex: 1 },
	coverWrapper: {
		width: 45,
		height: 65,
		backgroundColor: "rgba(255,255,255,0.05)",
		borderRadius: 6,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
	},
	bookCover: {
		width: "100%",
		height: "100%",
	},

	bookTitle: {
		color: PHColors.text,
		fontSize: 16,
		fontWeight: "600",
	},
	bookAuthor: { color: PHColors.placeholder, fontSize: 13, marginTop: 2 },
});

export default PHBookCard;
