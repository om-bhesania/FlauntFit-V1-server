/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication related operations
 */

/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registers a new user
 *     description: Registers a new user with username, email, password, and optional contact details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the new user.
 *               email:
 *                 type: string
 *                 description: The email address of the new user.
 *               password:
 *                 type: string
 *                 description: The password of the new user (minimum 6 characters).
 *               contact:
 *                 type: string
 *                 description: Optional contact information for the user.
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *
 *       400:
 *         description: Invalid request data or email already in use
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logs in a user
 *     description: Authenticates a user with their email and password, returns a JWT token if successful.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: Successful login, returns user data with JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     userEmail:
 *                       type: string
 *                       example: user@example.com
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     token:
 *                       type: string
 *                       example: JWT_TOKEN_HERE
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /v1/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logs out the user
 *     description: Logs out the user by clearing the JWT cookie.
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Operations related to customers
 */

/**
 * @swagger
 * /v1/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: [] # Requires Bearer Token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the customer
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 description: Phone number of the customer (must be unique)
 *                 example: +1234567890
 *               email:
 *                 type: string
 *                 description: Email address of the customer (optional)
 *                 example: john.doe@example.com
 *               address:
 *                 type: string
 *                 description: Address of the customer
 *                 example: 123 Main St, Apt 4B
 *               state:
 *                 type: string
 *                 description: State of the customer
 *                 example: California
 *               city:
 *                 type: string
 *                 description: City of the customer (optional)
 *                 example: Los Angeles
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: Date of birth of the customer (optional)
 *                 example: 1990-05-15
 *               user:
 *                 type: string
 *                 description: User ID associated with the customer
 *                 example: 64b0d3e2c1234567890abcdef
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID of the created customer
 *                   example: 64b0d3e2c1234567890abcd
 *                 name:
 *                   type: string
 *                   description: Name of the created customer
 *                   example: John Doe
 *                 phone:
 *                   type: string
 *                   description: Phone number of the created customer
 *                   example: +1234567890
 *                 email:
 *                   type: string
 *                   description: Email address of the created customer
 *                   example: john.doe@example.com
 *                 address:
 *                   type: string
 *                   description: Address of the created customer
 *                   example: 123 Main St, Apt 4B
 *                 state:
 *                   type: string
 *                   description: State of the created customer
 *                   example: California
 *                 city:
 *                   type: string
 *                   description: City of the created customer
 *                   example: Los Angeles
 *                 dob:
 *                   type: string
 *                   format: date
 *                   description: Date of birth of the created customer
 *                   example: 1990-05-15
 *                 user:
 *                   type: string
 *                   description: User ID associated with the customer
 *                   example: 64b0d3e2c1234567890abcdef
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */


/**
 * @swagger
 * /v1/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *                   address:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */

/**
 * @swagger
 * /v1/customers/{id}:
 *   get:
 *     summary: Get a single customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the customer to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 email:
 *                   type: string
 *                 address:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Customer not found
 */

/**
 * @swagger
 * /v1/customers/{id}:
 *   put:
 *     summary: Update a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the customer to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Customer not found
 */

/**
 * @swagger
 * /v1/customers/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the customer to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       404:
 *         description: Customer not found
 */

/**
 * @swagger
 * /v1/customers:
 *   delete:
 *     summary: Delete all customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All customers deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - You do not have the required permissions
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operations related to products
 */

/**
 * @swagger
 * /v1/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               productDescription:
 *                 type: string
 *               category:
 *                 type: string
 *               subcategory:
 *                 type: string
 *               productType:
 *                 type: string
 *               brand:
 *                 type: string
 *               price:
 *                 type: number
 *               gst:
 *                 type: string
 *               costPrice:
 *                 type: number
 *               salePrice:
 *                 type: number
 *               sku:
 *                 type: string
 *               quantityInStock:
 *                 type: number
 *               video:
 *                 type: string
 *               sizeOptions:
 *                 type: array
 *               careInstructions:
 *                 type: string
 *               inventoryStatus:
 *                 type: string
 *                 enum:
 *                   - "In Stock"
 *                   - "Out of Stock"
 *                   - "Discontinued"
 *                   - "Coming Soon"
 *             required:
 *               - productName
 *               - category
 *               - subcategory
 *               - productType
 *               - brand
 *               - price
 *               - gst
 *               - costPrice
 *               - quantityInStock
 *               - sku
 *               - inventoryStatus
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productName:
 *                     type: string
 *                   productDescription:
 *                     type: string
 *                   category:
 *                     type: string
 *                   subcategory:
 *                     type: string
 *                   productType:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   price:
 *                     type: number
 *                   gst:
 *                     type: string
 *                   costPrice:
 *                     type: number
 *                   salePrice:
 *                     type: number
 *                   sku:
 *                     type: string
 *                   quantityInStock:
 *                     type: number
 *                   video:
 *                     type: string
 *                   sizeOptions:
 *                     type: array
 *                   careInstructions:
 *                     type: string
 *                   inventoryStatus:
 *                     type: string
 */

/**
 * @swagger
 * /v1/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productName:
 *                   type: string
 *                 productDescription:
 *                   type: string
 *                 category:
 *                   type: string
 *                 subcategory:
 *                   type: string
 *                 productType:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 price:
 *                   type: number
 *                 gst:
 *                   type: string
 *                 costPrice:
 *                   type: number
 *                 salePrice:
 *                   type: number
 *                 sku:
 *                   type: string
 *                 quantityInStock:
 *                   type: number
 *                 video:
 *                   type: string
 *                 sizeOptions:
 *                   type: array
 *                 careInstructions:
 *                   type: string
 *                 inventoryStatus:
 *                   type: string
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /v1/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               productDescription:
 *                 type: string
 *               category:
 *                 type: string
 *               subcategory:
 *                 type: string
 *               productType:
 *                 type: string
 *               brand:
 *                 type: string
 *               price:
 *                 type: number
 *               gst:
 *                 type: string
 *               costPrice:
 *                 type: number
 *               salePrice:
 *                 type: number
 *               sku:
 *                 type: string
 *               quantityInStock:
 *                 type: number
 *               video:
 *                 type: string
 *               sizeOptions:
 *                 type: array
 *               careInstructions:
 *                 type: string
 *               inventoryStatus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /v1/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to users (authentication)
 */

/**
 * @swagger
 * /v1/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /v1/users/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 contact:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /v1/users/{id}:
 *   put:
 *     summary: Update user details by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               contact:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /v1/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /v1/auth/ping:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Pings the backend to check if the user's token is valid
 *     description: Verifies if the JWT token provided is valid and not expired.
 *     security:
 *       - BearerAuth: []  # If you're sending the token via Authorization header
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: "Provide the token in the Authorization header as 'Bearer <token>'"
 *         required: false
 *         schema:
 *           type: string
 *           example: "token"
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid or expired token
 *       400:
 *         description: No token provided
 */
