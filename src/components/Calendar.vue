<template>
  <div class="delivery">
    <div class="calendar">
      <header>
        <h3></h3>
        <nav>
          <button id="prev"></button>
          <button id="next"></button>
        </nav>
      </header>
      <section>
        <ul class="days">
          <li>Пн</li>
          <li>Вт</li>
          <li>Ср</li>
          <li>Чт</li>
          <li>Пт</li>
          <li>Сб</li>
          <li>Вс</li>
        </ul>
        <ul class="dates"></ul>
      </section>
    </div>
    <div class="calendar__description">
      <div class="development__info"></div>
      <div class="description__status"></div>
      <div class="description">
        <div class="description__date"></div>
        <div class="description__btn"></div>
      </div>
      <div class="description__cancel"></div>
      <div class="cancel__btn"></div>
    </div>
  </div>

  <div class="modal">
    <div class="calendar__modal">
      <div class="modal__variants">
        <el-button class="variant" plain @click="open1"
          >"09:00-12:00"
        </el-button>
      </div>
      <div class="modal__variants">
        <el-button class="variant" plain @click="open1"
          >"12:00-15:00"</el-button
        >
      </div>
      <div class="modal__variants">
        <el-button class="variant" plain @click="open1"
          >"15:00-18:00"</el-button
        >
      </div>
      <div class="modal__variants">
        <el-button class="variant" plain @click="open1"
          >"18:00-21:00"</el-button
        >
      </div>
      <div class="modal__variants">
        <el-button class="variant" plain @click="open1"
          >"09:00-21:00"</el-button
        >
      </div>
      <div class="modal__btn">
        <div class="btn__cancel">
          <button>Отменить</button>
        </div>
        <div class="btn__save">
          <button>Сохранить</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal__cancel">
    <div class="cancel__description">
      <div class="description__p"></div>
      <div class="cancel__button">
        <div class="button__cancel">
          <button>Отменить</button>
        </div>
        <div class="button__save">
          <button :plain="false" @click="open2">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { ElNotification } from "element-plus";
import { ElMessage } from 'element-plus'
import { mapGetters } from "vuex";

