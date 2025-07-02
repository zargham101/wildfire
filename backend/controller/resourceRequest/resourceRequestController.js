const resourceRequestService = require("../../services/resourceRequest/resourceRequestService");
const AllFeaturePredicionSchema = require("../../model/allFeaturePrediction/index");

async function createRequest(req, res) {
  try {
    const { predictionId, message, assignedAgency,latitude, longitude, requiredResources} = req.body;
    const userId = req.user._id;

    const prediction = await AllFeaturePredicionSchema.findById(predictionId);
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }
    const { firefighters, firetrucks, helicopters, commanders, heavyEquipment } = requiredResources;

    // Create request with assignedAgency
    const request = await resourceRequestService.createRequest(
      predictionId,
      userId,
      {
        firefighters,
        firetrucks,
        helicopters,
        commanders,
        heavyEquipment
      },
      {
        latitude,
        longitude
      },
      message,
      assignedAgency 
    );

    res.status(201).json(request);
  } catch (error) {
    console.error("Error creating resource request:", error.message);
    res.status(500).json({ message: error.message });
  }
}

async function getUserRequests(req, res) {
  try {
    const requests = await resourceRequestService.getRequestsByUser();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getPendingRequests(req, res) {
  try {
    const requests = await resourceRequestService.getPendingRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function assignRequest(req, res) {
  try {
    const { requestId, agencyId, message } = req.body;
    const request = await resourceRequestService.assignRequest(
      requestId,
      agencyId,
      message
    );
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAgencyRequests(req, res) {
  try {
    const requests = await resourceRequestService.getAgencyRequests(
      req.user._id
    );
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function respondToRequest(req, res) {
  try {
    const { requestId, status, message } = req.body;
    const response = await resourceRequestService.respondToRequest(
      requestId,
      req.user._id,
      { status, message }
    );
    res.status(200).json(response);
  } catch (error) {
    const isResourceError =
      error.message?.toLowerCase().includes("not enough resources") ||
      error.message?.toLowerCase().includes("agency locked");

    res
      .status(isResourceError ? 400 : 500)
      .json({ message: error.message || "Internal server error" });
  }
}

module.exports = {
  createRequest,
  getUserRequests,
  getPendingRequests,
  assignRequest,
  getAgencyRequests,
  respondToRequest,
};
