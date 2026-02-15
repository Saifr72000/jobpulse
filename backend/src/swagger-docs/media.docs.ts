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
 *     summary: Upload one or more media files (images/videos) for an order
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
 *               - orderId
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: One or more files to upload (max 50, 100 MB each). Use form field name "files".
 *               orderId:
 *                 type: string
 *                 description: Order ID (required). Must be an order belonging to the logged-in user. Use GET /api/orders/my-orders to list the user's orders for a dropdown.
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
 *         description: No files uploaded or orderId missing
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Order does not belong to this user
 *       404:
 *         description: Order, user or company not found
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
