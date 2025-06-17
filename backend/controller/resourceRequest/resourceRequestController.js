const resourceRequestService = require("../../services/resourceRequest/resourceRequestService");
const { calculateResources } = require("../../utils/resourceCalulator");
const AllFeaturePredicionSchema = require("../../model/allFeaturePrediction/index");

async function createRequest(req, res) {
  try {
    const { predictionId, message, assignedAgency } = req.body; // Get assignedAgency from the body

    const userId = req.user._id;

    const prediction = await AllFeaturePredicionSchema.findById(predictionId);
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }

    const resources = calculateResources(
      prediction.input.temperature,
      prediction.input.wind_speed,
      prediction.input.relative_humidity
    );

    // Create request with assignedAgency
    const request = await resourceRequestService.createRequest(
      predictionId,
      userId,
      {
        firefighters: resources.initialResources.firefighters,
        firetrucks: resources.initialResources.firetrucks,
        helicopters: resources.initialResources.helicopters,
        commanders: resources.initialResources.commanders,
        heavyEquipment: resources.longTermResources.heavyEquipment,
      },
      {
        latitude: prediction.input.fire_location_latitude,
        longitude: prediction.input.fire_location_longitude,
      },
      message,
      assignedAgency // Pass the assignedAgency field here
    );

    res.status(201).json(request);
  } catch (error) {
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
