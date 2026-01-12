"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Download,
  FileText,
  Copy,
  RotateCcw,
  Moon,
  Sun,
  LayoutDashboard,
  PenLine,
  Menu,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface HeaderProps {
  resumeText?: string;
  onReset?: () => void;
}

const NAV_ITEMS = [
  { href: "/", label: "Resume Editor", icon: PenLine },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cover-letter", label: "Cover Letter", icon: FileText },
];

export function Header({ resumeText, onReset }: HeaderProps) {
  const { toast } = useToast();
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const handleDownload = () => {
    globalThis.print?.();
  };

  const handleCopyResume = () => {
    if (resumeText) {
      navigator.clipboard.writeText(resumeText);
      toast({
        title: "Resume copied!",
        description: "Your resume has been copied to clipboard."
      });
    } else {
      toast({
        title: "No resume to copy",
        description: "Please add resume content first.",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
      toast({
        title: "Resume reset",
        description: "Your resume has been reset to default."
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-4 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm no-print">
      {/* Logo & Brand */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
            <FileText className="w-8 h-8 text-primary relative z-10" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold md:text-xl text-foreground leading-tight">
              AI Resume Parser
            </h1>
            <p className="text-xs text-muted-foreground hidden lg:block">
              Optimize with AI-powered enhancements
            </p>
          </div>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "gap-2 transition-all",
                  isActive && "bg-primary/10 text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <Button
          onClick={toggleDarkMode}
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2">
          {onReset && pathname === "/" && (
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}

          {pathname === "/" && (
            <>
              <Button onClick={handleCopyResume} variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>

              <Button onClick={handleDownload} variant="default" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-card border-b shadow-lg md:hidden animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      isActive && "bg-primary/10 text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}

            {pathname === "/" && (
              <>
                <hr className="my-2" />
                <Button onClick={handleCopyResume} variant="outline" className="justify-start gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Resume
                </Button>
                <Button onClick={handleDownload} variant="default" className="justify-start gap-2">
                  <Download className="h-4 w-4" />
                  Download Resume
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
