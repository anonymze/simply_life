import { MaterialIcons } from "@expo/vector-icons";
import { Text, Pressable } from "react-native";
import { Service } from "@/services/services";
import { Link } from "expo-router";


export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={"/"} asChild>
      <Pressable className="items-center justify-center rounded-lg bg-white p-4 active:opacity-70">
        <MaterialIcons
          name={service.icon as any}
          size={24}
          className={service.theme}
        />
        <Text className="mt-2 text-center text-sm">{service.name}</Text>
      </Pressable>
    </Link>
  );
}
