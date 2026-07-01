document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  const navLinks = document.querySelectorAll("nav a[href^='#']");
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => link.classList.remove("active"));
            const activeLink = document.querySelector(`nav a[href="#${entry.target.id}"]`);
            if (activeLink) activeLink.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
  }

  const form = document.querySelector("#quote-form");
  const status = document.querySelector(".form-status");

  if (form && status) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitButton = form.querySelector("button[type='submit']");
      submitButton.disabled = true;
      status.classList.remove("success", "error");
      status.textContent = "Sending...";

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        const result = await response.json();

        if (result.success) {
          status.textContent = "Thanks! We'll call within one business day with your free estimate.";
          status.classList.add("success");
          form.reset();
        } else {
          status.textContent = "Something went wrong. Please call us instead at (555) 024-8391.";
          status.classList.add("error");
        }
      } catch (err) {
        status.textContent = "Something went wrong. Please call us instead at (555) 024-8391.";
        status.classList.add("error");
      } finally {
        submitButton.disabled = false;
      }
    });
  }
});
