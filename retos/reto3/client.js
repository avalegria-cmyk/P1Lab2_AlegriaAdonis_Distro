export function renderUsers(usersListEl, usersCountEl, users) {
  usersListEl.innerHTML = "";
  for (const user of users) {
    const li = document.createElement("li");
    li.textContent = user.username;
    usersListEl.appendChild(li);
  }
  usersCountEl.textContent = `Usuarios: ${users.length}`;
}
