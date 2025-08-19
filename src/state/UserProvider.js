import React, { createContext, useState, useContext } from "react";
import { message } from "antd";


const dummyUser = {
id: "4002",
firstName: "Fazle Rabbi",
lastName: "Mugdho",
username: "Mugdho_4002",
email: "mugdho@gmail.com",
phone: "+880 1780 803 694",
location: "Dhaka, Bangladesh",
role: "User",
};


const UserContext = createContext();


export function UserProvider({ children }) {
const [user, setUser] = useState(dummyUser);


function updateUser(patch) {
setUser((prev) => ({ ...prev, ...patch }));
message.success("Profile updated (dummy)");
}


function changePassword({ oldPassword, newPassword }) {
message.success("Password updated (dummy)");
return true;
}


return (
<UserContext.Provider value={{ user, updateUser, changePassword }}>
{children}
</UserContext.Provider>
);
}


export function useUser() {
return useContext(UserContext);
}