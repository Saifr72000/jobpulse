/**
 * @swagger
 * tags:
 *   name: Folders
 *   description: Media folders scoped to company
 */

/**
 * @swagger
 * /api/folders:
 *   post:
 *     summary: Create a folder for the authenticated user's company
 *     tags: [Folders]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FolderCreateInput'
 *     responses:
 *       201:
 *         description: Folder created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *       400:
 *         description: Validation error or duplicate name
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/folders/company/{companyId}:
 *   get:
 *     summary: List folders for a company
 *     tags: [Folders]
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
 *         description: Folders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Folder'
 *       400:
 *         description: Invalid company ID
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/folders/{id}:
 *   patch:
 *     summary: Rename a folder
 *     tags: [Folders]
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
 *             $ref: '#/components/schemas/FolderRenameInput'
 *     responses:
 *       200:
 *         description: Folder updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete folder (media inside moved to root)
 *     tags: [Folders]
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
 *         description: Folder deleted
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
