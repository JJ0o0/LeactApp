import PHButton from "@/src/components/Buttons/PHButton";
import PHIconButton from "@/src/components/Buttons/PHIconButton";
import { PHColors } from "@/src/constants/PHColors";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
	return (
		<View style={styles.container}>
			<Stack.Screen options={{ headerShown: false }} />
			<View style={styles.textContainer}>
				<Text style={styles.title}>Olá!</Text>
				<Text style={styles.subtitle}>
					Bem-Vindo ao Leact! Onde as pessoas se conectam lendo.
				</Text>
			</View>
			<View style={styles.buttonContainer}>
				<PHButton
					size={{ width: 250 }}
					text="Entrar"
					onPressed={() => {}}
					customColor={{
						normal: PHColors.border,
						pressed: PHColors.border,
						textNormal: PHColors.background,
						textPressed: PHColors.background,
					}}
				/>
				<PHButton
					size={{ width: 250 }}
					text="Cadastrar"
					onPressed={() => {}}
				/>
			</View>
			<View style={styles.otherContainer}>
				<Text style={styles.subtitle}>Entrar usando:</Text>
				<View style={styles.otherButtonContainer}>
					<PHIconButton
						icon={faGoogle as IconDefinition}
						iconSize={20}
						roundness={50}
						onPressed={() => {}}
						style={{ width: 45 }}
						customColor={{
							normal: PHColors.googleBackground,
							pressed: PHColors.googleBorder,
							iconNormal: "white",
							iconPressed: PHColors.text,
							border: PHColors.googleBorder,
						}}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: PHColors.background,
	},
	textContainer: {
		justifyContent: "center",
		alignItems: "center",
		gap: 5,
	},
	buttonContainer: {
		flexDirection: "column",
		marginTop: 20,
		marginBottom: 50,
		gap: 10,
	},
	otherContainer: { justifyContent: "center", alignItems: "center", gap: 10 },
	otherButtonContainer: {
		flexDirection: "row",
		gap: 10,
	},
	title: {
		color: PHColors.text,
		fontSize: 50,
		userSelect: "none",
	},
	subtitle: {
		color: PHColors.placeholder,
		fontSize: 16,
		userSelect: "none",
	},
});
