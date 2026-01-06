'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface UrlResultProps {
    shortUrl: string
}

export function UrlResult({ shortUrl }: UrlResultProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            if (typeof navigator !== 'undefined') {
                await navigator.clipboard.writeText(shortUrl)
                setCopied(true)
                toast.success("URL copiada para a área de transferência!")
                setTimeout(() => setCopied(false), 2000)
            } else {
                // Fallback or explicit error if not in browserenv
                console.error("Clipboard API not available")
            }
        } catch (err) {
            toast.error("Falha ao copiar URL")
        }
    }

    return (
        <div className="flex items-center space-x-2 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative w-full">
                <Input
                    readOnly
                    value={shortUrl}
                    className="pr-12 font-mono text-sm bg-muted/50"
                />
            </div>
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0 transition-all duration-200"
            >
                {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                ) : (
                    <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">Copiar</span>
            </Button>
        </div>
    )
}
