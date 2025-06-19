
export function getFireSeverity(fireSize) {
  if (fireSize < 1) {
    return "Small";
  } else {
    return "Large";
  }
}

function getInitialResources(severity) {
  if (severity === "Small") {
    return {
      firefighters: 10,
      firetrucks: 2,
      helicopters: 0,
      commanders: 1,
    };
  } else {
    return {
      firefighters: 50,
      firetrucks: 10,
      helicopters: 2,
      commanders: 3,
    };
  }
}

function getLongTermResources(severity) {
  if (severity === "Small") {
    return {
      dailyFirefighters: 5,
      fireStationsNeeded: 1,
      heavyEquipment: ["Bulldozer"],
    };
  } else {
    return {
      dailyFirefighters: 20,
      fireStationsNeeded: 3,
      heavyEquipment: ["Bulldozer", "Excavator", "Water Tender"],
    };
  }
}

function applySpecialAdjustments(windSpeed, humidity) {
  
  const adjustments = {
    additionalFirefighters: 0,
    additionalHelicopters: 0,
    backupFireStation: false,
  };

  if (windSpeed > 10 || humidity < 30) { // Example static conditions
      adjustments.additionalFirefighters = 0.1; // 10% more
  }
  if (windSpeed > 15 && humidity < 20) {
      adjustments.backupFireStation = true;
  }
  return adjustments;
}

function getPostFireInspection(fireSize) {
  if (fireSize < 1) {
    return 1; // Small fire, 1 inspector
  } else {
    return 3;
  }
}

export function calculateResources(fireSize) { 
  const fireSeverity = getFireSeverity(fireSize);
  const initialResources = getInitialResources(fireSeverity);
  const longTermResources = getLongTermResources(fireSeverity);

  const specialAdjustments = { 
      additionalFirefighters: 0,
      additionalHelicopters: 0,
      backupFireStation: false,
  };

  const inspectorsNeeded = getPostFireInspection(fireSize);
  initialResources.firefighters = Math.ceil(initialResources.firefighters * (1 + specialAdjustments.additionalFirefighters));
  initialResources.helicopters = Math.ceil(initialResources.helicopters * (1 + specialAdjustments.additionalHelicopters));

  return {
    fireSeverity,
    initialResources,
    longTermResources,
    specialAdjustments,
    inspectorsNeeded
  };
}