/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Aggregated reporting for the logged-in user's company
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Dashboard KPIs and charts for active campaigns
 *     tags: [Dashboard]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: since
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\\d{4}-\\d{2}-\\d{2}$'
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: until
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\\d{4}-\\d{2}-\\d{2}$'
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Aggregated metrics across linked platform campaigns
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardResult'
 *       400:
 *         description: Missing or invalid date range
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
