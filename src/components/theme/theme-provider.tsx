"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

/**
 * Controla o tema pela classe `dark` no <html>, com a preferência do sistema
 * como padrão. A escolha do usuário fica em localStorage (`clinica-theme`).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="clinica-theme"
    >
      {children}
    </NextThemeProvider>
  );
}
