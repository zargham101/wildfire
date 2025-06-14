const agencyResourcesService = require("../../services/agencyResource/agencyResourceService");

async function createOrUpdateResources(req, res) {
  try {
    const agencyId = req.params.agencyId || req.user._id;
    const resources = await agencyResourcesService.createOrUpdateAgencyResources(agencyId, req.body);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getResources(req, res) {
  try {
    const agencyId = req.params.agencyId === 'me' ? req.user._id : req.params.agencyId;
    const resources = await agencyResourcesService.getAgencyResources(agencyId);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAllAgenciesResources(req, res) {
  try {
    const agencies = await agencyResourcesService.getAllAgenciesWithResources();
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createAgency(req, res) {
  try {
    const agencyData = { ...req.body, role: 'agency' };
    const newAgency = await agencyService.createAgency(agencyData);
    res.status(201).json(newAgency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAllAgencies(req, res) {
  try {
    const agencies = await agencyService.getAllAgencies();
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAgencyById(req, res) {
  try {
    const agency = await agencyService.getAgencyById(req.params.id);
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }
    res.json(agency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateAgency(req, res) {
  try {
    const updatedAgency = await agencyService.updateAgency(req.params.id, req.body);
    if (!updatedAgency) {
      return res.status(404).json({ message: 'Agency not found' });
    }
    res.json(updatedAgency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteAgency(req, res) {
  try {
    const deletedAgency = await agencyService.deleteAgency(req.params.id);
    if (!deletedAgency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    // Deleting resources associated with the agency
    await agencyResourcesService.deleteAgencyResources(req.params.id);

    res.json({ message: 'Agency deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function populateAllAgencyResources(req, res) {
  try {
    const results = await agencyResourcesService.populateAgencyResourcesForAllAgencies();
    res.json({ success: true, message: "Resource initialization completed", results });
  } catch (error) {
    console.error("Populate error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getMyResources(req, res) {
  try {
    console.log("ID::",req.user._id);
    const agencyId = req.user._id;
    
    const resources = await agencyResourcesService.getAgencyDetails(agencyId);

    if (!resources) {
      return res.status(404).json({ message: 'No resources found for this agency' });
    }

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createOrUpdateResources,
  populateAllAgencyResources,
  getResources,
  getAllAgenciesResources,
  createAgency,
  deleteAgency,
  updateAgency,
  getAgencyById,
  getAllAgencies,
  getMyResources
};
