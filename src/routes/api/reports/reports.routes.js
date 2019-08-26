import express from 'express';
import auth from '../../../middlewares/auth';
import reportMiddleware from '../../../middlewares/report.middleware';
import admin from '../../../middlewares/admin';
import reportController from '../../../controllers/report.comtroller';
import reportValidator from '../../../middlewares/validators/report.validator';

import confirmEmailAuth from '../../../middlewares/emailVarification.middleware';


const router = express.Router();


// routes for reporting artiles
router.post('/:Article', [auth, confirmEmailAuth, reportValidator, reportMiddleware], reportController.reportArticle);
router.delete('/:reportId', [auth, confirmEmailAuth], reportController.deleteReport);
router.get('/', [auth, confirmEmailAuth], reportController.getMyReport);
router.get('/all', [auth, confirmEmailAuth, admin], reportController.getAllReport);
router.get('/:Article', [auth, confirmEmailAuth, admin], reportController.getReportsForArticle);


export default router;
