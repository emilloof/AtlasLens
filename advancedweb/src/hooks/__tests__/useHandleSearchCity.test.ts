import { renderHook, act } from '@testing-library/react'
import useHandleSearchCity from '../useHandleSearchCity'

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('useHandleSearchCity', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    test('initializes city as null, responseText as empty string, and loading as false', () => {
      const { result } = renderHook(() => useHandleSearchCity())

      expect(result.current.city).toBeNull()
      expect(result.current.responseText).toBe('')
      expect(result.current.loading).toBe(false)
    })
  })

  describe('setCity', () => {
    test('updates city state when setCity is called', () => {
      const { result } = renderHook(() => useHandleSearchCity())

      act(() => {
        result.current.setCity({ name: 'Seoul' })
      })

      expect(result.current.city?.name).toBe('Seoul')
    })
  })

  describe('handleSearch - success cases', () => {
    test('updates city and responseText on successful search', async () => {
      const cityData = [{ name: 'Seoul', country: 'KR', latitude: 37.56, longitude: 126.97 }]
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(cityData),
      })

      const { result } = renderHook(() => useHandleSearchCity())
      act(() => {
        result.current.setCity({ name: 'Seoul' })
      })

      await act(async () => {
        await result.current.handleSearch({ preventDefault: jest.fn() } as any)
      })

      expect(result.current.city).toEqual(cityData[0])
      expect(result.current.responseText).toBe('City found: Seoul, Country: KR')
    })

    test('sets loading back to false after search completes', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue([{ name: 'Seoul', country: 'KR' }]),
      })

      const { result } = renderHook(() => useHandleSearchCity())
      act(() => {
        result.current.setCity({ name: 'Seoul' })
      })

      await act(async () => {
        await result.current.handleSearch({ preventDefault: jest.fn() } as any)
      })

      expect(result.current.loading).toBe(false)
    })
  })

  describe('handleSearch - failure cases', () => {
    test('sets "City not found." when API returns a non-ok response', async () => {
      mockFetch.mockResolvedValue({ ok: false })

      const { result } = renderHook(() => useHandleSearchCity())
      act(() => {
        result.current.setCity({ name: 'Nowhere' })
      })

      await act(async () => {
        await result.current.handleSearch({ preventDefault: jest.fn() } as any)
      })

      expect(result.current.responseText).toBe('City not found.')
      expect(result.current.loading).toBe(false)
    })

    test('includes error message in responseText on network failure', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useHandleSearchCity())
      act(() => {
        result.current.setCity({ name: 'Seoul' })
      })

      await act(async () => {
        await result.current.handleSearch({ preventDefault: jest.fn() } as any)
      })

      expect(result.current.responseText).toContain('City not found.')
      expect(result.current.loading).toBe(false)
    })

    test('sets loading to true while search is in progress', async () => {
      let resolveFetch!: (v: any) => void
      mockFetch.mockImplementation(
        () => new Promise((resolve) => { resolveFetch = resolve })
      )

      const { result } = renderHook(() => useHandleSearchCity())
      act(() => {
        result.current.setCity({ name: 'Seoul' })
      })

      act(() => {
        result.current.handleSearch({ preventDefault: jest.fn() } as any)
      })

      expect(result.current.loading).toBe(true)

      await act(async () => {
        resolveFetch({ ok: false })
      })
    })
  })
})
