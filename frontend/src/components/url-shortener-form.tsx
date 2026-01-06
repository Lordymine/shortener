'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UrlResult } from "./url-result"
import { toast } from "sonner"
import { shortenUrl } from "@/services/api"
import { Loader2, ArrowRight, Link as LinkIcon, Sparkles } from "lucide-react"

export function UrlShortenerForm() {
    const [url, setUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!url) {
            toast.error("Por favor, insira uma URL válida")
            return
        }

        try {
            try {
                new URL(url)
            } catch {
                toast.error("URL inválida. Certifique-se de incluir http:// ou https://")
                return
            }

            setIsLoading(true)
            setResult(null)

            const response = await shortenUrl(url)
            setResult(response.shortUrl)
            toast.success("URL encurtada com sucesso!")

        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "Erro desconhecido ao encurtar URL")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative w-full max-w-3xl mx-auto">
            {/* Glow Effect behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue via-brand-orange to-brand-blue rounded-2xl blur-lg opacity-30 animate-pulse"></div>

            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-white/20">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-brand-blue/10 rounded-xl">
                        <LinkIcon className="w-6 h-6 text-brand-blue" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-brand-navy">Shorten a long link</h3>
                        <p className="text-slate-500 text-sm">No credit card required.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col md:block space-y-4 md:space-y-0 relative group" noValidate>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <span className="text-slate-400 font-mono text-lg">https://</span>
                        </div>
                        <Input
                            type="url"
                            placeholder="example.com/very-long-url"
                            value={url ? (url.startsWith('https://') ? url.replace('https://', '') : url.replace('http://', '')) : ''}
                            onChange={(e) => setUrl('https://' + e.target.value.replace(/^https?:\/\//, ''))}
                            disabled={isLoading}
                            className="h-16 md:h-20 pl-24 pr-4 md:pr-48 text-lg md:text-2xl bg-slate-50 border-2 border-slate-100 hover:border-slate-200 focus-visible:ring-4 focus-visible:ring-brand-blue/10 focus-visible:border-brand-blue rounded-xl transition-all font-medium text-brand-navy placeholder:text-slate-300 shadow-inner w-full"
                        />

                        {/* Desktop Button Position */}
                        <div className="hidden md:block absolute right-3 top-3 bottom-3">
                            <Button
                                type="submit"
                                size="lg"
                                className="h-full px-8 text-lg font-bold bg-brand-blue hover:bg-blue-600 text-white rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-blue/25"
                                disabled={isLoading || !url}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        Shorten
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Button Position */}
                    <div className="block md:hidden w-full">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-14 text-lg font-bold bg-brand-blue hover:bg-blue-600 text-white rounded-xl transition-all shadow-lg shadow-brand-blue/25"
                            disabled={isLoading || !url}
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    Shorten
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {result && (
                    <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-brand-blue uppercase tracking-wider">
                            <Sparkles className="w-4 h-4" />
                            Your shortened link is ready!
                        </div>
                        <UrlResult shortUrl={result} />
                    </div>
                )}
            </div>
        </div>
    )
}
