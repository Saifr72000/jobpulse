/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         company:
 *           type: string
 *           description: Company ObjectId
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
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         companyId:
 *           type: string
 *           description: MongoDB ObjectId of the company
 *
 *     UpdateCurrentUserInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *
 *     ChangePasswordInput:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *         - confirmPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           format: password
 *         newPassword:
 *           type: string
 *           format: password
 *           description: Min 8 chars; must include upper, lower, and digit
 *         confirmPassword:
 *           type: string
 *           format: password
 *
 *     SetPasswordInput:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *         - confirmPassword
 *       properties:
 *         token:
 *           type: string
 *           description: Invitation token from email link
 *         newPassword:
 *           type: string
 *           format: password
 *         confirmPassword:
 *           type: string
 *
 *     Company:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         orgNumber:
 *           type: number
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
 *         orgNumber:
 *           type: number
 *         email:
 *           type: string
 *           format: email
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         website:
 *           type: string
 *
 *     AddCompanyUserInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
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
 *         password:
 *           type: string
 *           format: password
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
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
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         type:
 *           type: string
 *           enum: [package, service, addon]
 *         channelLimit:
 *           type: integer
 *         features:
 *           type: array
 *           items:
 *             type: string
 *         logo:
 *           type: string
 *         isActive:
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
 *         - title
 *         - price
 *         - type
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           minimum: 0
 *         type:
 *           type: string
 *           enum: [package, service, addon]
 *         logo:
 *           type: string
 *           format: uri
 *         isActive:
 *           type: boolean
 *
 *     OrderLineItem:
 *       type: object
 *       required:
 *         - type
 *         - name
 *         - price
 *       properties:
 *         type:
 *           type: string
 *           enum: [package, channel, addon]
 *         name:
 *           type: string
 *         price:
 *           type: number
 *           minimum: 0
 *
 *     OrderAssets:
 *       type: object
 *       required:
 *         - imageOption
 *       properties:
 *         imageOption:
 *           type: string
 *           enum: [upload, media-library, team-suggest]
 *         imageMediaIds:
 *           type: array
 *           items:
 *             type: string
 *         leadAdDescription:
 *           type: string
 *           enum: [team-create, own]
 *         leadAdDescriptionText:
 *           type: string
 *         videoMaterials:
 *           type: string
 *           enum: [upload, media-library, combine]
 *         videoMediaIds:
 *           type: array
 *           items:
 *             type: string
 *         linkedinJobDescription:
 *           type: string
 *           enum: [team-create, own]
 *         linkedinJobDescriptionText:
 *           type: string
 *         linkedinScreeningQuestions:
 *           type: string
 *           enum: [team-create, own]
 *         linkedinScreeningQuestionsText:
 *           type: string
 *
 *     CampaignOrderCreate:
 *       type: object
 *       required:
 *         - orderType
 *         - channels
 *         - campaignName
 *         - assets
 *         - targetAudience
 *         - paymentMethod
 *         - subtotal
 *         - vatAmount
 *         - totalAmount
 *         - lineItems
 *       properties:
 *         orderType:
 *           type: string
 *           enum: [custom, package]
 *         package:
 *           type: string
 *           enum: [basic, medium, deluxe]
 *           description: Required when orderType is package
 *         channels:
 *           type: array
 *           items:
 *             type: string
 *             enum: [linkedin, facebook, google, snapchat, instagram, x]
 *         addons:
 *           type: array
 *           items:
 *             type: string
 *             enum: [lead-ads, video-campaign, linkedin-job-posting]
 *         campaignName:
 *           type: string
 *         assets:
 *           $ref: '#/components/schemas/OrderAssets'
 *         targetAudience:
 *           type: string
 *         additionalNotes:
 *           type: string
 *         paymentMethod:
 *           type: string
 *           enum: [value-card, card-payment, invoice]
 *         subtotal:
 *           type: number
 *         vatRate:
 *           type: number
 *           description: Optional; 0–1 if set
 *         vatAmount:
 *           type: number
 *         totalAmount:
 *           type: number
 *         lineItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderLineItem'
 *
 *     PlatformCampaign:
 *       type: object
 *       required:
 *         - platform
 *         - externalCampaignId
 *       properties:
 *         platform:
 *           type: string
 *           description: Normalised key, e.g. meta, linkedin, tiktok, snapchat
 *         externalCampaignId:
 *           type: string
 *         adAccountId:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         campaignStatus:
 *           type: string
 *           enum: [active, paused, completed, draft]
 *
 *     PlatformCampaignsUpdate:
 *       type: object
 *       required:
 *         - platformCampaigns
 *       properties:
 *         platformCampaigns:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlatformCampaign'
 *
 *     OrderStatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, in-progress, active, completed]
 *
 *     CampaignOrder:
 *       type: object
 *       description: Full order document as returned by GET /api/orders/{id}
 *       properties:
 *         _id:
 *           type: string
 *         company:
 *           type: string
 *         companyName:
 *           type: string
 *         orgNumber:
 *           type: number
 *         orderedBy:
 *           type: string
 *         orderType:
 *           type: string
 *           enum: [custom, package]
 *         package:
 *           type: string
 *           enum: [basic, medium, deluxe]
 *         channels:
 *           type: array
 *           items:
 *             type: string
 *         addons:
 *           type: array
 *           items:
 *             type: string
 *         lineItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderLineItem'
 *         campaignName:
 *           type: string
 *         assets:
 *           $ref: '#/components/schemas/OrderAssets'
 *         targetAudience:
 *           type: string
 *         additionalNotes:
 *           type: string
 *         paymentMethod:
 *           type: string
 *           enum: [value-card, card-payment, invoice]
 *         subtotal:
 *           type: number
 *         vatRate:
 *           type: number
 *         vatAmount:
 *           type: number
 *         totalAmount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [awaiting-payment, pending, in-progress, active, completed]
 *         stripeSessionId:
 *           type: string
 *         platformCampaigns:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlatformCampaign'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CheckoutSessionResponse:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           format: uri
 *           description: Stripe Checkout URL to redirect the browser to
 *
 *     MyOrdersResponse:
 *       type: object
 *       properties:
 *         orders:
 *           type: array
 *           items:
 *             type: object
 *             description: Order summary fields (subset of CampaignOrder)
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *
 *     Media:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         companyId:
 *           type: string
 *         uploadedBy:
 *           type: string
 *         orderId:
 *           type: string
 *         folderId:
 *           type: string
 *           nullable: true
 *         s3Key:
 *           type: string
 *         originalFilename:
 *           type: string
 *         mimetype:
 *           type: string
 *         size:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Folder:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         companyId:
 *           type: string
 *         createdBy:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     FolderCreateInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *
 *     FolderRenameInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *
 *     Creative:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         order:
 *           type: string
 *         company:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, approved]
 *         headline:
 *           type: string
 *         subline:
 *           type: string
 *         url:
 *           type: string
 *         uploadedBy:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreativeCreateInput:
 *       type: object
 *       required:
 *         - orderId
 *         - headline
 *       properties:
 *         orderId:
 *           type: string
 *         headline:
 *           type: string
 *         subline:
 *           type: string
 *         url:
 *           type: string
 *           format: uri
 *
 *     CreativeStatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, approved]
 *
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         order:
 *           type: string
 *         author:
 *           type: string
 *         role:
 *           type: string
 *           enum: [client, admin]
 *         message:
 *           type: string
 *         isRead:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CommentCreateInput:
 *       type: object
 *       required:
 *         - message
 *         - role
 *       properties:
 *         message:
 *           type: string
 *         role:
 *           type: string
 *           enum: [client, admin]
 *
 *     ReportingTokenInput:
 *       type: object
 *       required:
 *         - platform
 *         - accessToken
 *       properties:
 *         platform:
 *           type: string
 *           enum: [meta, linkedin, tiktok, snapchat]
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *         expiresAt:
 *           type: string
 *           format: date-time
 *
 *     MediaFolderAssignInput:
 *       type: object
 *       properties:
 *         folderId:
 *           type: string
 *           nullable: true
 *           description: Target folder ObjectId, or omit/null to move to root
 *
 *     DashboardResult:
 *       type: object
 *       properties:
 *         activeCampaigns:
 *           type: integer
 *         totals:
 *           type: object
 *           properties:
 *             impressions:
 *               type: number
 *             reach:
 *               type: number
 *             clicks:
 *               type: number
 *             spend:
 *               type: number
 *         clicksByPlatform:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               platform:
 *                 type: string
 *               clicks:
 *                 type: number
 *         viewsTimeseries:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               impressions:
 *                 type: number
 */
