<template>
  <div class="position__calendar">
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
      <div class="info__date">
        <p>Выберите дату</p>
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
        </div>
      </div>
      <div class="modal__btn">
        <div class="btn__cancel" :plain="true" @click="open3">
          <button>Отменить</button>
        </div>
        <div class="btn__save" :plain="false" @click="open2">
          <button @click="postStateHiddenBtn">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
    import { ElNotification } from "element-plus";
    import { ElMessage } from 'element-plus';
    import { mapGetters } from "vuex";

    export default {
      data() {
        return {
          infoData: null,
          userID: null,
          selectedDate: null,
          stateHiddenBtn: this.hiddenBtn,
        };
      },
      props: {
        hiddenBtn: {
          type: Boolean,
        }
      },
      computed: {
        ...mapGetters(['getUserId']),
      },
      methods: {
        postStateHiddenBtn() {
          this.$emit('updateShowBtn', false);
        },
        open1(){
        ElNotification({
          title: "Интервал выбран",
          message: 'Нажмите "сохранить"',
          type: "success",
          });
        },
        open2(){
          ElMessage({
            message: 'Ожидайте вынос!',
            type: 'success',
          })
        },
        open3() {
          ElMessage({
            message: 'Вынос отменен!',
            type: 'info',
            plain: true,
          })
        }
      },
      created() {
        this.userID = this.getUserId;
      },
      mounted() {
        const header = document.querySelector(".calendar h3");
        const dates = document.querySelector(".dates");
        const navs = document.querySelectorAll("#prev, #next");
        const infoDate = document.querySelector('.info__date');

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

        function renderCalendar() {
          let start = new Date(year, month, 1).getDay() || 7;
          let endDate = new Date(year, month + 1, 0).getDate();
          let end = new Date(year, month, endDate).getDay();
          let endDatePrev = new Date(year, month, 0).getDate();

          let datesHtml = "";

          // Add previous month's last days
          for (let i = start - 1; i > 0; i--) {
            datesHtml += `<li class="inactive">${endDatePrev - i + 1}</li>`;
          }

          // Add current month's days
          for (let i = 1; i <= endDate; i++) {
            let className = "";
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

          // Add next month's first days
          for (let i = end + 1; i < 7; i++) {
            datesHtml += `<li class="inactive">${i - end}</li>`;
          }

          dates.innerHTML = datesHtml;
          header.textContent = `${months[month]} ${year}`;

          // Add noActive class to past dates and today's date
          let today = new Date();
          let currentFullYear = today.getFullYear();
          let currentMonth = today.getMonth() + 1;
          let currentDate = today.getDate();

          let allNumberCalendar = [...dates.children];

          for (const date of allNumberCalendar) {
            let dateNumber = parseInt(date.textContent, 10);

            // Ensure only dates in the current month are considered
            if (month + 1 === currentMonth && year === currentFullYear) {
              if (dateNumber <= currentDate) {
                date.classList.add('noActive');
              }
            } else if (year < currentFullYear || (year === currentFullYear && month + 1 < currentMonth)) {
              date.classList.add('noActive');
            }
          }

          function removeStyle() {
            const variants = document.querySelectorAll(".modal__variants");
            for(let elem of variants) {
                let span = elem.firstElementChild;
                elem.firstChild.style.setProperty("background-color", "#c8c6c6", "important")
                span.lastElementChild.style.setProperty("color", "#3b3737", "important")
              }
          }

          const allBtns = document.querySelector('.modal__btn');
          const cancelButton = allBtns.firstElementChild;
          cancelButton.addEventListener('click', ()=> {
            const modalCalendar = document.querySelector('.calendar');
            modalCalendar.classList.add('hide__calendar')
            setTimeout(()=> {
              modalCalendar.style.display = 'none'
            }, 300)
          })


          dates.addEventListener("click", function (event) {
            removeStyle();
            if (event.target.tagName === "LI" && !event.target.classList.contains('inactive')) {
              const modal = document.querySelector(".modal");
              const modalVariants = document.querySelectorAll(".modal__variants");

              let clickedDate = parseInt(event.target.textContent, 10);
              let clickedMonth = month + 1;
              let clickedYear = year;

              let activeDays = document.querySelectorAll(".activeDay");
              activeDays.forEach((day) => {
                day.classList.remove("activeDay");
              });
              modal.style.display = 'flex'

              let interval;
              for(let elem of modalVariants) {
                let span = elem.firstElementChild;

                elem.addEventListener('click', function() {

                  const saveButton = allBtns.lastElementChild;

                  removeStyle();

                  elem.firstChild.style.setProperty("background-color", "#66a0d4", "important")
                  span.lastElementChild.style.setProperty("color", "white", "important")

                  interval = elem.textContent.trim();
                  console.log('Ваш интревал',interval);

                  saveButton.style.display = 'block'
                  saveButton.addEventListener('click', ()=> {
                    postDataFreeDelivery()
                  })
                })
              }

              let selectedDate;
              if (
                clickedYear > currentFullYear ||
                (clickedYear === currentFullYear && clickedMonth > currentMonth) ||
                (clickedYear === currentFullYear && clickedMonth === currentMonth && clickedDate > currentDate)
              ) {
                event.target.classList.add("activeDay");

                const monthName = months[month];
                let reMonth = monthName.slice(0, -1) + 'я';

                infoDate.innerHTML = `<p>Ваша дата: ${clickedDate} ${reMonth}</p>`;

                let formattedDate = `${clickedYear}-${String(clickedMonth).padStart(2, '0')}-${String(clickedDate).padStart(2, '0')}`;
                selectedDate = formattedDate;
                console.log('Selected Date:', selectedDate);
              }

              async function postDataFreeDelivery() {
                const probnay = {
                  date: selectedDate,
                  interval: JSON.parse(interval)
                }
                console.log(probnay);
                await fetch(
                  `https://musorok.online:8000/add_delivery/${userId}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      accept: "application/json",
                    },
                    body: JSON.stringify({
                      date: selectedDate,
                      interval: JSON.parse(interval),
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
                    const calendar = document.querySelector('.position__calendar');
                    console.log("Обновил:", data);
                    calendar.style.display = 'none'
                  })
                  .catch((error) => {
                    console.error("Ошибка при обновлении значений переключения:", error);
                  });
              }

            }
          }.bind(this));
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
  max-width: 525px;
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

.modal {
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
  /* display: none; */
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
.noActive {
  color: #ccc;
}
.info__date {
  text-align: center;
  margin-bottom: 10px;
}
</style>

<style scoped>
.btn__save {
  animation: showBlock 0.4s;
  display: none;
}
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  background: #00000000;
  color: white;
  z-index: 100;
  animation: showBlock 0.4s;
  position: relative;
  display: none;
}
.calendar__modal {
  padding: 0;
}
.modal__variants {
  margin-bottom: 0;
  padding: 2px;
}
.modal__variants .variant {
  padding: 5px !important;
  font-size: 16px;
  max-width: 110px;
}
.calendar__modal {
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
  background-color: rgba(255, 255, 255, 0);
}
.modal__btn {
  margin-top: 20px;
}
.btn__cancel button {
  background-color: #d65b5b;
  color: white;
}
.btn__save button {
  background-color: #72c882;
  color: white;
}
.hide__calendar {
  animation: hideBlockCalendar 0.5s;
}

@keyframes hideBlockCalendar {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.position__calendar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 375px;
  height: 100%;
  background-color: #fcfcfc;
  max-width: 100%;
  width: 100%;
}
.delivery {
  max-width: 525px;
  margin: 0 auto;
}
</style>
