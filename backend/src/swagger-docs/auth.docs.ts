/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful; sets httpOnly cookies `access_token` and `refresh_token`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *         headers:
 *           Set-Cookie:
 *             description: Access and refresh tokens as HTTP-only cookies
 *             schema:
 *               type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/set-password:
 *   post:
 *     summary: Set password using invitation token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SetPasswordInput'
 *     responses:
 *       200:
 *         description: Password set successfully
 *       400:
 *         description: Validation error or invalid token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     description: Uses the `refresh_token` cookie to issue a new `access_token` cookie
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access token refreshed
 *       401:
 *         description: Refresh token missing
 *       403:
 *         description: Invalid or unknown refresh token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     description: Clears auth cookies and invalidates refresh token server-side when applicable
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/oauth/meta:
 *   get:
 *     summary: Start Meta (Facebook) OAuth flow
 *     tags: [Auth]
 *     description: Redirects the browser to Meta authorization. Used to obtain tokens for marketing APIs.
 *     responses:
 *       302:
 *         description: Redirect to Meta
 */

/**
 * @swagger
 * /api/auth/oauth/meta/callback:
 *   get:
 *     summary: Meta OAuth callback
 *     tags: [Auth]
 *     description: Handles redirect from Meta after user consent; exchanges code for tokens.
 *     responses:
 *       302:
 *         description: Redirect back to app (success or error)
 *       400:
 *         description: Missing or invalid OAuth parameters
 */
