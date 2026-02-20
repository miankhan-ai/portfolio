import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-10 h-10 transition-colors hover:bg-secondary/80 mr-4"
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5">
                <Sun
                    className={`absolute inset-0 w-full h-full transition-all duration-300 transform ${theme === "dark" ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
                        }`}
                />
                <Moon
                    className={`absolute inset-0 w-full h-full transition-all duration-300 transform ${theme === "light" ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
                        }`}
                />
            </div>
        </Button>
    );
}
