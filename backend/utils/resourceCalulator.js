// utils/resourceCalculator.js

function getFireSeverity(fireSize) {
  if (fireSize < 0.1) return "Very Small";
  if (fireSize < 0.5) return "Small";
  if (fireSize < 2.0) return "Moderate";
  return "Large";
}

function getInitialResources(fireSeverity) {
  switch (fireSeverity) {
    case "Very Small":
      return {
        firefighters: 5,
        firetrucks: 1,
        helicopters: 0.5,
        commanders: 1
      };
    case "Small":
      return {
        firefighters: 20,
        firetrucks: 3,
        helicopters: 1,
        commanders: 2
      };
    case "Moderate":
      return {
        firefighters: 50,
        firetrucks: 6,
        helicopters: 2,
        commanders: 3
      };
    case "Large":
      return {
        firefighters: 100,
        firetrucks: 10,
        helicopters: 4,
        commanders: 5
      };
    default:
      return {
        firefighters: 10,
        firetrucks: 2,
        helicopters: 1,
        commanders: 1
      };
  }
}

function getLongTermResources(fireSeverity) {
  switch (fireSeverity) {
    case "Very Small":
      return {
        dailyFirefighters: 2,
        fireStationsNeeded: 0,
        heavyEquipment: []
      };
    case "Small":
      return {
        dailyFirefighters: 5,
        fireStationsNeeded: 1,
        heavyEquipment: ["Water Tankers"]
      };
    case "Moderate":
      return {
        dailyFirefighters: 15,
        fireStationsNeeded: 2,
        heavyEquipment: ["Water Tankers", "Bulldozers"]
      };
    case "Large":
      return {
        dailyFirefighters: 30,
        fireStationsNeeded: 3,
        heavyEquipment: ["Water Tankers", "Bulldozers", "Excavators"]
      };
    default:
      return {
        dailyFirefighters: 5,
        fireStationsNeeded: 1,
        heavyEquipment: []
      };
  }
}

function applySpecialAdjustments(windSpeed, humidity) {
  const adjustments = {
    backupFireStation: false,
    additionalFirefighters: 0,
    additionalHelicopters: 0
  };

  // Wind speed adjustments
  if (windSpeed > 30) {
    adjustments.additionalFirefighters = 0.5; // 50% more firefighters
    adjustments.additionalHelicopters = 0.5; // 50% more helicopters
    adjustments.backupFireStation = true;
  } else if (windSpeed > 20) {
    adjustments.additionalFirefighters = 0.3; // 30% more
    adjustments.additionalHelicopters = 0.3; // 30% more
  } else if (windSpeed > 10) {
    adjustments.additionalFirefighters = 0.1; // 10% more
  }

  // Humidity adjustments
  if (humidity < 30) {
    adjustments.additionalFirefighters += 0.2; // Additional 20% for dry conditions
    adjustments.backupFireStation = adjustments.backupFireStation || windSpeed > 15;
  } else if (humidity < 50) {
    adjustments.additionalFirefighters += 0.1; // Additional 10%
  }

  return adjustments;
}

function getPostFireInspection(fireSize) {
  if (fireSize < 0.1) return 1;
  if (fireSize < 0.5) return 2;
  if (fireSize < 2.0) return 4;
  return 6;
}

function calculateResources(temperature, windSpeed, humidity) {
  // Convert temperature to fire size (simplified for backend)
  // This is a placeholder - adjust based on your actual conversion logic
  const fireSize = Math.min(
    3.0,
    (temperature - 20) * 0.1 + (windSpeed * 0.05) + ((100 - humidity) * 0.01)
  );
  
  const fireSeverity = getFireSeverity(fireSize);
  const initialResources = getInitialResources(fireSeverity);
  const longTermResources = getLongTermResources(fireSeverity);
  const specialAdjustments = applySpecialAdjustments(windSpeed, humidity);
  const inspectorsNeeded = getPostFireInspection(fireSize);

  // Apply special adjustments to initial resources
  initialResources.firefighters += initialResources.firefighters * specialAdjustments.additionalFirefighters;
  initialResources.helicopters += initialResources.helicopters * specialAdjustments.additionalHelicopters;

  return {
    fireSeverity,
    initialResources,
    longTermResources,
    specialAdjustments,
    inspectorsNeeded
  };
}

module.exports = {
  calculateResources
};