const ResourceRequest = require("../../model/resourceRequest/index");
const AgencyResources = require("../../model/agencyResource/index");
const { deductResources } = require("../../services/agencyResource/agencyResourceService");

async function createRequest(predictionId, userId, resources, location, message, assignedAgency) {
  const request = new ResourceRequest({
    predictionId,
    userId,
    requiredResources: resources,
    location,
    userMessage: message,
    assignedAgency,  // New field for agency assignment
  });
  return await request.save();
}

// Get all requests by user
async function getRequestsByUser(userId) {
  return await ResourceRequest.find({ userId })
    .populate("predictionId")
    .populate("assignedAgency", "name email");
}

// Get all pending requests
async function getPendingRequests() {
  return await ResourceRequest.find({ status: "pending" })
    .populate("userId", "name email")
    .populate("predictionId");
}

// Assign a request to an agency
async function assignRequest(requestId, agencyId, message) {
  // Find and update the request status to "assigned"
  const request = await ResourceRequest.findByIdAndUpdate(
    requestId,
    {
      status: "assigned",
      assignedAgency: agencyId,
      adminMessage: message,
    },
    { new: true }
  ).populate("assignedAgency", "name email");

  return request;
}

// Respond to a resource request (accept or reject)
async function respondToRequest(requestId, agencyId, response) {
  const { status, message } = response;

  const request = await ResourceRequest.findById(requestId);
  if (!request) throw new Error("Request not found");

  if (status === "accepted") {
    // Use the service to deduct resources from the agency
    const agency = await deductResources(agencyId, request.requiredResources);

    // Update the request status to "completed" after resources are deducted
    request.status = "completed";
  } else {
    // If the agency rejects the request, the status should be "rejected"
    request.status = "rejected";
  }

  // Save the updated request and add the agency's message
  request.agencyMessage = message;
  await request.save();

  return request;
}

// Get all requests assigned to an agency
async function getAgencyRequests(agencyId) {
  return await ResourceRequest.find({ assignedAgency: agencyId })
    .populate("userId", "name email")
    .populate("predictionId");
}

module.exports = {
  createRequest,
  getRequestsByUser,
  getPendingRequests,
  assignRequest,
  respondToRequest,
  getAgencyRequests,
};
