import React from "react";

const Avatar = ({ 
  user, 
  className = "w-10 h-10", 
  variant = "default", // "default" for navbar, "profile" for user profile
  rounded = "rounded-full",
  border = "border-2 border-gray-200"
}) => {
  if (!user) return null;

  const { image, name = "" } = user;

  const getInitials = (name) => {
    if (!name) return "?";
    const nameParts = name.trim().split(" ");
    const initials = nameParts.map((part) => part[0]).join("");
    return initials.toUpperCase();
  };

  // Determine text size based on container size
  const getTextSize = (className) => {
    if (className.includes("w-32") || className.includes("h-32") || className.includes("w-full")) return "text-4xl";
    if (className.includes("w-24") || className.includes("h-24")) return "text-2xl";
    if (className.includes("w-16") || className.includes("h-16")) return "text-xl";
    if (className.includes("w-12") || className.includes("h-12")) return "text-lg";
    return "text-sm";
  };

  const textSize = getTextSize(className);

  // Different styling for profile variant
  const profileStyling = variant === "profile" ? {
    rounded: "rounded-2xl",
    border: "border-0", // Remove border since container has it
    shadow: "shadow-none" // Remove shadow since container has it
  } : {
    rounded: rounded,
    border: border,
    shadow: "shadow-sm"
  };

  return (
    <div className={variant === "profile" ? "w-full h-full" : "relative"}>
      {image ? (
        <img
          src={image}
          alt="User Avatar"
          className={`${className} ${profileStyling.rounded} object-cover ${profileStyling.border} ${profileStyling.shadow}`}
        />
      ) : (
        <div className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-500 ${profileStyling.rounded} ${profileStyling.border} ${profileStyling.shadow}`}>
          <span className={`text-white font-bold ${textSize}`}>
            {getInitials(name)}
          </span>
        </div>
      )}
    </div>
  );
};

export default Avatar;