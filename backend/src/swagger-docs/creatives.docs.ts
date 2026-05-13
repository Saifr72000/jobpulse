/**
 * @swagger
 * tags:
 *   name: Creatives
 *   description: Creative proposals linked to orders
 */

/**
 * @swagger
 * /api/creatives/order/{orderId}:
 *   get:
 *     summary: List creatives for an order
 *     tags: [Creatives]
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
 *         description: Creatives for the order
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Creative'
 *       400:
 *         description: Invalid order ID
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/creatives:
 *   post:
 *     summary: Create a creative for an order
 *     tags: [Creatives]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreativeCreateInput'
 *     responses:
 *       201:
 *         description: Creative created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Creative'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/creatives/{id}/status:
 *   patch:
 *     summary: Update creative approval status
 *     tags: [Creatives]
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
 *             $ref: '#/components/schemas/CreativeStatusUpdate'
 *     responses:
 *       200:
 *         description: Updated creative
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/creatives/{id}:
 *   delete:
 *     summary: Delete a creative
 *     tags: [Creatives]
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
