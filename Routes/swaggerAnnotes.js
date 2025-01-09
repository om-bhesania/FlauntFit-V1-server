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
 *             required:
 *               - name
 *               - phone
 *               - address
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Invalid input data
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
 *     responses:
 *       200:
 *         description: All customers deleted successfully
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
