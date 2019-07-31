/**
 * @swagger
 *
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       lastname:
 *         type: string
 *       firstname:
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
 */
