const express = require('express');
const router = express.Router();
const agencyController = require('../../controller/agencyController/agencyController');
const resourceController = require('../../controller/resourceRequest/resourceRequestController');
const { authenticate, authorize } = require('../../middleware/authentication');
const { isAdmin, singleAdminCreation } = require('../../middleware/isAdmin');

// Agency routes
router.post('/agencies', authenticate, isAdmin, agencyController.createAgency); // Admin only
router.get('/agencies', authenticate, isAdmin, agencyController.getAllAgencies); // Admin only
router.get('/agencies/:id', authenticate, isAdmin, agencyController.getAgencyById); // Admin only
router.put('/agencies/:id', authenticate, isAdmin, agencyController.updateAgency); // Admin only
router.delete('/agencies/:id', authenticate, isAdmin, agencyController.deleteAgency); // Admin only

router.post('/agencies/:agencyId/resources', authenticate, authorize(['admin', 'agency']), agencyController.createOrUpdateResources); // Admin and agency
router.get('/agencies/resources', authenticate, isAdmin, agencyController.getAllAgenciesResources); // Admin only
router.get('/agencies/:agencyId/resources', authenticate, authorize(['admin', 'agency']), agencyController.getResources); // Admin and agency

// Resource request routes
router.post('/resource-requests', authenticate, authorize(['admin', 'agency', 'user']), resourceController.createRequest); // Admin, agency, and user
router.get('/resource-requests', authenticate, authorize(['admin', 'agency']), resourceController.getUserRequests); // Admin and agency
router.get('/resource-requests/pending', authenticate, authorize(['admin']), resourceController.getPendingRequests); // Admin only
router.post('/resource-requests/:requestId/assign', authenticate, authorize(['admin']), resourceController.assignRequest); // Admin only
router.post('/resource-requests/:requestId/respond', authenticate, authorize(['agency']), resourceController.respondToRequest); // Agency only

module.exports = router;
