/**
 * @swagger
 * tags:
 *   name: Development mocks
 *   description: Optional mock ad APIs when LINKEDIN_USE_MOCK / SNAPCHAT_USE_MOCK point here
 */

/**
 * @swagger
 * /api/mock/snapchat/v1/campaigns/{campaignId}/stats:
 *   get:
 *     summary: DB-backed Snapchat-shaped campaign stats (dev)
 *     tags: [Development mocks]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mock stats payload
 *       404:
 *         description: Unknown campaign in mock store
 */

/**
 * @swagger
 * /rest/adAnalytics:
 *   get:
 *     summary: DB-backed LinkedIn-shaped adAnalytics (dev)
 *     tags: [Development mocks]
 *     description: Mounted at `/rest` to mirror LinkedIn REST paths when using mocks.
 *     responses:
 *       200:
 *         description: Mock analytics elements
 */
