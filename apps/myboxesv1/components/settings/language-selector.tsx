"use client"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shared/ui/popover"
import { Button } from "@/components/shared/ui/button"
import { Check, Globe } from "lucide-react"

interface Language {
  code: string
  name: string
}

interface LanguageSelectorProps {
  currentLanguage: string
  onLanguageChange: (languageCode: string) => void
}

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
]

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const currentLanguageName = languages.find((lang) => lang.code === currentLanguage)?.name || "English"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {currentLanguageName}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="grid gap-1">
          {languages.map((language) => (
            <button
              key={language.code}
              className="flex items-center justify-between px-4 py-2 text-sm hover:bg-muted rounded-md"
              onClick={() => onLanguageChange(language.code)}
            >
              {language.name}
              {language.code === currentLanguage && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

