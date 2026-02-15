/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Media upload and retrieval endpoints
 */

/**
 * @swagger
 * /api/media:
 *   post:
 *     summary: Upload a media file
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
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *               orderId:
 *                 type: string
 *                 description: Optional order ID to associate with the media
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
 *                   $ref: '#/components/schemas/Media'
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User or company not found
 *       503:
 *         description: S3 not configured
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/media/{id}:
 *   get:
 *     summary: Get media by ID
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     responses:
 *       200:
 *         description: Media details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Media'
 *       400:
 *         description: Invalid media ID
 *       404:
 *         description: Media not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/media/company/{companyId}:
 *   get:
 *     summary: Get all media for a company
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     responses:
 *       200:
 *         description: List of media for the company
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Media'
 *       400:
 *         description: Invalid company ID
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/media/order/{orderId}:
 *   get:
 *     summary: Get all media for an order
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: List of media for the order
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Media'
 *       400:
 *         description: Invalid order ID
 *       500:
 *         description: Server error
 */
