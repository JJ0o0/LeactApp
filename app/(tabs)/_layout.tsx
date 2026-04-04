import { PHColors } from "@/src/constants/PHColors";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: true,
				tabBarActiveTintColor: PHColors.text,
				tabBarInactiveTintColor: PHColors.placeholder,
				tabBarStyle: {
					backgroundColor: PHColors.background,
					borderTopColor: "rgba(255,255,255,0.1)",
					height: 65,
					paddingBottom: 10,
				},
				headerStyle: {
					backgroundColor: PHColors.background,
					height: 90,
					elevation: 0,
					shadowOpacity: 0,
				},
				headerTitleAlign: "center",
				headerTintColor: PHColors.text,
				headerTitleStyle: {
					fontSize: 20,
					marginTop: 20,
				},
				headerTitleContainerStyle: {
					paddingTop: 10,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Feed",
					tabBarIcon: ({ color }) => (
						<FontAwesome name="home" size={24} color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="usuarios"
				options={{
					title: "Comunidade",
					tabBarIcon: ({ color }) => (
						<FontAwesome name="users" size={24} color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="perfil"
				options={{
					title: "Meu Perfil",
					tabBarIcon: ({ color }) => (
						<FontAwesome
							name="user-circle"
							size={24}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
