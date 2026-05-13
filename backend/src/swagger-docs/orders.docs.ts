/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Campaign orders, Stripe checkout, invoices, platform campaign links
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new campaign order (authenticated user)
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CampaignOrderCreate'
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 campaignName:
 *                   type: string
 *                 orderType:
 *                   type: string
 *                 package:
 *                   type: string
 *                 channels:
 *                   type: array
 *                   items:
 *                     type: string
 *                 addons:
 *                   type: array
 *                   items:
 *                     type: string
 *                 assets:
 *                   $ref: '#/components/schemas/OrderAssets'
 *                 targetAudience:
 *                   type: string
 *                 additionalNotes:
 *                   type: string
 *                 paymentMethod:
 *                   type: string
 *                 totalAmount:
 *                   type: number
 *                 status:
 *                   type: string
 *                 companyName:
 *                   type: string
 *                 orgNumber:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error (e.g. channel limits)
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User or related entity not found
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get all orders (admin listing)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CampaignOrder'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders/checkout-session:
 *   post:
 *     summary: Create Stripe Checkout session for card payment
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     description: |
 *       Creates an order in `awaiting-payment` and returns a Stripe Checkout URL.
 *       Body matches campaign order creation (same shape as `POST /api/orders` checkout path in app).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CampaignOrderCreate'
 *     responses:
 *       200:
 *         description: Stripe session created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckoutSessionResponse'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User or company not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Paginated orders for the logged-in user's company
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated order summaries
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MyOrdersResponse'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders/company/{companyId}:
 *   get:
 *     summary: Get orders by company ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CampaignOrder'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders/{id}/invoice:
 *   get:
 *     summary: Download invoice PDF for an order
 *     tags: [Orders]
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
 *         description: PDF stream
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CampaignOrder'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order workflow status
 *     tags: [Orders]
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
 *             $ref: '#/components/schemas/OrderStatusUpdate'
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CampaignOrder'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders/{id}/campaigns:
 *   patch:
 *     summary: Replace platform campaign links on an order (admin / ops)
 *     tags: [Orders]
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
 *             $ref: '#/components/schemas/PlatformCampaignsUpdate'
 *     responses:
 *       200:
 *         description: Updated order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CampaignOrder'
 *       400:
 *         description: Invalid body
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
