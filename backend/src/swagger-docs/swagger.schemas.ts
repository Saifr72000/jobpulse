/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         company:
 *           type: string
 *           description: Company ID
 *         isVerified:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UserInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *
 *     Company:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Company ID
 *         name:
 *           type: string
 *           description: Company name
 *         orgNumber:
 *           type: number
 *           description: Organization number
 *         email:
 *           type: string
 *           format: email
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         website:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CompanyInput:
 *       type: object
 *       required:
 *         - name
 *         - orgNumber
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           example: Acme Corporation
 *         orgNumber:
 *           type: number
 *           example: 123456789
 *         email:
 *           type: string
 *           format: email
 *           example: contact@acme.com
 *         address:
 *           type: string
 *           example: 123 Business Street
 *         phone:
 *           type: string
 *           example: "+47 12345678"
 *         website:
 *           type: string
 *           example: https://www.acme.com
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *
 *     Success:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */
