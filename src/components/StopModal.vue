<template>
  <div class="warning">
    <h2>
      Чтобы воспользоваться нашим сервисом, пройдите регистрацию в телеграмм
      боте! Сервис работает только в телеграмм приложении!
    </h2>
    <button>
      <a href="https://t.me/musorok_ru_bot">Перейти в бота</a>
    </button>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
h2 {
  color: rgb(138, 138, 138);
  margin-bottom: 20px;
}
a {
  color: white;
}

.warning {
  background: #fcfcfc;
  height: 130%;
  min-height: 100%;
  position: absolute;
  z-index: 100;
  top: -20%;
  left: 0;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}
button {
  border: 1px solid #308444;
  font-size: 16px;
  border-radius: 7px;
  padding: 3px 12px;
  font-family: "Montserrat", sans-serif;
  background-color: #54ba6c;
  color: white;
}
</style>
