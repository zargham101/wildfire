const express = require('express');
const router = express.Router();
const agencyController = require('../../controller/agencyController/agencyController');
const resourceController = require('../../controller/resourceRequest/resourceRequestController');
const { authenticate, authorize } = require('../../middleware/authentication');
const { isAdmin, singleAdminCreation } = require('../../middleware/isAdmin');

// Agency routes
router.post('/agencies', authenticate, isAdmin, agencyController.createAgency); 
router.get('/agencies', authenticate, isAdmin, agencyController.getAllAgencies); 
router.get('/agencies/:id', authenticate, isAdmin, agencyController.getAgencyById); 
router.put('/agencies/:id', authenticate, isAdmin, agencyController.updateAgency);
router.delete('/agencies/:id', authenticate, isAdmin, agencyController.deleteAgency); 

router.post('/agencies/:agencyId/resources', authenticate, authorize(['admin', 'agency']), agencyController.createOrUpdateResources); 
router.get('/agencies/resources', authenticate, isAdmin, agencyController.getAllAgenciesResources); 
router.get('/agencies/:agencyId/resources', authenticate, authorize(['admin', 'agency']), agencyController.getResources); 

// Resource request routes
router.post('/resource-requests', authenticate, authorize(['admin', 'agency', 'user']), resourceController.createRequest); 
router.get('/resource-requests', authenticate, authorize(['admin', 'agency']), resourceController.getUserRequests); 
router.get('/resource-requests/pending', authenticate, authorize(['admin']), resourceController.getPendingRequests);
router.post('/resource-requests/:requestId/assign', authenticate, authorize(['admin']), resourceController.assignRequest);
router.post('/resource-requests/:requestId/respond', authenticate, authorize(['agency']), resourceController.respondToRequest); 
//Populate agency resources
router.post("/agencies/populate-resources", agencyController.populateAllAgencyResources);
router.get(
  '/agencies/me/resources',
  authenticate,
  authorize(['agency']),
  agencyController.getMyResources
);
module.exports = router;