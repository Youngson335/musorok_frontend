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
    <div class="info__date">
      <p>Выберите дату</p>
    </div>
    <div class="dynamic__еlements">
      <div class="elements__interval"></div>
      <div class="еlements__btns">
        <div :plain="true" @click="handleDeleteDay" class="btn__delete"></div>
        <div :plain="true" @click="handleAddDay" class="btn__create"></div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { ElMessage } from 'element-plus';
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      infoData: null,
      userID: null,
      selectedDate: null,
      workingDays: [],
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      dataUser: null,
      infoClickedDate: null,
    };
  },
  computed: {
    ...mapGetters(['getUserId']),
  },
  methods: {
    showMessage(type, message) {
      ElMessage({
        message: message,
        type: type,
        plain: true,
      });
    },
    async updateIntervalInfo() {
      const interval = document.querySelector('.elements__interval');
      let clickedDate = this.selectedDate;
      let startInterval = null;
      let endInterval = null;

      const response = await fetch(`https://musorok.online:8000/courier_schedule/${this.userID}`);
      const data = await response.json();
      let getInterval = data.find(int => int.schedule_dt === clickedDate);

      if(getInterval) {
        if(getInterval.start_time.slice(0, 2) === '9:') {
          startInterval = '0' + getInterval.start_time.slice(0, 1);
          endInterval = getInterval.end_time.slice(0, 2);
        } else {
          startInterval = getInterval.start_time.slice(0, 2);
          endInterval = getInterval.end_time.slice(0, 2)
        }
      }
      let intervalInfo = `${startInterval}:00-${endInterval}:00`;
      interval.innerHTML = `<p>Интервал: ${intervalInfo}</p>`
    },
    async updateIntervalAfterDeletion() {
      const interval = document.querySelector('.elements__interval');
      let clickedDate = this.selectedDate;
      const btnCreate = document.querySelector('.btn__create');

      interval.innerHTML = `<p>У вас выходной!</p>`;
      btnCreate.innerHTML = `<button>Добавить день</button>`;
    },
    async handleAddDay() {
      if (!this.selectedDate) return;

      try {
        const response = await fetch(`https://musorok.online:8000/add_working_day/${this.userID}`, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: this.selectedDate,
            interval: '09:00-21:00',
          }),
        });

        if (!response.ok) {
          throw new Error('Ошибка при выполнении запроса!');
        }

        const btnCreate = document.querySelector('.btn__create');
        const interval = document.querySelector('.elements__interval');

        const data = await response.json();
        console.log('День добавлен:', data);
        this.updateIntervalInfo();

        btnCreate.innerHTML = ''
        this.showMessage('success', 'Рабочий день добавлен!');
        await this.renderCalendar();
      } catch (error) {
        console.error('Ошибка при обновлении дня!', error);
      }
    },
    async handleDeleteDay() {
      if (!this.selectedDate) return;

      try {
        const response = await fetch(`https://musorok.online:8000/delete_working_day/${this.userID}`, {
          method: 'DELETE',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: this.selectedDate,
          }),
        });

        if (!response.ok) {
          throw new Error('Ошибка при выполнении запроса!');
        }

        const data = await response.json();
        const btnDelete = document.querySelector('.btn__delete');
        console.log('День успешно удален!', data);
        btnDelete.innerHTML = '';
        this.updateIntervalAfterDeletion();
        this.showMessage('success', 'День успешно удален!');
        await this.renderCalendar();
      } catch (error) {
        console.error('Ошибка при удалении дня', error);
      }
    },
    async fetchWorkingDays() {
      const userId = this.userID;
      const response = await fetch(`https://musorok.online:8000/courier_schedule/${userId}`);
      const data = await response.json();
      console.log(data);
      this.dataUser = data;

      this.workingDays = data.filter(day => day.is_working_day === 1).map(day => day.schedule_dt);
    },
    async renderCalendar() {
      const header = document.querySelector(".calendar h3");
      const dates = document.querySelector(".dates");
      const infoDate = document.querySelector('.info__date');

      const months = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
      ];

      const startDay = new Date(this.year, this.month, 1).getDay() || 7;
      const endDate = new Date(this.year, this.month + 1, 0).getDate();
      const endDay = new Date(this.year, this.month, endDate).getDay();
      const endDatePrev = new Date(this.year, this.month, 0).getDate();

      await this.fetchWorkingDays();

      let datesHtml = "";

      // Add previous month's last days
      for (let i = startDay - 1; i > 0; i--) {
        datesHtml += `<li class="inactive">${endDatePrev - i + 1}</li>`;
      }

      // Add current month's days
      for (let i = 1; i <= endDate; i++) {
        let className = "";

        if (
          i === new Date().getDate() &&
          this.month === new Date().getMonth() &&
          this.year === new Date().getFullYear()
        ) {
          className += " today activeDay";
        }

        let iDay = i <= 9 ? '0' + i : i;
        let refMonthFormatted = (this.month + 1) <= 9 ? '0' + (this.month + 1) : (this.month + 1);
        let formattedDate = `${this.year}-${refMonthFormatted}-${iDay}`;

        if (this.workingDays.includes(formattedDate)) {
          className += className ? " working" : "working";
        }

        let classString = className ? ` class="${className}"` : "";
        datesHtml += `<li${classString}>${i}</li>`;
      }

      // Add next month's first days
      for (let i = endDay + 1; i < 7; i++) {
        datesHtml += `<li class="inactive">${i - endDay}</li>`;
      }

      dates.innerHTML = datesHtml;
      header.textContent = `${months[this.month]} ${this.year}`;

      // Handle clicks on dates
      dates.querySelectorAll("li").forEach(dateElement => {
        dateElement.addEventListener("click", (event) => {
          if (!event.target.classList.contains('inactive')) {
            this.handleDateClick(event);
          }
        });
      });
    },
    handleDateClick(event) {
      const infoDate = document.querySelector('.info__date');
      const interval = document.querySelector('.elements__interval');
      const btnCreate = document.querySelector('.btn__create');
      const btnDelete = document.querySelector('.btn__delete');

      const clickedDate = parseInt(event.target.textContent, 10);
      const clickedMonth = this.month + 1;
      const clickedYear = this.year;

      document.querySelectorAll(".activeDay").forEach(day => day.classList.remove("activeDay"));
      event.target.classList.add("activeDay");

      const monthName = this.getMonthName(this.month);
      const reMonth = monthName.slice(0, -1) + 'я';
      infoDate.innerHTML = `<p>${clickedDate} ${reMonth}</p>`;

      this.selectedDate = `${clickedYear}-${String(clickedMonth).padStart(2, '0')}-${String(clickedDate).padStart(2, '0')}`;

      const clickedDateInfo = this.workingDays.find(date => date === this.selectedDate);

      // Calculate the threshold date (today + 4 days)
      const today = new Date();
      const thresholdDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4);

      // Parse the selected date to a Date object
      const selectedDateObj = new Date(this.selectedDate);

      let allUserData = this.dataUser;

      let getInterval = allUserData.find(int => int.schedule_dt === clickedDateInfo);
      let startInterval = null;
      let endInterval = null

      if(getInterval) {
        if(getInterval.start_time.slice(0, 2) === '9:') {
          startInterval = '0' + getInterval.start_time.slice(0, 1);
          endInterval = getInterval.end_time.slice(0, 2);
        } else {
          startInterval = getInterval.start_time.slice(0, 2);
          endInterval = getInterval.end_time.slice(0, 2)
        }
      } else if(!getInterval) {
        interval.innerHTML = '<p>Выходной день</p>';
        document.querySelector('.btn__create').addEventListener('click', this.handleAddDay);
        btnDelete.innerHTML = '';
      }

      let intervalInfo = `${startInterval}:00-${endInterval}:00`;


      if (selectedDateObj > thresholdDate) {
        if (clickedDateInfo) {
          interval.innerHTML = `<p>Интервал: ${intervalInfo} </p>`;
          btnDelete.innerHTML = `<button>Удалить день</button>`;
          btnDelete.replaceWith(btnDelete.cloneNode(true));
          document.querySelector('.btn__delete').addEventListener('click', this.handleDeleteDay);
          btnCreate.innerHTML = '';
        } else {
          interval.innerHTML = '<p>У вас выходной!</p>';
          btnCreate.innerHTML = `<button>Добавить день</button>`;
          btnCreate.replaceWith(btnCreate.cloneNode(true));
          document.querySelector('.btn__create').addEventListener('click', this.handleAddDay);
          btnDelete.innerHTML = '';
        }
      } else {
        btnCreate.innerHTML = '';
        if(getInterval !== undefined) {
          interval.innerHTML = `<p>Интервал: ${intervalInfo} </p>`;
        } else interval.innerHTML = '<p>У вас выходной!</p>';
      }
    },
    getMonthName(monthIndex) {
      const months = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
      ];
      return months[monthIndex];
    },
    prevMonth() {
      if (this.month === 0) {
        this.year--;
        this.month = 11;
      } else {
        this.month--;
      }
      this.renderCalendar();
    },
    nextMonth() {
      if (this.month === 11) {
        this.year++;
        this.month = 0;
      } else {
        this.month++;
      }
      this.renderCalendar();
    },
  },
  async mounted() {
    this.userID = this.getUserId;
    await this.renderCalendar();
    document.getElementById("prev").addEventListener("click", this.prevMonth);
    document.getElementById("next").addEventListener("click", this.nextMonth);
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
.dates li.working::before {
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
.dates li.working {
  color: white;
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

@keyframes showBlock {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.btn__cancel button:active {
  background-color: #2b2929;
  color: #c8c6c6;
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
  padding: 10px !important;
}
.elements__interval {
  text-align: center;
  margin-bottom: 10px;
}
.info__date {
  margin-bottom: 0px !important;
}
</style>

<style>
.btn__delete {
  width: 44%;
  display: flex;
  justify-content: center;
  margin: 0 auto;
}
.btn__create {
  width: 48%;
  display: flex;
  justify-content: center;
  margin: 0 auto;
}
.btn__delete button {
  border: 1px solid #c92626;
  font-size: 16px;
  border-radius: 7px;
  padding: 3px 12px;
  font-family: "Montserrat", sans-serif;
  background-color: #ff6565;
  color: white;
}
.btn__create button {
  border: 1px solid #308444;
  font-size: 16px;
  border-radius: 7px;
  padding: 3px 12px;
  font-family: "Montserrat", sans-serif;
  background-color: #54ba6c;
  color: white;
}
</style>
