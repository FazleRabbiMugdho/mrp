export const dummyUser = {
id: "4002",
firstName: "Fazle Rabbi",
lastName: "Mugdho",
username: "Mugdho_4002",
email: "mugdho@gmail.com",
phone: "+880 1780 803 694",
location: "Dhaka, Bangladesh",
role: "User",
};

export function updateUserLocally(prev, patch) {
  return { ...prev, ...patch };
}
