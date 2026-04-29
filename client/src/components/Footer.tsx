import { Github, Linkedin, Mail, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary/20 border-t border-white/5 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <img src="/logo.png" alt="Mian Khan Logo" className="h-12 w-auto object-contain mb-4 mx-auto md:mx-0 theme-logo" />
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} AI & ML Engineer. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/miankhan-ai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="text-muted-foreground hover:text-primary transition-colors hover:-translate-y-1 transform duration-200"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/miankhan"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="text-muted-foreground hover:text-primary transition-colors hover:-translate-y-1 transform duration-200"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com/miankhan.mk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              className="text-muted-foreground hover:text-primary transition-colors hover:-translate-y-1 transform duration-200"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://www.youtube.com/@MianKhann"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube Profile"
              className="text-muted-foreground hover:text-primary transition-colors hover:-translate-y-1 transform duration-200"
            >
              <Youtube className="w-6 h-6" />
            </a>
            <a
              href="mailto:miankhan.dev@gmail.com"
              aria-label="Email Contact"
              className="text-muted-foreground hover:text-primary transition-colors hover:-translate-y-1 transform duration-200"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
