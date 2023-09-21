const API_URL = "https://workspace-methed.vercel.app/";
const LOCATION_URL = "api/locations";
const VACANCY_URL = "api/vacancy";

const cardsList = document.querySelector(".cards__list");

const getData = async (url, cbSuccess, cbError) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        cbSuccess(data);
    } catch (err) {
        cbError(err);
    }
};

const createCard = vacancy => `
    <article class="vacancy" tabindex="0" data-id="${vacancy.id}">
    <img class="vacancy__img" src="${API_URL}${vacancy.logo}" alt="Логотип компании ${vacancy.company}">

    <p class="vacancy__company">
        ${vacancy.company}
    </p>

    <h3 class="vacancy__title">
        ${vacancy.title}
    </h3>

    <ul class="vacancy__fields">
        <li class="vacancy__field">
            от ${parseInt(vacancy.salary).toLocaleString()}₽
        </li>
        <li class="vacancy__field">
            ${vacancy.format}
        </li>
        <li class="vacancy__field">
            ${vacancy.type}
        </li>
        <li class="vacancy__field">
            ${vacancy.experience}
        </li>
    </ul>
    </article>
`;

const createCards = (data) => 
    data.vacancies.map(vacancy => {
        const li = document.createElement('li');
        li.classList.add('cards__item');
        li.insertAdjacentHTML('beforeend', createCard(vacancy));
        return li;
    });

const renderVacancy = (data) => {
    cardsList.textContent = "";
    const cards = createCards(data);
    cardsList.append(...cards);
};

const renderError = (err) => {
    console.warn(err);
};

const init = () => {
    // select city
    const citySelect = document.querySelector("#city");

    const cityChoices = new Choices(citySelect, {
        itemSelectText: "",
    });

    getData(
        `${API_URL}${LOCATION_URL}`, 
        (locationData) => {
            const locations = locationData.map(location => ({
                value: location,
            }));
            cityChoices.setChoices(
                locations,
                "value",
                "label",
                true,
            );
        },
        (err) => {
            console.log(err);
        }
    );

    // cards
    const url = new URL(`${API_URL}${VACANCY_URL}`);

    getData(url, renderVacancy, renderError);
};

init();