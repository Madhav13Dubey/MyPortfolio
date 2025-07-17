// Typewriter Effect

document.addEventListener("DOMContentLoaded", function () {
    const words = ["Web Developer","Competitive Programmer","AIML Enthusiast"];
    const element = document.querySelector(".header-text p");
    let wordIndex = 0;
    let charIndex = 0;

    function typeWriter() {
        if (charIndex < words[wordIndex].length) {
            element.innerHTML += words[wordIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        } else {
            setTimeout(eraseText, 1000); // Wait before erasing
        }
    }

    function eraseText() {
        if (charIndex > 0) {
            element.innerHTML = words[wordIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(eraseText, 50);
        } else {
            wordIndex = (wordIndex + 1) % words.length; // Move to next word
            setTimeout(typeWriter, 500);
        }
    }

    element.innerHTML = ""; // Clear existing content
    typeWriter();
});

// Open and Close Menu Functions
function openmenu() {
    document.getElementById("sidemenu").style.right = "0";
}

function closemenu() {
    document.getElementById("sidemenu").style.right = "-200px";
}

// Tab Switching Functionality
function opentab(tabname) {
    let tablinks = document.getElementsByClassName("tab-links");
    let tabcontents = document.getElementsByClassName("tab-contents");

    for (let link of tablinks) {
        link.classList.remove("active-link");
    }
    for (let content of tabcontents) {
        content.classList.remove("active-tab");
    }

    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}