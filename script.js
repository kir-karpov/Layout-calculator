"use strict";
const title = document.getElementsByTagName("h1")[0];

const calculateBtn = document.getElementsByClassName("handler_btn")[0];
const resetBtn = document.getElementsByClassName("handler_btn")[1];

const plusBtn = document.querySelector(".screen-btn");

const otherItemsPercent = document.querySelectorAll(".other-items.percent");
const otherItemsNumber = document.querySelectorAll(".other-items.number");

const rangeInput = document.querySelector('.rollback input[type="range"]');
const rangeValue = document.querySelector(".rollback .range-value");

const total = document.getElementsByClassName("total-input")[0];
const totalCount = document.getElementsByClassName("total-input")[1];
const totalCountOther = document.getElementsByClassName("total-input")[2];
const fulltotalCount = document.getElementsByClassName("total-input")[3];
const totalCountRollback = document.getElementsByClassName("total-input")[4];

let screenBlocks = document.querySelectorAll(".screen");

const valueSpan = document.querySelector(".rollback .range-value");

const appData = {
  title: "",
  screens: [],
  screenPrice: 0,
  adaptive: true,
  servicePricesPercent: 0,
  servicePricesNumber: 0,
  rollback: 10,
  fullPrice: 0,
  servicePercentPrice: 0,
  servicesPercent: {},
  servicesNumber: {},
  isError: false,

  validateScreenData() {
    this.isError = false;
    screenBlocks = document.querySelectorAll(".screen");

    screenBlocks.forEach((screen) => {
      const select = screen.querySelector(`select`);
      const input = screen.querySelector(`input`);

      if (select.value === "" || input.value === "") {
        this.isError = true;
        return;
      }
    });
  },

  calculateButtonClick() {
    this.validateScreenData();

    if (!this.isError) {
      this.start();
      calculateBtn.style.display = "none";
      resetBtn.style.display = "block";
    } else {
      console.log(
        "Ошибка! Необходимо выбрать тип экрана и указать количество для всех блоков."
      );
    }
  },

  reset() {
    this.screens = [];
    this.screenPrice = 0;
    this.servicePricesPercent = 0;
    this.servicePricesNumber = 0;
    this.fullPrice = 0;
    this.servicePercentPrice = 0;
    this.servicesPercent = {};
    this.servicesNumber = {};
    this.isError = false;
    total.value = "";
    totalCount.value = "";
    totalCountOther.value = "";
    fulltotalCount.value = "";
    totalCountRollback.value = "";
    calculateBtn.style.display = "block";
    resetBtn.style.display = "none";

    this.clearScreenData();
  },

  init() {
    this.addTitle();

    calculateBtn.addEventListener(
      "click",
      this.calculateButtonClick.bind(this)
    );
    resetBtn.addEventListener("click", this.reset.bind(this));
    plusBtn.addEventListener("click", this.addScreenBlock.bind(this));

    rangeInput.addEventListener(
      "input",
      function () {
        const value = rangeInput.value;

        valueSpan.textContent = value + "%";

        this.rollback = value;

        this.start();

        console.log("Значение в свойстве rollback:", this.rollback);
      }.bind(this)
    );
  },

  addTitle() {
    document.title = title.textContent;
  },

  start() {
    this.addScreens();
    this.addServices();
    this.addPrices();
    this.showResult();
  },

  showResult() {
    total.value = this.screenPrice;
    totalCountOther.value = (
      this.servicePricesPercent + this.servicePricesNumber
    ).toString();

    totalCountRollback.value = this.getRollbackMessage(this.fullPrice);
  },

  addScreens() {
    screenBlocks = document.querySelectorAll(".screen");
    this.screens = [];
    screenBlocks.forEach((screen, index) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");
      const selectName = select.options[select.selectedIndex].textContent;
      const count = +input.value;

      this.screens.push({
        id: index,
        name: selectName,
        price: +select.value * count,
        count: count,
      });
    });

    let totalCount = 0;
    for (let screen of this.screens) {
      totalCount += screen.count;
    }

    this.count = totalCount;
    document.getElementById("total-count").value = totalCount;

    console.log(this.screens);
  },

  addServices() {
    this.servicesPercent = {};
    this.servicesNumber = {};

    otherItemsPercent.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        this.servicesPercent[label.textContent] = +input.value;
      }
    });

    otherItemsNumber.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        this.servicesNumber[label.textContent] = +input.value;
      }
    });
  },

  addScreenBlock() {
    const cloneScreen = screenBlocks[0].cloneNode(true);

    screenBlocks[screenBlocks.length - 1].after(cloneScreen);
  },

  isTextOnly(text) {
    return /^[A-Za-zА-Яа-я\s]+$/.test(text);
  },

  isTextWithNumbers(text) {
    return /^[A-Za-zА-Яа-я\s\d]+$/.test(text);
  },

  addPrices() {
    this.screenPrice = 0;
    this.servicePricesPercent = 0;
    this.servicePricesNumber = 0;

    for (let screen of this.screens) {
      this.screenPrice += screen.price;
    }

    for (let key in this.servicesNumber) {
      this.servicePricesNumber += this.servicesNumber[key];
    }

    for (let key in this.servicesPercent) {
      this.servicePricesPercent +=
        this.screenPrice * (this.servicesPercent[key] / 100);
    }

    this.fullPrice =
      +this.screenPrice + this.servicePricesPercent + this.servicePricesNumber;
  },

  getServicePercentPrice() {
    this.servicePercentPrice =
      this.fullPrice - this.fullPrice * (this.rollback / 100);
  },

  getRollbackMessage(price) {
    if (price >= 30000) {
      return "Даем скидку в 10%";
    } else if (price >= 15000 && price < 30000) {
      return "Даем скидку в 5%";
    } else if (price >= 0 && price < 15000) {
      return "Скидка не предусмотрена";
    } else {
      return "Что-то пошло не так";
    }
  },

  logger() {
    console.log(this.fullPrice);
    console.log(this.servicePercentPrice);
    console.log(this.screens);
  },

  clearScreenData() {
    const screenContainer = document.querySelector(".screen-container");
    if (screenContainer) {
      const screens = screenContainer.querySelectorAll(".screen");
      screens.forEach((screen) => {
        const select = screen.querySelector("select");
        const input = screen.querySelector("input");
        const checkboxes = screen.querySelectorAll("input[type=checkbox]");

        if (select) {
          select.value = "";
        }
        if (input) {
          input.value = "";
        }
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      });
    }
  },
};

appData.init();
