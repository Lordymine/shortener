import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UrlShortenerForm } from '@/components/url-shortener-form'
import { toast } from 'sonner'
import * as api from '@/services/api'

// Mock dependencies
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

vi.mock('@/services/api', () => ({
    shortenUrl: vi.fn(),
}))

describe('UrlShortenerForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders correctly', () => {
        render(<UrlShortenerForm />)
        expect(screen.getByPlaceholderText(/Cole sua URL longa aqui/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Encurtar URL/i })).toBeInTheDocument()
    })

    it('disables button when input is empty', async () => {
        render(<UrlShortenerForm />)

        const button = screen.getByRole('button', { name: /Encurtar URL/i })
        expect(button).toBeDisabled()
    })

    it('validates invalid URL format', async () => {
        render(<UrlShortenerForm />)

        const input = screen.getByPlaceholderText(/Cole sua URL longa aqui/i)
        fireEvent.change(input, { target: { value: 'invalid-url' } })

        const button = screen.getByRole('button', { name: /Encurtar URL/i })
        fireEvent.click(button)

        await waitFor(() => {
            expect(api.shortenUrl).not.toHaveBeenCalled()
            expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('URL inválida'))
        })
    })

    it('calls shorten API and displays result on success', async () => {
        const mockShortUrl = 'http://localhost:3001/abc1234'
        vi.mocked(api.shortenUrl).mockResolvedValueOnce({
            shortCode: 'abc1234',
            shortUrl: mockShortUrl,
            originalUrl: 'https://google.com'
        })

        render(<UrlShortenerForm />)

        const input = screen.getByPlaceholderText(/Cole sua URL longa aqui/i)
        fireEvent.change(input, { target: { value: 'https://google.com' } })

        const button = screen.getByRole('button', { name: /Encurtar URL/i })
        fireEvent.click(button)

        await waitFor(() => {
            expect(api.shortenUrl).toHaveBeenCalledWith('https://google.com')
            expect(screen.getByDisplayValue(mockShortUrl)).toBeInTheDocument()
            expect(toast.success).toHaveBeenCalled()
        })
    })

    it('handles API errors', async () => {
        vi.mocked(api.shortenUrl).mockRejectedValueOnce(new Error('API Error'))

        render(<UrlShortenerForm />)

        const input = screen.getByPlaceholderText(/Cole sua URL longa aqui/i)
        fireEvent.change(input, { target: { value: 'https://google.com' } })

        const button = screen.getByRole('button', { name: /Encurtar URL/i })
        fireEvent.click(button)

        await waitFor(() => {
            expect(api.shortenUrl).toHaveBeenCalled()
            expect(toast.error).toHaveBeenCalledWith('API Error')
        })
    })
})
