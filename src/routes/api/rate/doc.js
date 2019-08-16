/**
 * @swagger
 *
 * /rate/{articleSlug}:
 *   get:
 *     summary: Gets a rating
 *     description: >
 *       Get a rating about a specific article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: articleSlug
 *         in: path
 *         description: Slug for article being rated
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#definitions/Rate'
 *   patch:
 *     summary: updates a rating
 *     description: >
 *       updates a rating about a specific article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: articleSlug
 *         in: path
 *         description: Slug for article being rated
 *         type: string
 *         required: true
 *       - name: rate
 *         in: body
 *         description: article rating
 *         schema:
 *           type: object
 *           required:
 *             - rate
 *           properties:
 *             rate:
 *               type: string
 *     responses:
 *       200:
 *         description: Rate successfully create
 *         schema:
 *           $ref: '#definitions/Rate'
 *       400:
 *         description: input Validation error
 *   post:
 *     summary: creates a rating
 *     description: >
 *       creates a rating about a specific article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: articleSlug
 *         in: path
 *         description: Slug for article being rated
 *         type: string
 *         required: true
 *       - name: rate
 *         in: body
 *         description: article rating
 *         schema:
 *           type: object
 *           required:
 *             - rate
 *           properties:
 *             rate:
 *               type: string
 *     responses:
 *       200:
 *         description: Rate successfully create
 *         schema:
 *           $ref: '#definitions/Rate'
 *       400:
 *         description: input Validation error
 * definitions:
 *   Rate:
 *     type: object
 *     properties:
 *       rate:
 *         type: string
 *     required:
 *       - rate
 */
