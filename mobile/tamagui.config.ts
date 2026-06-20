import { createTamagui, createFont, createTokens } from "@tamagui/core"
import { config as tamaguiConfig } from "@tamagui/config"

const plusJakartaFont = createFont({
  family: "System",
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
  },
  weight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
})

const tokens = createTokens({
  color: {
    primary: "#7C3AED",
    primaryLight: "#EDE9FE",
    primaryDark: "#5B21B6",
    secondary: "#A78BFA",
    background: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceSecondary: "#F5F3FF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    border: "#E5E7EB",
    borderLight: "#F3F4F6",
    error: "#EF4444",
    success: "#22C55E",
    warning: "#F59E0B",
    info: "#3B82F6",
  },
  space: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    "2xl": 24,
    "3xl": 32,
    "4xl": 40,
  },
  radius: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  size: {
    xs: 20,
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48,
    "2xl": 56,
    "3xl": 64,
  },
})

const conf = {
  ...tamaguiConfig,
  tokens,
  fonts: {
    body: plusJakartaFont,
    heading: plusJakartaFont,
  },
  themes: {
    light: {
      background: tokens.color.background,
      backgroundHover: tokens.color.surfaceSecondary,
      color: tokens.color.text,
      colorHover: tokens.color.primary,
      borderColor: tokens.color.border,
      shadowColor: "rgba(0,0,0,0.05)",
    },
    dark: {
      background: "#111827",
      backgroundHover: "#1F2937",
      color: "#F9FAFB",
      colorHover: tokens.color.secondary,
      borderColor: "#374151",
      shadowColor: "rgba(0,0,0,0.3)",
    },
  },
}

export const tamaguiConfig = createTamagui(conf)

export type AppConfig = typeof tamaguiConfig

declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends AppConfig {}
}
