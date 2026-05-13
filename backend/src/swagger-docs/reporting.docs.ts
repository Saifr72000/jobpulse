/**
 * @swagger
 * tags:
 *   name: Reporting
 *   description: Per-order reporting and stored platform tokens
 */

/**
 * @swagger
 * /api/reporting/tokens:
 *   post:
 *     summary: Upsert a platform access token (admin / integration)
 *     tags: [Reporting]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReportingTokenInput'
 *     responses:
 *       200:
 *         description: Token saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: object
 *       400:
 *         description: Invalid platform or missing accessToken
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reporting/{orderId}/summary:
 *   get:
 *     summary: Normalised summary metrics for an order's linked campaigns
 *     tags: [Reporting]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: since
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: until
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Summary totals and per-platform breakdown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: See reporting service SummaryResult
 *       400:
 *         description: Missing since/until or invalid format
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reporting/{orderId}/timeseries:
 *   get:
 *     summary: Daily time series (impressions, clicks, spend, reach) per platform
 *     tags: [Reporting]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: since
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: until
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of normalised time-series points
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Missing or invalid date range
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reporting/{orderId}/demographics:
 *   get:
 *     summary: Demographic breakdown where supported by platform adapters
 *     tags: [Reporting]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: since
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: until
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of demographic rows (age/gender where available)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Missing or invalid date range
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
