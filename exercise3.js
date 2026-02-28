const user_grid_container = document.getElementById('userGrid')
const sort_by_GridList = document.getElementById('viewToggleBtn')
const id_input = document.getElementById("deleteIdInput");
const delete_btn = document.getElementById('deleteBtn')
const sort_by_Group = document.getElementById('sortByGroupBtn')
const sort_by_ID = document.getElementById('sortByIdBtn')

let users = [];

const users_api = "https://69a1e73c2e82ee536fa28c2f.mockapi.io/users_api";

function render(userArray) {
	if (!userArray || userArray.length === 0) {
		userGrid.textContent = "No users loaded.";
		return;
	}
	
	const html = userArray.map(user => `
	<article class="user-card">
		<h3>${user.first_name ?? ""}</h3>
		<p>first_name: ${user.first_name ?? ""}</p>
		<p>user_group: ${user.user_group ?? ""}</p>
		<p>id: ${user.id ?? ""}</p>
	</article>
	`).join("");

	userGrid.innerHTML = html;
}

async function retrieveData() {
  try {
    const response = await fetch(users_api);

    const data = await response.json();

    users = data;

    console.log(users);
	
	render(users);

  } catch (error) {
    console.error("Error retrieving data:", error);
    user_grid_container.textContent = "Failed to load users.";
  }
}

viewToggleBtn.addEventListener("click", () => {
	if (userGrid.classList.contains("grid-view")) {
		userGrid.classList.remove("grid-view");
		userGrid.classList.add("list-view");
	} else {
		userGrid.classList.remove("list-view");
		userGrid.classList.add("grid-view");
	}
});

sortByGroupBtn.addEventListener("click", () => {
	if (!Array.isArray(users) || users.length === 0) return;
	
	users.sort((a, b) => {
		return Number(a.user_group ?? 0) - Number(b.user_group ?? 0);
	});
	
	render(users);
});


sortByIdBtn.addEventListener("click", () => {
	if (!Array.isArray(users) || users.length === 0) return;

	users.sort((a, b) => Number(a.id) - Number(b.id));
	render(users);
});

deleteBtn.addEventListener("click", async () => {
	const id = deleteIdInput.value.trim();

	if (!id) {
		console.error("Invalid ID.");
		return;
	}

	try {
		const response = await fetch(`${users_api}/${id}`, {
			method: "DELETE"
		});

	if (!response.ok) {
		throw new Error("Delete request failed or user not found.");
	}

	users = users.filter(user => String(user.id) !== String(id));

	render(users);

	} catch (error) {
		console.error("Error deleting user:", error);
		}
});


retrieveData();