export default {
  methods: {
    open1(){
      ElNotification({
        title: "Интервал выбран",
        message: 'Нажмите "сохранить"',
        type: "success",
        });
      },
      open2(){
        ElMessage({
          message: 'Вынос отменен!',
          type: 'success',
      })
}
  },
  data() {
    return {
      infoData: null,
      userID: null,
    };
  },
  computed: {
    ...mapGetters(['getUserId']),
  },
  created()  {
    this.userID = this.getUserId;
  },
  mounted() {
    const header = document.querySelector(".calendar h3");
    const dates = document.querySelector(".dates");
    const navs = document.querySelectorAll("#prev, #next");
    const developmentInfo = document.querySelector(".development__info");
    const descriptionDate = document.querySelector(".description__date");
    const descriptionBtn = document.querySelector(".description__btn");
    const descriptionCancel = document.querySelector(".description__cancel");
    const cancelBtn = document.querySelector(".cancel__btn");
    const descriptionStatus = document.querySelector(".description__status");

    const userId = this.getUserId;

    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];

    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();

    async function renderCalendar() {
  let response = await fetch(
    `https://musorok.online:8000/client_info/schedule_delivery/${userId}`
  );
  let data = await response.json();
  console.log(data);

  let start = new Date(year, month, 1).getDay() || 7;
  let endDate = new Date(year, month + 1, 0).getDate();
  let end = new Date(year, month, endDate).getDay();
  let endDatePrev = new Date(year, month, 0).getDate();

  let datesHtml = "";
  let developmentInfoHTML = "";
  let developmentDescriptionDate = "";
  let developmentDescriptionBtn = "";
  let developmentDescriptionCancel = "";
  let developmentCancelBtn = "";
  let developmentStatus = "";


  for (let i = start - 1; i > 0; i--) {
    datesHtml += `<li class="inactive">${endDatePrev - i + 1}</li>`;
  }

  for (let i = 1; i <= endDate; i++) {
    let className = "";
    data.forEach((item) => {
      let day = item.date.slice(-2);
      let getStatus = item.status.toLowerCase();
      let itemMonth = item.date.slice(5, 7);
      if (parseInt(day) === i && parseInt(itemMonth) === month + 1) {
        switch (getStatus) {
          case "done":
            className = "done";
            break;
          case "canceling":
            className = "canceling";
            break;
          case "waiting":
            className = "waiting";
            break;
          default:
            className = "";
        }
      }
    });

    if (
      i === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
    ) {
      className += " today activeDay";
    }

    let classString = className !== "" ? ` class="${className}"` : "";
    datesHtml += `<li${classString}>${i}</li>`;
  }

  for (let i = end + 1; i < 7; i++) {
    datesHtml += `<li class="inactive">${i - end}</li>`;
  }

  dates.innerHTML = datesHtml;
  header.textContent = `${months[month]} ${year}`;

  let infoId = {
    id: null,
  };

  let activeNumber = document.querySelector(".dates");
  activeNumber.addEventListener("click", function (event) {
    if (event.target.tagName === "LI") {
      let clickedDate = event.target.textContent;
      let clickedMonth = month + 1;
      let clickedYear = year;

      let activeDays = document.querySelectorAll(".activeDay");
      activeDays.forEach((day) => {
        day.classList.remove("activeDay");
      });
      event.target.classList.add("activeDay");

      if (clickedDate < 10) {
        clickedDate = "0" + clickedDate;
      }
      if (clickedMonth < 10) {
        clickedMonth = "0" + clickedMonth;
      }

      let clickedDateString = `${clickedYear}-${clickedMonth}-${clickedDate}`;

      let clickedDateInfo = data.find(
        (item) => item.date === clickedDateString
      );

      if (clickedDateInfo) {
        console.log("Clicked Date Info:", clickedDateInfo);

        infoId.id = clickedDateInfo.id;
        developmentInfo.innerHTML = "";

        if (clickedDateInfo.interval) {
          developmentInfoHTML = `<p>Интервал: ${clickedDateInfo.interval}</p>`;
          developmentInfo.innerHTML = developmentInfoHTML;
          developmentStatus = `<p class="${clickedDateInfo.status}">${clickedDateInfo.status_ru}</p>`;
          descriptionStatus.innerHTML = developmentStatus;
          // if (clickedDateInfo.courier_phone !== null) {
          //   developmentStatus = `<a class="${clickedDateInfo.status}" href="tel:${clickedDateInfo.courier_phone}">${clickedDateInfo.status_ru}</a>`;
          //   descriptionStatus.innerHTML = developmentStatus;
          // }
        }
      } else {
        console.log("No information available for the clicked date.");
      }

    if (clickedDate > new Date().getDate()) {
      developmentDescriptionDate = `<p>Вы можете изменить временной интервал выноса мусора для выбранного дня или для всех дней до конца окончания подписки.</p>`;
      descriptionDate.innerHTML = developmentDescriptionDate;
      developmentDescriptionBtn = `<button class='one__day'>Изменить выбранный день</button><button class="all__day">Изменить для всех дней</button>`;
      descriptionBtn.innerHTML = developmentDescriptionBtn;
      developmentDescriptionCancel = `<p>Если в какой-то день вы будете отсутствовать дома или не захотите, чтобы пришёл курьер, можете отменить вынос мусора. Выберите дату и нажмите «Отменить».</p>`;
      descriptionCancel.innerHTML = developmentDescriptionCancel;
      developmentCancelBtn = `<button class='cancel__delivery'>Отменить вынос мусора</button>`;
      cancelBtn.innerHTML = developmentCancelBtn;

      if(data.length > 0) {
        if(clickedDateInfo) {
          if(clickedDateInfo.status === 'Canceling') {
            descriptionDate.innerHTML = "";
            descriptionBtn.innerHTML = "";
            descriptionCancel.innerHTML = "";
            cancelBtn.innerHTML = "";
          }
        }
        else {
            descriptionDate.innerHTML = "";
            descriptionBtn.innerHTML = "";
            descriptionCancel.innerHTML = "";
            cancelBtn.innerHTML = "";
        }

      } else if(data.length === 0) {
        descriptionDate.innerHTML = "";
        descriptionBtn.innerHTML = "";
        descriptionCancel.innerHTML = "";
        cancelBtn.innerHTML = "";
      }


      attachButtonListeners();
    } else {
      descriptionDate.innerHTML = "";
      descriptionBtn.innerHTML = "";
      descriptionCancel.innerHTML = "";
      cancelBtn.innerHTML = "";
    }
    };
  });

  function attachButtonListeners() {
    const oneDay = document.querySelector(".one__day");
    const allDay = document.querySelector(".all__day");
    const cancelDeliveryBtn = document.querySelector(".cancel__delivery");
    const modal = document.querySelector(".modal");
    const modalVariants = document.querySelectorAll(".modal__variants");

    oneDay?.removeEventListener("click", updateSingleDay);
    allDay?.removeEventListener("click", updateAllDays);
    cancelDeliveryBtn?.removeEventListener("click", cancelDelivery);

    oneDay?.addEventListener("click", updateSingleDay);
    allDay?.addEventListener("click", updateAllDays);
    cancelDeliveryBtn?.addEventListener("click", cancelDelivery);

    const cancelButton = document.querySelector('.btn__cancel');
    const saveButton = document.querySelector('.btn__save')

    async function updateSingleDay() {
      modal.style.display = "flex";
      cancelButton.addEventListener('click', function() {
            modal.style.display = "none";
      })
      for (let elem of modalVariants) {
        elem.addEventListener("click", function handleClick() {
          let value = elem.firstElementChild.textContent.trim();
          let activeColor = document.querySelectorAll(".activeColor");
          activeColor.forEach((day) => {
             day.classList.remove("activeColor");
          });
           event.target.classList.add("activeColor");
          elem.firstElementChild.classList.add('activeColor')
          elem.classList.add('activeColor')
          console.log(infoId.id);
          console.log(value);
          saveButton.addEventListener('click', async function() {
            await fetch(
            `https://musorok.online:8000/update_delivery_intervals/${userId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                accept: "application/json",
              },
              body: JSON.stringify({
                all_day: false,
                id: infoId.id,
                interval: JSON.parse(value),
              }),
            }
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("Ошибка при выполнении запроса");
              }
              return response.json();
            })
            .then((data) => {
              console.log("Обновил:", data);
              developmentInfo.innerHTML = `<p>Нажмите еще раз</p>`;
              descriptionStatus.innerHTML = "";
              descriptionDate.innerHTML = "";
              descriptionBtn.innerHTML = "";
              descriptionCancel.innerHTML = "";
              cancelBtn.innerHTML = "";
              modal.style.display = "none";

              renderCalendar();
            })
            .catch((error) => {
              console.error("Ошибка при обновлении значений переключения:", error);
            });
          })
          cancelButton.addEventListener('click', function() {
            modal.style.display = "none";
          })

          elem.removeEventListener("click", handleClick);
        });
      }
    }

    async function updateAllDays() {
      modal.style.display = "flex";
      cancelButton.addEventListener('click', function() {
            modal.style.display = "none";
          })
      for (let elem of modalVariants) {
        elem.addEventListener("click", async function handleClick() {
          let value = elem.firstElementChild.textContent.trim();
          let activeColor = document.querySelectorAll(".activeColor");
          activeColor.forEach((day) => {
             day.classList.remove("activeColor");
          });
           event.target.classList.add("activeColor");
          elem.firstElementChild.classList.add('activeColor')
          elem.classList.add('activeColor')
          console.log(infoId.id);
          console.log(value);
          saveButton.addEventListener('click', async function() {
            await fetch(
            `https://musorok.online:8000/update_delivery_intervals/${userId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                accept: "application/json",
              },
              body: JSON.stringify({
                all_day: true,
                id: infoId.id,
                interval: JSON.parse(value),
              }),
            }
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("Ошибка при выполнении запроса");
              }
              return response.json();
            })
            .then((data) => {
              console.log("Обновил:", data);
              developmentInfo.innerHTML = `<p>Нажмите еще раз</p>`;
              descriptionStatus.innerHTML = "";
              descriptionDate.innerHTML = "";
              descriptionBtn.innerHTML = "";
              descriptionCancel.innerHTML = "";
              cancelBtn.innerHTML = "";
              modal.style.display = "none";

              renderCalendar();
            })
            .catch((error) => {
              console.error("Ошибка при обновлении значений переключения:", error);
            });
          });

          cancelButton.addEventListener('click', function() {
            modal.style.display = "none";
          })

          elem.removeEventListener("click", handleClick);
        });
      }
    }

    async function cancelDelivery() {

      const modalCancel = document.querySelector('.modal__cancel');
      const cancelDescription = document.querySelector('.description__p');

      const buttonCancel = document.querySelector('.button__cancel');
      const buttonSave = document.querySelector('.button__save')

      const bckgr = document.querySelector('.cancel__description');


      modalCancel.style.display = "block";
      let data = await fetch(`https://musorok.online:8000/client_info/schedule_delivery/${userId}`);
      let response = await data.json();
      for (let key of response) {
        if(key.id === infoId.id) {
          console.log('нашел', key.interval);
          cancelDescription.innerHTML = `<p>Данное действие нельзя будет отменить, вы точно хотите отменить вынос на ${key.date}?</p>`
        }
      }

      console.log({ id: infoId.id, status: 'Canceling' });

      buttonCancel.addEventListener('click', function() {
        modalCancel.style.display = 'none';
      })

      buttonSave.addEventListener('click', async function() {
        await fetch(
        `https://musorok.online:8000/cancel_delivery/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            id: infoId.id,
            status: "Canceling",
          }),
        }
        )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ошибка при выполнении запроса");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Обновил:", data);
          developmentInfo.innerHTML = `<p>Нажмите еще раз</p>`;
          descriptionStatus.innerHTML = "";
          descriptionDate.innerHTML = "";
          descriptionBtn.innerHTML = "";
          descriptionCancel.innerHTML = "";
          cancelBtn.innerHTML = "";
          modalCancel.style.display = 'none';
          setTimeout(()=> {
            bckgr.style.display = 'none'
          }, 1500)
          renderCalendar();
        })
        .catch((error) => {
          console.error("Ошибка при обновлении значений переключения:", error);
          modalCancel.style.display = 'none';
          setTimeout(()=> {
            bckgr.style.display = 'none'
          }, 1500)
        });
      });
    }
  }
}


navs.forEach((nav) => {
  nav.addEventListener("click", (e) => {
    const btnId = e.target.id;

    if (btnId === "prev") {
      if (month === 0) {
        year--;
        month = 11;
      } else {
        month--;
      }
    } else if (btnId === "next") {
      if (month === 11) {
        year++;
        month = 0;
      } else {
        month++;
      }
    }

    renderCalendar();
  });
});

renderCalendar();
},
  //мой код
  // data() {
  //   return {

  //   }
  // },
};
</script>

<style scoped>
.el-button.is-plain {
  background-color: #c8c6c6 !important;
  height: 45px !important;
}
.el-button > span {
  font-size: 25px !important;
  font-weight: 400 !important;
  padding: 30px !important;
}
.variant {
  font-size: 25px;
  padding: 40px;
  padding: 10px 40px !important;
}
.variant > span {
  padding: 10px 40px !important;
  color: #2b2929 !important;
}
</style>

<style>
/* .activeColor > span {
  color: rgb(0, 0, 0) !important;
} */
.variant > span {
  color: #3b3737 !important;
}
.activeColor button {
  border: 1px solid #2b2929 !important;
}

h1 {
  font-weight: 600;
  text-align: center;
  color: #fff;
}
h3 {
  font-weight: 600;
}
.calendar {
  margin: auto;
  width: 100%;
  padding: 1rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
}
.calendar header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.calendar nav {
  display: flex;
  align-items: center;
}
.calendar ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
}
.calendar ul li {
  width: calc(100% / 7);
  margin-top: 20px;
  position: relative;
  z-index: 2;
  cursor: pointer;
}

.dates li.activeDay::before {
  content: "";
  width: 2rem;
  height: 2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #66a0d4 !important;
  border-radius: 50%;
  z-index: -1;
  color: white !important;
}
.dates li.activeDay {
  color: white !important;
}
#prev,
#next {
  width: 20px;
  height: 20px;
  position: relative;
  border: none;
  background: transparent;
  cursor: pointer;
}
#prev::before,
#next::before {
  content: "";
  width: 50%;
  height: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  border-style: solid;
  border-width: 0.25em 0.25em 0 0;
  border-color: #ccc;
}
#next::before {
  transform: translate(-50%, -50%) rotate(45deg);
}
#prev::before {
  transform: translate(-50%, -50%) rotate(-135deg);
}
#prev:hover::before,
#next:hover::before {
  border-color: #000;
}
.days {
  font-weight: 600;
}
.dates li {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.dates li.today::before {
  content: "";
  width: 2rem;
  height: 2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid rgb(86, 83, 83);
  border-radius: 50%;
  z-index: -1;
  color: white;
}
.dates li.done {
  color: white;
}
.dates li.done::before {
  content: "";
  width: 2rem;
  height: 2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #54ba6c;
  border-radius: 50%;
  z-index: -1;
}
.dates li.canceling {
  color: white;
}
.dates li.canceling::before {
  content: "";
  width: 2rem;
  height: 2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #e06464;
  border-radius: 50%;
  z-index: -1;
}

.dates li.waiting::before {
  content: "";
  width: 2rem;
  height: 2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #c9c9c9;
  border-radius: 50%;
  z-index: -1;
}
.dates li.inactive {
  color: #ccc;
}
.dates li.inactive:hover::before {
  content: "";
  width: 2rem;
  height: 2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  background: none;
  z-index: -1;
}
.dates li.inactive:hover {
  color: #ccc;
}
.development__info p {
  text-align: center;
}
.description__date p {
  font-size: 13px;
  text-align: start;
  margin-bottom: 20px;
}
.description__btn button {
  border: none;
  background: #66a0d4;
  color: white;
  font-size: 12px;
  padding: 8px;
  border-radius: 5px;
}
.description__btn {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.description__cancel p {
  font-size: 13px;
  text-align: start;
  margin-bottom: 20px;
}
.calendar__description {
  overflow-y: scroll;
  height: 200px;
}
.cancel__btn button {
  border: none;
  background: #66a0d4;
  color: white;
  font-size: 12px;
  padding: 8px;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 80px;
}
.description__status p {
  font-size: 13px;
  text-align: center;
  margin-bottom: 10px;
}
.description__status {
  text-align: center;
}
.Canceling {
  color: #e06464;
}
.Done {
  color: #54ba6c;
}
.Waiting {
  color: #7e7e7e;
  font-size: 13px;
  text-align: center;
}
.Waiting a {
  color: #7e7e7e;
}
.modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  background: #000000c9;
  color: white;
  z-index: 100;
  animation: showBlock 0.4s;
  display: none;
}
.modal__variants {
  margin-bottom: 20px;
  font-size: 26px;
}
.calendar__modal {
  padding: 30px;
  background: #efefef;
  border-radius: 20px;
}

@keyframes showBlock {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.modal__btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.modal__btn button {
  font-family: "Montserrat", sans-serif;
  padding: 4px 10px;
  border: 1px solid white;
  color: #2b2929;
  background-color: #c8c6c6;
  border-radius: 4px;
  font-size: 16px;
}
.btn__cancel button:active {
  background-color: #2b2929;
  color: #c8c6c6;
}
.btn__save button:active {
  background-color: #2b2929;
  color: #c8c6c6;
}
.modal__cancel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  background: #000000c9;
  color: white;
  z-index: 100;
  animation: showBlock 0.4s;
  display: none;
}
.cancel__description {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 90%;
  margin: 0 auto;
  text-align: center;
  flex-direction: column;
}
.cancel__description p {
  background-color: white;
  color: black;
  padding: 10px;
  border-radius: 10px;
  animation: showBlock 0.4s;
  margin-bottom: 14px;
}

.cancel__button {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
.cancel__button button {
  font-family: "Montserrat", sans-serif;
  border: none;
  padding: 5px 15px;
  font-size: 17px;
  border-radius: 7px;
}
</style>
