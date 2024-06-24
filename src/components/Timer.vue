<template>
  <div class="timer">
    <p class="timer__text">00:</p>
    <div id="countdown">59</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showSMS: true,
    };
  },
  mounted() {
    let timeLeft = 15;
    const countdownElement = document.getElementById("countdown");
    const timerText = document.querySelector(".timer__text");
    const countdownTimer = setInterval(() => {
      if (timeLeft <= 10) {
        timerText.textContent = "00:0";
      }
      timeLeft--;
      countdownElement.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
        this.$emit("showSMSButton", this.showSMS);
      }
    }, 1000);
  },
};
</script>
<style>
.timer {
  display: flex;
  justify-content: center;
}
</style>
