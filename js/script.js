const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {
    counter.innerText = '0';

    const updateCounter = () => {
        const target = +counter.getAttribute('data-target');
        const current = +counter.innerText;

        const increment = target / 100;

        if(current < target){
            counter.innerText = Math.ceil(current + increment);
            setTimeout(updateCounter, 30);
        } else {
            counter.innerText = target;
        }
    }

    updateCounter();
});

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
});

window.addEventListener("scroll", () => {
    const header = document.querySelector("header");

    if(window.scrollY > 50){
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});


// ===========================
// Contact Form Submit
// ===========================

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const contactData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        service: document.getElementById("service").value,
        message: document.getElementById("message").value
    };

    try {

        const response = await fetch("http://localhost:8080/api/contact", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(contactData)

        });

        if (response.ok) {

            alert("Message Sent Successfully ✅");

            contactForm.reset();

        } else {

            alert("Something went wrong ❌");

        }

    } catch (error) {

        console.error(error);

        alert("Server Connection Failed ❌");

    }

});