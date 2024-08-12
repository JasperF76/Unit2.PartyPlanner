const baseURL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2407-FTB-ET-WEB-FT/events';

const state = {
    events: [],
};

const eventsList = document.querySelector("#events");
const addEvent = document.querySelector("#addEvent");
const addEventButton = document.querySelector("#eventButton");
addEvent.addEventListener("submit", addEvents);

async function render() {
    await getEvents();
    renderEvents();
}

async function getEvents() {
    try {
        const response = await fetch(baseURL);
        const json = await response.json();
        console.log(json.data);
        state.events = json.data;
    } catch (error) {
        console.error(error);
    }
}


async function addEvents(event) {
    event.preventDefault();
    try {
        const response = await fetch(baseURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: addEvent.name.value,
                description: addEvent.description.value,
                date: new Date(addEvent.date.value).toISOString(),
                location: addEvent.location.value,
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to add event");
        }
        render();
    } catch (error) {
        console.error(error);
    }
}

async function deleteEvent(id) {
    try {
        const response = await fetch(`${baseURL}/${id}`, {
            method: "DELETE",
        });
        console.log(response.status);

        if (!response.ok) {
            throw new Error("Recipe could not be deleted");
        }
        render();
    } catch (error) {
        console.error(error);
    }
}

function renderEvents() {
    if (!state.events.length) {
        eventsList.innerHTML =
            `<li>No events found.</li>`
        return;
    }
    const eventCards = state.events.map((event) => {
        const eventCard = document.createElement("li");
        eventCard.innerHTML =
            `<h3>${event.name}</h3>
        <p>${event.description}</p>
        <h3>${event.date}</h3>
        <h3>${event.location}</h3>`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Event";
        eventCard.append(deleteButton);

        deleteButton.addEventListener("click", () => deleteEvent(event.id));
        return eventCard;
    });
    eventsList.replaceChildren(...eventCards);
}
render();