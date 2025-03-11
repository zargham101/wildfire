const Avatar = ({ user }) => {
    const { image, name } = user;
  
    const getInitials = (name) => {
      const nameParts = name.split(" ");
      const initials = nameParts.map((part) => part[0]).join("");
      return initials.toUpperCase();
    };
  
    return (
      <div className="relative">
        {image ? (
          <img
            src={image}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full">
            <span className="text-white font-bold">{getInitials(name)}</span>
          </div>
        )}
      </div>
    );
  };
  
  export default Avatar;
  