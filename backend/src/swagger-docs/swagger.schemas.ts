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
 *         - companyId
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
 *         companyId:
 *           type: string
 *           description: Company ID the user belongs to
 *           example: 507f1f77bcf86cd799439011
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
 *           example: "12345678"
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
 *
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Product ID
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         sku:
 *           type: string
 *         inStock:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           example: Premium Widget
 *         description:
 *           type: string
 *           example: A high-quality widget for all your needs
 *         price:
 *           type: number
 *           example: 29.99
 *         category:
 *           type: string
 *           example: Electronics
 *         sku:
 *           type: string
 *           example: WDG-001
 *         inStock:
 *           type: boolean
 *           example: true
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Order ID
 *         company:
 *           type: string
 *           description: Company ID
 *         companyName:
 *           type: string
 *           description: Company name (denormalized)
 *         orgNumber:
 *           type: number
 *           description: Organization number (denormalized)
 *         orderedBy:
 *           type: string
 *           description: User ID who placed the order
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalAmount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         shippingAddress:
 *           type: string
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     OrderItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: Product ID
 *         productName:
 *           type: string
 *           description: Product name (denormalized)
 *         quantity:
 *           type: number
 *         priceAtPurchase:
 *           type: number
 *           description: Price at time of purchase
 *
 *     OrderInput:
 *       type: object
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               quantity:
 *                 type: number
 *                 example: 2
 *         shippingAddress:
 *           type: string
 *           example: 123 Delivery Street, Oslo
 *         notes:
 *           type: string
 *           example: Please deliver before noon
 *
 *     OrderStatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *           example: processing
 *
 *     Media:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Media ID
 *         companyId:
 *           type: string
 *           description: Company ID that owns the media
 *         uploadedBy:
 *           type: string
 *           description: User ID who uploaded the media
 *         orderId:
 *           type: string
 *           description: Optional order ID associated with the media
 *         s3Key:
 *           type: string
 *           description: S3 storage key
 *         originalFilename:
 *           type: string
 *           description: Original filename
 *         mimetype:
 *           type: string
 *           description: File MIME type
 *           example: image/png
 *         size:
 *           type: number
 *           description: File size in bytes
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
