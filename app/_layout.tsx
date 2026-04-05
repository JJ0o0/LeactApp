import { PHColors } from "@/src/constants/PHColors";
import { supabase } from "@/src/utils/SupabaseConnection";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";

export default function RootLayout() {
	const segments = useSegments() as string[];
	const router = useRouter();
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			const currentPath = segments.join("/");
			const inAuthGroup = segments.includes("(auth)");
			const isRoot = currentPath === "";

			if (!session && !inAuthGroup && !isRoot) {
				router.back();
				router.replace("/");
			} else if (session && (inAuthGroup || isRoot)) {
				router.back();
				router.replace("/(tabs)");
			}

			setIsReady(true);
		});

		return () => subscription.unsubscribe();
	}, [segments, router]);

	if (!isReady) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={PHColors.text} />
			</View>
		);
	}

	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerTransparent: true,
				headerTintColor: PHColors.text,
				headerTitleStyle: {
					...Platform.select({
						web: {
							userSelect: "none",
						} as any,
						default: {},
					}),
				},
				headerBackTitle: "",
				headerTitle: "",
				contentStyle: { backgroundColor: PHColors.background },
				headerTitleAlign: "center",
			}}
		/>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: PHColors.background,
	},
});
