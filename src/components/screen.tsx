import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenEdge = "top" | "bottom";

export type ScreenProps = {
    children: ReactNode;
    edges?: ScreenEdge[];
};

export function Screen({ children, edges = [] }: ScreenProps) {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={{
                flex: 1,
                paddingTop: edges.includes("top") ? insets.top : 0,
                paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
            }}
        >
            {children}
        </View>
    );
}
