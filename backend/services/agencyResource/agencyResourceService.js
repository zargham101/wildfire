const AgencyResources = require("../../model/agencyResource/index");
const User = require("../../model/user/index");

async function createOrUpdateAgencyResources(agencyId, data) {
  let agencyResources = await AgencyResources.findOne({ agencyId });
  
  if (!agencyResources) {
    // Set current resources to max resources initially
    data.currentResources = data.maxResources;
    agencyResources = new AgencyResources({ agencyId, ...data });
  } else {
    // Calculate the difference in max resources and adjust current accordingly
    const firefightersDiff = data.maxResources.firefighters - agencyResources.maxResources.firefighters;
    const firetrucksDiff = data.maxResources.firetrucks - agencyResources.maxResources.firetrucks;
    const helicoptersDiff = data.maxResources.helicopters - agencyResources.maxResources.helicopters;
    const commandersDiff = data.maxResources.commanders - agencyResources.maxResources.commanders;
    
    agencyResources.maxResources = data.maxResources;
    agencyResources.currentResources.firefighters += firefightersDiff;
    agencyResources.currentResources.firetrucks += firetrucksDiff;
    agencyResources.currentResources.helicopters += helicoptersDiff;
    agencyResources.currentResources.commanders += commandersDiff;
    
    if (data.heavyEquipment) {
      agencyResources.heavyEquipment = data.heavyEquipment;
    }
  }
  
  return await agencyResources.save();
}

async function getAgencyResources(agencyId) {
  return await AgencyResources.findOne({ agencyId }).populate("agencyId", "name email");
}
async function getAgencyDetails(agencyId) {
  return await AgencyResources.findOne({ agencyId }).populate("agencyId", "name email");
}

async function getAllAgenciesWithResources() {
  return await AgencyResources.find().populate("agencyId", "name email role");
}

async function createAgency(agencyData) {
  const newAgency = new User(agencyData);
  return await newAgency.save();
}

async function getAllAgencies() {
  return await User.find({ role: 'agency' }).select('-password');
}

async function getAgencyById(id) {
  return await User.findById(id).select('-password');
}

async function updateAgency(id, updateData) {
  // Prevent role change through this endpoint
  if (updateData.role) {
    delete updateData.role;
  }
  
  return await User.findByIdAndUpdate(id, updateData, { 
    new: true,
    runValidators: true
  }).select('-password');
}

async function deleteAgency(id) {
  const agency = await User.findById(id);
  if (!agency || agency.role !== 'agency') throw new Error('Agency not found');

  // Delete the agency's resource data
  await AgencyResources.findOneAndDelete({ agencyId: id });
  await User.findByIdAndDelete(id);

}

async function deductResources(agencyId, resourcesRequested) {
  const agency = await AgencyResources.findOne({ agencyId });
  if (!agency) throw new Error("Agency not found");

  const remainingResources = {
    firefighters: agency.currentResources.firefighters - resourcesRequested.firefighters,
    firetrucks: agency.currentResources.firetrucks - resourcesRequested.firetrucks,
    helicopters: agency.currentResources.helicopters - resourcesRequested.helicopters,
    commanders: agency.currentResources.commanders - resourcesRequested.commanders,
  };

  if (
    remainingResources.firefighters < 0 ||
    remainingResources.firetrucks < 0 ||
    remainingResources.helicopters < 0 ||
    remainingResources.commanders < 0
  ) {
    agency.locked = true; 
    agency.lockReason = "Insufficient resources for the requested allocation.";

    await agency.save();

    throw new Error("Not enough resources available to fulfill the request. Agency locked.");
  }

  agency.currentResources.firefighters -= resourcesRequested.firefighters;
  agency.currentResources.firetrucks -= resourcesRequested.firetrucks;
  agency.currentResources.helicopters -= resourcesRequested.helicopters;
  agency.currentResources.commanders -= resourcesRequested.commanders;

  agency.resourceHistory.push({
    resourcesUsed: resourcesRequested,
    dateUsed: new Date(),
    action: "deduct",
  });

  await agency.save();

  await agency.save();

  return agency;
}


async function populateAgencyResourcesForAllAgencies() {
  const agencies = await User.find({ role: "agency" });

  const results = [];

  for (const agency of agencies) {
    let existing = await AgencyResources.findOne({ agencyId: agency._id });

    if (!existing) {
      const defaultResources = {
        agencyId: agency._id,
        maxResources: {
          firefighters: 50,
          firetrucks: 10,
          helicopters: 5,
          commanders: 8,
        },
        currentResources: {
          firefighters: 50,
          firetrucks: 10,
          helicopters: 5,
          commanders: 8,
        },
        heavyEquipment: ["bulldozer", "crane"],
        locked:false,
        lockReason:"null"
      };

      const created = await AgencyResources.create(defaultResources);
      results.push({
        agencyId: agency._id,
        name: agency.name,
        email: agency.email,
        status: "created",
        resourceId: created._id,
      });
    } else {
      results.push({
        agencyId: agency._id,
        name: agency.name,
        email: agency.email,
        status: "already exists",
        resourceId: existing._id,
      });
    }
  }

  return results;
}


module.exports = {
  createOrUpdateAgencyResources,
  getAgencyResources,
  getAllAgenciesWithResources,
  createAgency,
  deleteAgency,
  updateAgency,
  getAgencyById,
  getAllAgencies,
  getAgencyDetails,
  deductResources,
  populateAgencyResourcesForAllAgencies
};