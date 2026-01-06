export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface ShortenResponse {
    shortCode: string
    shortUrl: string
    originalUrl: string
}

export async function shortenUrl(originalUrl: string): Promise<ShortenResponse> {
    const response = await fetch(`${API_BASE_URL}/shorten`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: originalUrl }),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erro ao encurtar URL')
    }

    return response.json()
}
