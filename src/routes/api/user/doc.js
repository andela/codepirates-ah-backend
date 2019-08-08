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
 */
