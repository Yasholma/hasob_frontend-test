"use strict";

const questionHeader = document.querySelector(".question-header");
const alertBox = document.querySelector(".alert");

const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

const questionProgress = document.querySelector(".question-progress");
let progressCount = 0;
let step = 1;

const questionOne = document.querySelector(".one");
const questionOneRes = document.getElementsByName("favourite-track");

const questionTwo = document.querySelector(".two");
const stacksContainer = document.querySelector(".stack");
const questionTwoValues = {
  frontend: ["React", "Vue", "Angular", "Others"],
  backend: ["Django", "Express", "Laravel", "Others"],
  mobile: ["React Native", "Flutter", "Swift", "Others"],
  desktop: ["Electron", "JavaFX", "Swing", "Others"],
};

const questionThree = document.querySelector(".three");
const questionThreeRes = document.getElementsByName("favourite-stack");

const questionFour = document.querySelector(".four");
const questionFourRes = document.getElementById("email");
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const summary = document.querySelector(".summary");

// store responses
const responses = { one: "", two: "", three: [], four: "" };

// on page load, get question one
window.addEventListener("load", () => {
  questionHeader.innerHTML = "Step One";

  if (step === 1) {
    // hide prev button
    prevBtn.style.visibility = "hidden";
  }

  // question one
  questionOneRes.forEach((track) => {
    track.addEventListener("change", function () {
      // add to responses
      const { value } = this;
      responses.one = value;

      // populate question two options
      let questionTwoOptions = `
        <option value="">Select one please</option>
      `;
      questionTwoValues[value].forEach((option) => {
        questionTwoOptions += `
          <option value="${option.toLowerCase()}">${option}</option>
        `;
      });

      stacksContainer.innerHTML = questionTwoOptions;
    });
  });

  // question three
  questionThreeRes.forEach((stack) => {
    stack.addEventListener("click", function () {
      responses.three = this.checked
        ? [...responses.three, this.value]
        : responses.three.filter((stk) => stk !== this.value);
    });
  });
});

const showAlert = (msg) => {
  alertBox.innerHTML = msg;
  alertBox.classList.remove("hide");
  setTimeout(() => {
    alertBox.classList.add("hide");
  }, 5000);
};

nextBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (step === 1) {
    // validate question one is answered
    if (!responses.one) {
      showAlert("Please select favourite track");
      return;
    }

    // hide question one
    questionOne.classList.add("hide");
    // show question two
    questionTwo.classList.remove("hide");

    step = 2;
    // show prev button
    prevBtn.style.visibility = "visible";
    questionHeader.innerHTML = "Step Two";
    if (progressCount !== 100) progressCount = 25;
    if (progressCount === 100) questionProgress.classList.add("full");
    questionProgress.style.width = progressCount + "%";
    return;
  }

  if (step === 2) {
    if (!stacksContainer.value) {
      showAlert("Please select favourite stack");
      return;
    }

    // store question two result
    responses.two = stacksContainer.value;

    // hide question two
    questionTwo.classList.add("hide");
    // show question three
    questionThree.classList.remove("hide");

    step = 3;
    questionHeader.innerHTML = "Step Three";
    if (progressCount !== 100) progressCount = 50;
    if (progressCount === 100) questionProgress.classList.add("full");
    questionProgress.style.width = progressCount + "%";
    return;
  }

  // show question three
  if (step === 3) {
    if (responses.three.length === 0) {
      showAlert("Please select one or more other favourite stack");
      return;
    }

    // hide question two
    questionThree.classList.add("hide");
    // show question four
    questionFour.classList.remove("hide");

    step = 4;
    questionHeader.innerHTML = "Step Four";
    if (progressCount !== 100) progressCount = 75;
    questionProgress.style.width = progressCount + "%";
    return;
  }

  // show question four
  if (step === 4) {
    if (
      !questionFourRes.value.trim() ||
      !emailRegex.test(questionFourRes.value.trim())
    ) {
      showAlert("Please enter a valid email address");
      return;
    }

    // store email in responses
    responses.four = questionFourRes.value.trim();

    // hide question two
    questionFour.classList.add("hide");
    // show summary
    summary.classList.remove("hide");

    if (progressCount !== 100) progressCount = 100;
    if (progressCount === 100) questionProgress.classList.add("full");
    questionProgress.style.width = progressCount + "%";
  }

  // generating custom responses
  const customRes = {
    "Favourite Track": responses.one,
    "Favourite Stack": responses.two,
    "Others Favourites": responses.three,
    Email: responses.four,
  };

  // show summary page
  document.getElementById("summaryData").innerHTML = JSON.stringify(
    customRes,
    null,
    2
  );

  document.querySelector(".question-header").classList.add("hide");
  document.querySelector(".question-footer").classList.add("hide");
});

prevBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (step === 2) {
    // hide question 2 and show 1
    questionTwo.classList.add("hide");
    questionOne.classList.remove("hide");
    step = 1;
    // hide prev button
    prevBtn.style.visibility = "hidden";
    if (progressCount !== 0) progressCount -= 25;
  }

  if (step === 3) {
    // hide question 3 and show 2
    questionThree.classList.add("hide");
    questionTwo.classList.remove("hide");
    step = 2;
    if (progressCount !== 0) progressCount -= 25;
  }

  if (step === 4) {
    // hide question 4 and show 3
    questionFour.classList.add("hide");
    questionThree.classList.remove("hide");
    step = 3;
    if (progressCount !== 0) progressCount -= 25;
  }

  questionProgress.style.width = progressCount + "%";
});
