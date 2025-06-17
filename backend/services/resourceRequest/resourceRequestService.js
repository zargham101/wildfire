const ResourceRequest = require("../../model/resourceRequest/index");
const AgencyResources = require("../../model/agencyResource/index");
const {
  deductResources,
} = require("../../services/agencyResource/agencyResourceService");

async function createRequest(
  predictionId,
  userId,
  resources,
  location,
  message,
  assignedAgency
) {
  const request = new ResourceRequest({
    predictionId,
    userId,
    requiredResources: resources,
    location,
    userMessage: message,
    assignedAgency,
  });
  return await request.save();
}

async function getRequestsByUser() {
  const request = await ResourceRequest.find()
    .populate("predictionId")
    .populate("assignedAgency", "name email")
    .populate("userId", "name email");

  return request;
}

// Get all pending requests
async function getPendingRequests() {
  return await ResourceRequest.find({ status: "pending" })
    .populate("userId", "name email")
    .populate("predictionId");
}

async function assignRequest(requestId, agencyId, message) {
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

async function respondToRequest(requestId, agencyId, response) {
  const { status, message } = response;

  const request = await ResourceRequest.findById(requestId);
  if (!request) throw new Error("Request not found");

  if (status === "accepted") {
    try {
      await deductResources(agencyId, request.requiredResources);
      request.status = "completed";
      request.agencyMessage = message;
      await request.save();
      return request;
    } catch (err) {
      if (err.message.includes("Not enough resources")) {
        const updatedRequest = await ResourceRequest.findByIdAndUpdate(
          requestId,
          {
            status: "rejected",
            rejectionReason: "Not enough resources in agency.",
            agencyMessage: message,
          },
          { new: true }
        );

        await AgencyResources.findOneAndUpdate(
          { agencyId },
          {
            locked: true,
            lockReason: "Insufficient resources",
          }
        );

        return updatedRequest;
      }
      throw err;
    }
  } else {
    request.status = "rejected";
    request.agencyMessage = message;
    await request.save();
    return request;
  }
}


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
