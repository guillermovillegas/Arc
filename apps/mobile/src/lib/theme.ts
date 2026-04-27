import { Platform, StyleSheet } from "react-native";

export const colors = {
  ivory: {
    50: "#fdfcf8",
    100: "#faf8f3",
    200: "#f5f1e8",
    300: "#ede6d4",
    400: "#dfd3b4",
  },
  espresso: {
    200: "#cdc3b0",
    300: "#a8997d",
    400: "#827259",
    500: "#5f5340",
    600: "#463c2e",
    700: "#2f271d",
    800: "#1c1712",
    900: "#120e0a",
  },
  brass: {
    400: "#cca656",
    500: "#b8935a",
    600: "#9c7a45",
    700: "#7a5e37",
  },
  status: {
    confirmed: "#3b7a57",
    pending: "#b8935a",
    active: "#2f6e9e",
    completed: "#5f5340",
    cancelled: "#827259",
    error: "#9e3b3b",
  },
} as const;

export const fonts = {
  serif: Platform.select({ ios: "Georgia", default: "serif" }),
  sans: Platform.select({ ios: "System", default: "Roboto" }),
} as const;

export const base = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ivory[100],
  },
  screenPadded: {
    flex: 1,
    backgroundColor: colors.ivory[100],
    paddingHorizontal: 20,
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.espresso[200],
  },
  card: {
    backgroundColor: colors.ivory[50],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.espresso[200],
    padding: 16,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase" as const,
    color: colors.espresso[400],
    fontFamily: fonts.sans,
  },
  serifDisplay: {
    fontFamily: fonts.serif,
    color: colors.espresso[800],
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.espresso[600],
    fontFamily: fonts.sans,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.espresso[200],
    backgroundColor: colors.ivory[50],
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.espresso[800],
    fontFamily: fonts.sans,
  },
  buttonPrimary: {
    backgroundColor: colors.espresso[800],
    paddingVertical: 16,
    alignItems: "center" as const,
  },
  buttonPrimaryText: {
    color: colors.ivory[100],
    fontSize: 16,
    fontWeight: "500" as const,
    letterSpacing: 0.3,
    fontFamily: fonts.sans,
  },
  buttonBrass: {
    backgroundColor: colors.brass[500],
    paddingVertical: 16,
    alignItems: "center" as const,
  },
  buttonBrassText: {
    color: colors.espresso[800],
    fontSize: 16,
    fontWeight: "600" as const,
    fontFamily: fonts.sans,
  },
});
