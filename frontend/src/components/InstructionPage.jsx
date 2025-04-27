import { useParams, Link } from "react-router-dom";

export default function InstructionPage() {
  const { type } = useParams();

  const instructions = {
    protection: {
      title: "Protection Instructions",
      description: `
Installing smoke alarms is crucial for fire protection. You should place smoke alarms inside every bedroom, outside each sleeping area, and on every level of your home, including the basement. 

$**Monthly Testing:**  
Test your smoke alarms monthly by pressing the test button to ensure they're working properly. 

**Battery Replacement:**  
Change the batteries at least once a year, or whenever the alarm chirps signaling low battery.  

**Installation Tips:**  
- Mount smoke alarms high on walls or ceilings.  
- Keep alarms away from windows, doors, or ducts where drafts might interfere with their operation.  
- Use interconnected smoke alarms so that when one sounds, they all sound.  

**Maintenance:**  
- Dust or vacuum alarms regularly to keep them clean.  
- Replace smoke alarms every 10 years or as recommended by the manufacturer.  

Proper smoke alarm maintenance and placement could be the difference between life and death in the event of a fire.
`
    },
    preparedness: {
      title: "Preparedness Instructions",
      description: `
Being prepared can save your life during a fire emergency.

**Fire Escape Planning:**  
- Create a detailed fire escape plan with your family.  
- Draw a map of your home showing all doors and windows.  
- Find two ways out of every room in case one exit is blocked.  

**Practicing the Plan:**  
- Practice your fire drill at least twice a year — once during the day and once at night.  
- Make sure everyone can escape in under two minutes.  

**Meeting Place:**  
- Establish a meeting point outside (e.g., a tree, light pole, or mailbox) a safe distance from your home.  
- Ensure every family member knows to meet there after exiting.  

**Special Considerations:**  
- Assign someone to assist infants, older adults, or people with mobility limitations.  
- Teach children not to hide under beds or in closets during a fire.  

Preparation today could prevent tragedy tomorrow.
`
    },
    prevention: {
      title: "Prevention Instructions",
      description: `
Fire prevention starts with smart daily habits.

**Kitchen Safety:**  
- Never leave cooking unattended.  
- Keep flammable objects like dish towels and paper towels away from the stove.  
- Turn pot handles inward so they aren't knocked off the stove.  

**Electrical Safety:**  
- Do not overload electrical outlets.  
- Replace frayed wires immediately.  
- Avoid running cords under carpets or across doorways.

**Candle Safety:**  
- Blow out candles before leaving a room or going to bed.  
- Use candle holders that won't tip over easily.  
- Keep candles at least 12 inches away from anything that burns.  

**Heating Safety:**  
- Keep anything that can burn at least three feet away from heating equipment.  
- Turn off portable heaters when leaving the room or going to sleep.  

Prevention is your first line of defense — stay vigilant at all times.
`
    },
    emergency: {
      title: "Emergency Instructions",
      description: `
When a fire occurs, seconds matter.

**Immediate Actions:**  
- GET OUT, STAY OUT, and CALL for help.  
- Never go back inside for anything or anyone once you are out.  

**Evacuation Tips:**  
- Crawl low under smoke — smoke rises during a fire.  
- Feel door handles before opening. If hot, do not open the door.  
- Close doors behind you as you leave to slow the spread of fire.

**If You Are Trapped:**  
- Close doors between you and the fire.  
- Seal cracks and vents with cloth to keep smoke out.  
- Call the fire department and give them your exact location.  

**After Escaping:**  
- Call 911 or your local emergency number immediately.  
- If clothes catch fire: STOP, DROP, and ROLL.  
- Once outside, stay outside.  

Your safety is the top priority during an emergency — material things can be replaced, lives cannot.
`
    }
  };

  const content = instructions[type];

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Instruction not found!</h1>
        <Link to="/" className="text-blue-600 underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const parseDescription = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g); // Split by **text**
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const cleanText = part.slice(2, -2); // Remove **
        return (
          <strong key={index} className="text-red-600 font-bold">
            {cleanText}
          </strong>
        );
      } else {
        return part;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-6xl font-bold text-white bg-red-600 mt-10 p-10 font-serif">{content.title}</h1>

        <div className="text-xl text-gray-700 leading-8 whitespace-pre-line">
          {parseDescription(content.description)}
        </div>

        <div className="mt-12">
          <Link
            to="/"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors duration-300 text-lg"
          >
            ← Back to Precautions
          </Link>
        </div>
      </div>
    </div>
  
  );
}
