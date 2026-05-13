/**
 * @swagger
 * tags:
 *   name: Webhooks
 *   description: Server-to-server callbacks (not used by the SPA directly)
 */

/**
 * @swagger
 * /api/webhooks/stripe:
 *   post:
 *     summary: Stripe webhook endpoint
 *     tags: [Webhooks]
 *     description: |
 *       Expects **raw** JSON body and `Stripe-Signature` header for `constructEvent`.
 *       Typical events: `checkout.session.completed` — activates orders and sends invoice email.
 *       **Note:** OpenAPI/Swagger UI sends JSON by default; use curl or Stripe CLI to test with a raw body and signature.
 *     parameters:
 *       - in: header
 *         name: Stripe-Signature
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Stripe Event payload
 *     responses:
 *       200:
 *         description: Event acknowledged
 *       400:
 *         description: Invalid signature or payload
 *       500:
 *         description: Server error
 */
