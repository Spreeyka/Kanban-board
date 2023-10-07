import Images from "../../assets/images";
import "./UserProfile.scss";

export const UserProfile = () => {
  const user = {
    name: "John Doe",
    image: Images.User,
  };

  return (
    <div className="user-profile">
      <img src={user.image} alt={user.name} />
      <span>{user.name}</span>
    </div>
  );
};
