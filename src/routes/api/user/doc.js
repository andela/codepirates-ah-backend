/**
 * @swagger
 *
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - firstname
 *       - lastname
 *       - email
 *       - username
 *       - password
 *     properties:
 *       firstname:
 *         type: string
 *       lastname:
 *         type: string
 *       email:
 *         type: string
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 */

/**
 * @swagger
 *
 * /users/signin:
 *   post:
 *     description: Creates a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: User successfully created
 *         schema:
 *           $ref: '#/definitions/User'
 * /users/signup:
 *   post:
 *     description: Creates a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: create an account.
 *         schema:
 *          type: object
 *          required:
 *            - username
 *            - firstname
 *            - lastname
 *            - email
 *            - password
 *         properties:
 *           username:
 *              type: string
 *           firstname:
 *             type: string
 *           lastname:
 *              type: string
 *           email:
 *              type: string
 *           password:
 *              type: string
 *     responses:
 *       201:
 *         description: Your account has been successfully created.
 *         schema:
 *           $ref: '#/definitions/User'
 * /users/signout:
 *   post:
 *     description: Logs out a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         schema:
 *           type: string
 *         required:
 *           - authorization
 *     responses:
 *       200:
 *         description: User logged out successfully
 * /users/reset:
 *   post:
 *     description: request for a password reset
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: reset password
 *         description: password reset
 *         schema:
 *          type: object
 *          required:
 *            - email
 *         properties:
 *           email:
 *              type: string
 *     responses:
 *       200:
 *         description: Check your email address to reset your password
 *       400:
 *         description: Validation error
 * /users/reset/:token:
 *   post:
 *     description: handle password reset logic
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: request for password reset
 *         schema:
 *          type: object
 *          required:
 *            - password
 *            - confirmPassword
 *         properties:
 *           password:
 *              type: string
 *           confirmPassword:
 *              type: string
 *     responses:
 *       200:
 *         description: Successfully reset your password
 *       400:
 *         description: Validation error
 * /users/profiles/{userId}/follow:
 *   post:
 *     description: follow user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *         description: You are now following
 *       400:
 *         description: userId must be a non negative integer
 * /users/profiles/following:
 *   get:
 *     description: get all users that i follow
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: You currently do not follow anyone
 * /users/profiles/followers:
 *   get:
 *     description: get all users that i follow
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: You currently do not have any followers
 */
