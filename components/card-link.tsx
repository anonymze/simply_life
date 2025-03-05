// import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { Service } from "@/data/services";
import { Link } from "expo-router";
import { Image } from "expo-image";


export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={service.link ?? "/"} asChild>
      <Pressable className="items-center justify-center gap-3 grow basis-1/3 h-36 p-4 rounded-xl bg-white active:opacity-70">
        {/* <MaterialIcons
          name={service.icon as any}
          size={24}
          className={service.theme}
        /> */}
        <Image source={service.icon} style={{ width: 24, height: 24 }} />
        <Text className="text-center text-sm font-semibold">{service.name}</Text>
      </Pressable>
    </Link>
  );
}
