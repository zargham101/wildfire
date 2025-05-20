export function getFireSeverity(fireSize, temp = 0, wind = 0, humidity = 100) {
  if (temp > 42 && wind > 70 && humidity < 15) {
    return "Very Large";
  } else if (fireSize < 1) {
    return "Small";
  } else if (fireSize < 2) {
    return "Moderate";
  } else if (fireSize < 5) {
    return "Large";
  } else {
    return "Very Large";
  }
}
  
  export function getInitialResources(fireSeverity) {
    let resources = {
      firefighters: 0,
      firetrucks: 0,
      helicopters: 0,
      commanders: 0
    };
  
    if (fireSeverity === 'Very Small') {
      resources.firefighters = 3;
      resources.firetrucks = 1;
    } else if (fireSeverity === 'Small') {
      resources.firefighters = 5;
      resources.firetrucks = 1;
      resources.commanders = 1;
    } else if (fireSeverity === 'Moderate') {
      resources.firefighters = 10;
      resources.firetrucks = 3;
      resources.helicopters = 1;
      resources.commanders = 2;
    } else if (fireSeverity === 'Large') {
      resources.firefighters = 20;
      resources.firetrucks = 5;
      resources.helicopters = 2;
      resources.commanders = 3;
    } else if (fireSeverity === 'Very Large') {
      resources.firefighters = 50;
      resources.firetrucks = 10;
      resources.helicopters = 5;
      resources.commanders = 5;
    }
  
    return resources;
  }
  
  export function getLongTermResources(fireSeverity) {
    let longTermResources = {
      dailyFirefighters: 0,
      fireStationsNeeded: 0,
      heavyEquipment: []
    };
  
    if (fireSeverity === 'Moderate') {
      longTermResources.dailyFirefighters = 10;
      longTermResources.heavyEquipment = ['Bulldozer'];
    } else if (fireSeverity === 'Large') {
      longTermResources.dailyFirefighters = 20;
      longTermResources.fireStationsNeeded = 1;
      longTermResources.heavyEquipment = ['Bulldozer', 'Air Tanker'];
    } else if (fireSeverity === 'Very Large') {
      longTermResources.dailyFirefighters = 50;
      longTermResources.fireStationsNeeded = 2;
      longTermResources.heavyEquipment = ['Air Tanker', 'Helicopters', 'Bulldozers'];
    }
  
    return longTermResources;
  }
  
  export function applySpecialAdjustments(windSpeed, humidity) {
    let adjustments = {
      additionalFirefighters: 0,
      additionalHelicopters: 0,
      backupFireStation: false
    };
  
    if (windSpeed > 30) {
      adjustments.additionalFirefighters += 0.2;
      adjustments.additionalHelicopters += 0.2;
    }
    if (humidity < 20) {
      adjustments.additionalHelicopters *= 2;
    }
  
    return adjustments;
  }
  
  export function getPostFireInspection(fireSize) {
    if (fireSize > 100) return 3;
    if (fireSize > 10) return 1;
    return 0;
  }
  
  export function calculateResources(fireSize, windSpeed, humidity) {
    const fireSeverity = getFireSeverity(fireSize);
    const initialResources = getInitialResources(fireSeverity);
    const longTermResources = getLongTermResources(fireSeverity);
    const specialAdjustments = applySpecialAdjustments(windSpeed, humidity);
    const inspectorsNeeded = getPostFireInspection(fireSize);
  
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

  export const inputValidationRules = {
    fire_location_latitude: {
      min: 40,
      max: 60,
      tooltip: "Enter latitude between 40° and 60°",
    },
    fire_location_longitude: {
      min: -119,
      max: -110,
      tooltip: "Enter longitude between -119° and -110°",
    },
    temperature: {
      min: -33,
      max: 36,
      tooltip: "Temperature should be between -33°C and 36°C",
    },
    relative_humidity: {
      min: 0,
      max: 100,
      tooltip: "Enter a value between 0% and 100%",
    },
    wind_speed: {
      min: 0,
      max: 80,
      tooltip: "Enter wind speed between 0 and 80 km/h",
    },
  };
  
  