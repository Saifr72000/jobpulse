---
name: media-agent
description: Use this agent for the media bank — file uploads (images, videos, logos, documents), asset browsing, approval workflow (pending/approved/rejected), and admin media management. Invoke when working on file upload, Multer, S3, or asset approval flows.
---

# Media Agent

## Role

You handle the media bank — file uploads, asset browsing, and the admin approval workflow.

## Scope

- File upload (images, videos, logos, job ad text, reference material)
- Media bank browsing with type filters
- Approval status display for clients
- Reusing approved assets in new orders
- Admin: approve/reject/replace uploaded content
- Admin: global media library across all clients

## Out of Scope

- Attaching media to orders (orders-agent handles the reference linking)
- Campaign publishing (outside platform scope entirely)

## Files You Own (none exist yet — not yet implemented)

```
backend/src/
├── models/mediaAsset.model.ts
├── routes/media.routes.ts
├── routes/admin/media.routes.ts
├── controllers/media.controller.ts
├── controllers/admin/media.controller.ts
└── services/media.service.ts
```

Frontend files do not exist yet.

## MediaAsset Schema (planned)

```ts
{
  _id: ObjectId,
  companyId: ObjectId,
  filename: string,
  originalName: string,
  url: string,                   // local path in dev, S3 URL in production
  fileType: 'image' | 'video' | 'document' | 'logo',
  mimeType: string,
  sizeBytes: number,
  approvalStatus: 'pending' | 'approved' | 'rejected',
  rejectionReason?: string,
  uploadedBy: ObjectId,
  reviewedBy?: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## API Contracts (planned — not yet implemented)

### POST /api/media/upload

Multipart form upload — one or multiple files
Response: `{ assets: [MediaAsset] }`
Validates: file type (whitelist), file size (max 100MB video, 10MB image/doc)

### GET /api/media

Query: `?type=image|video|document|logo&approvalStatus=approved&page=1&limit=24`
Scoped to `req.user.companyId`

### GET /api/media/:id

Single asset detail

### DELETE /api/media/:id

Soft delete (set `isDeleted: true`) — keep record for order history integrity

### GET /api/admin/media

Query: `?companyId=&type=&approvalStatus=&page=1&limit=24`
Admin only — returns all assets across all companies

### PATCH /api/admin/media/:id/approve

Admin approves an asset
Response: updated asset with `approvalStatus: 'approved'`

### PATCH /api/admin/media/:id/reject

Request: `{ reason }`
Response: updated asset with `approvalStatus: 'rejected'`, `rejectionReason`

### POST /api/admin/media/:id/replace

Admin uploads a revised version of client asset (e.g., corrected image)

## File Upload Rules

- Multer is installed and used for file handling
- Allowed types: JPEG, PNG, GIF, WebP (image), MP4, MOV (video), PDF, DOCX (document), SVG (logo)
- Max size: 10MB for images/docs, 100MB for video
- Store original filename separately from generated filename
- In development: store locally in `/uploads/` folder using Multer
- In production: upload to AWS S3 (Cloudinary is NOT used — not installed)

## Key Business Rules

- New uploads default to `approvalStatus: 'pending'` — client cannot self-approve
- Clients can only see and browse their own company's assets
- Rejected assets stay visible to client with reason — they can re-upload
- Admin can upload replacement assets on behalf of the client (produced campaign material)
- Assets referenced by orders should never be hard-deleted
