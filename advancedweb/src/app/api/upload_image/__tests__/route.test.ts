/**
 * @jest-environment node
 */
import { POST } from '../route'
import { prisma } from '@/libs/prisma'
import jwt from 'jsonwebtoken'

jest.mock('@/libs/prisma', () => ({
  prisma: {
    album: { findUnique: jest.fn() },
    user: { findUnique: jest.fn() },
    image: { create: jest.fn() },
  },
}))

jest.mock('jsonwebtoken')

const mockAlbumFindUnique = prisma.album.findUnique as jest.Mock
const mockUserFindUnique = prisma.user.findUnique as jest.Mock
const mockImageCreate = prisma.image.create as jest.Mock
const mockJwtVerify = jwt.verify as jest.Mock

function createMockRequest({
  cookie = '',
  urls = [] as string[],
  albumId = null as string | null,
} = {}) {
  return {
    headers: {
      get: jest.fn((name: string) => (name === 'cookie' ? cookie : null)),
    },
    json: jest.fn().mockResolvedValue({ urls, album_id: albumId }),
  } as unknown as Request
}

describe('POST /api/upload_image', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication', () => {
    test('returns 401 when token is missing from cookie', async () => {
      const req = createMockRequest({ cookie: '' })
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    test('returns 401 for an invalid JWT token', async () => {
      mockJwtVerify.mockImplementation(() => {
        throw new Error('jwt malformed')
      })

      const req = createMockRequest({ cookie: 'access_token=badtoken' })
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(401)
      expect(data.error).toContain('Invalid token')
    })

    test('returns 401 when token has no user_id', async () => {
      mockJwtVerify.mockReturnValue({ user_id: '' })

      const req = createMockRequest({ cookie: 'access_token=token' })
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(401)
      expect(data.error).toBe('Invalid user ID in token')
    })
  })

  describe('Input Validation', () => {
    beforeEach(() => {
      mockJwtVerify.mockReturnValue({ user_id: 'user-1' })
    })

    test('returns 400 when urls are missing', async () => {
      const req = createMockRequest({
        cookie: 'access_token=token',
        urls: [],
        albumId: 'album-1',
      })
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(400)
      expect(data.message).toBe('Missing urls or album_id')
    })

    test('returns 400 when album_id is missing', async () => {
      const req = createMockRequest({
        cookie: 'access_token=token',
        urls: ['/uploads/photo.jpg'],
        albumId: null,
      })
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(400)
      expect(data.message).toBe('Missing urls or album_id')
    })
  })

  describe('Authorization', () => {
    beforeEach(() => {
      mockJwtVerify.mockReturnValue({ user_id: 'user-1' })
    })

    test('returns 404 when album does not exist', async () => {
      mockAlbumFindUnique.mockResolvedValue(null)

      const req = createMockRequest({
        cookie: 'access_token=token',
        urls: ['/uploads/photo.jpg'],
        albumId: 'nonexistent-album',
      })
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(404)
      expect(data.error).toBe('Album does not exist')
    })

    test('returns 403 when user is not a member of the album', async () => {
      mockAlbumFindUnique.mockResolvedValue({ album_id: 'album-1', users: [] })

      const req = createMockRequest({
        cookie: 'access_token=token',
        urls: ['/uploads/photo.jpg'],
        albumId: 'album-1',
      })
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(403)
      expect(data.error).toBe("You don't have permission to upload to this album")
    })

    test('returns 404 when user does not exist in DB', async () => {
      mockAlbumFindUnique.mockResolvedValue({
        album_id: 'album-1',
        users: [{ user_id: 'user-1' }],
      })
      mockUserFindUnique.mockResolvedValue(null)

      const req = createMockRequest({
        cookie: 'access_token=token',
        urls: ['/uploads/photo.jpg'],
        albumId: 'album-1',
      })
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(404)
      expect(data.error).toBe('User does not exist')
    })
  })

  describe('Successful Upload', () => {
    beforeEach(() => {
      mockJwtVerify.mockReturnValue({ user_id: 'user-1' })
      mockAlbumFindUnique.mockResolvedValue({
        album_id: 'album-1',
        users: [{ user_id: 'user-1' }],
      })
      mockUserFindUnique.mockResolvedValue({ user_id: 'user-1' })
      mockImageCreate.mockResolvedValue({
        image_id: 'img-1',
        url: '/uploads/test.jpg',
        album_id: 'album-1',
        user_id: 'user-1',
      })
    })

    test('returns 200 with upload results for a valid request', async () => {
      const req = createMockRequest({
        cookie: 'access_token=token',
        urls: ['/uploads/photo.jpg'],
        albumId: 'album-1',
      })
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.message).toBe('Images uploaded successfully')
      expect(data.imageUrls).toHaveLength(1)
      expect(data.images).toHaveLength(1)
    })

    test('returns all URLs when multiple files are uploaded', async () => {
      mockImageCreate
        .mockResolvedValueOnce({ image_id: 'img-1', url: '/uploads/a.jpg' })
        .mockResolvedValueOnce({ image_id: 'img-2', url: '/uploads/b.jpg' })

      const req = createMockRequest({
        cookie: 'access_token=token',
        urls: ['/uploads/a.jpg', '/uploads/b.jpg'],
        albumId: 'album-1',
      })
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.imageUrls).toHaveLength(2)
    })

    test('calls prisma.image.create once per requested URL', async () => {
      const req = createMockRequest({
        cookie: 'access_token=token',
        urls: ['/uploads/photo.jpg'],
        albumId: 'album-1',
      })
      await POST(req)

      expect(mockImageCreate).toHaveBeenCalledTimes(1)
      expect(mockImageCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({ album_id: 'album-1', user_id: 'user-1' }),
      })
    })
  })
})
