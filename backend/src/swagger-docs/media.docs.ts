/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Media upload, folders, and S3-backed media bank
 */

/**
 * @swagger
 * /api/media/s3-test:
 *   get:
 *     summary: Development check for S3 connectivity
 *     tags: [Media]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: S3 reachable
 *       401:
 *         description: Not authenticated
 *       503:
 *         description: S3 not configured
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/media:
 *   post:
 *     summary: Upload one or more media files (multipart)
 *     tags: [Media]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Form field name must be `files` (can be repeated or array).
 *               orderId:
 *                 type: string
 *                 description: Optional. Associate upload with an order (must belong to user when set).
 *               folderId:
 *                 type: string
 *                 description: Optional. Place file in a media folder.
 *     responses:
 *       201:
 *         description: Media uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 media:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Media'
 *       400:
 *         description: No files or validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Order does not belong to user
 *       404:
 *         description: User or company not found
 *       503:
 *         description: S3 not configured
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/media/folder/{folderId}:
 *   get:
 *     summary: List media in a folder (paginated)
 *     tags: [Media]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: folderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media items in folder
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid folder ID
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/media/company/{companyId}:
 *   get:
 *     summary: List media for a company (paginated)
 *     tags: [Media]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company media
 *       400:
 *         description: Invalid company ID
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/media/order/{orderId}:
 *   get:
 *     summary: List media linked to an order (paginated)
 *     tags: [Media]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order media
 *       400:
 *         description: Invalid order ID
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/media/{id}/folder:
 *   patch:
 *     summary: Move media to a folder or back to root
 *     tags: [Media]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MediaFolderAssignInput'
 *     responses:
 *       200:
 *         description: Media updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Media or folder not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/media/{id}:
 *   get:
 *     summary: Get media metadata by ID
 *     tags: [Media]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Media'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Media not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete media (and S3 object where applicable)
 *     tags: [Media]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
