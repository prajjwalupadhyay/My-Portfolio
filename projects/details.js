$(document).ready(function () {
  // Parse project ID from URL query param
  const urlParams = new URLSearchParams(window.location.search);
  const projectIdParam = urlParams.get("id");

  // Scroll to top button toggle
  $(window).on("scroll load", function () {
    if (window.scrollY > 60) {
      document.querySelector("#scroll-top")?.classList.add("active");
    } else {
      document.querySelector("#scroll-top")?.classList.remove("active");
    }
  });

  // Fetch projects data
  fetch("projects.json")
    .then((res) => res.json())
    .then((projects) => {
      let project = null;

      if (projectIdParam !== null) {
        // Try match by id property first
        project = projects.find((p) => String(p.id) === String(projectIdParam));

        // If not found, try match by numeric array index
        if (!project && !isNaN(projectIdParam)) {
          const idx = parseInt(projectIdParam, 10);
          if (idx >= 0 && idx < projects.length) {
            project = projects[idx];
          }
        }
      }

      // Default to first project if invalid or missing parameter
      if (!project && projects.length > 0) {
        project = projects[0];
      }

      if (project) {
        renderProjectDetails(project);
      }
    })
    .catch((err) => {
      console.error("Error loading project details:", err);
      $("#project-title").text("Project Not Found");
      $("#project-desc").text("Unable to load project information.");
    });

  function renderProjectDetails(project) {
    // 1. Set Title & Document Page Title
    document.title = `${project.name} | Project Details`;
    $("#project-title").text(project.name);

    // 2. Set Category Badge
    const categoryMap = {
      mern: "MERN Stack",
      lamp: "LAMP Stack",
      basicweb: "Basic Web Development",
      android: "Android App",
    };
    const categoryText = categoryMap[project.category] || project.category || "Web App";
    $("#project-category").text(categoryText);

    // 3. Set Description
    const fullDescription = project.fullDesc || project.desc || "No description provided.";
    $("#project-desc").text(fullDescription);

    // 4. Set Action Buttons
    const viewUrl = project.links && project.links.view && project.links.view.trim() !== "" ? project.links.view : "#";
    const codeUrl = project.links && project.links.code && project.links.code.trim() !== "" ? project.links.code : "#";

    const $liveBtn = $("#live-demo-btn");
    const $codeBtn = $("#view-code-btn");

    if (viewUrl === "#") {
      $liveBtn.addClass("disabled").css("opacity", "0.6").attr("href", "javascript:void(0);");
    } else {
      $liveBtn.attr("href", viewUrl);
    }

    if (codeUrl === "#") {
      $codeBtn.addClass("disabled").css("opacity", "0.6").attr("href", "javascript:void(0);");
    } else {
      $codeBtn.attr("href", codeUrl);
    }

    // 5. Render GitHub Language Usage Meter
    renderLanguageMeter(project.languages);

    // 6. Setup Image Slideshow (4-second interval)
    let images = [];
    if (Array.isArray(project.images) && project.images.length > 0) {
      images = project.images;
    } else if (project.image && project.image.trim() !== "") {
      images = [project.image];
    } else {
      images = ["/assets/images/cmsoon.png"];
    }

    // Resolve image paths if relative
    images = images.map((img) => {
      if (img.startsWith("http") || img.startsWith("/") || img.startsWith("./") || img.startsWith("../")) {
        return img;
      }
      return `/assets/images/projects/${img}.png`;
    });

    setupSlideshow(images);
  }

  // GitHub Language Usage Meter Render Function
  function renderLanguageMeter(languages) {
    const $meterBar = $("#meter-bar");
    const $meterLegend = $("#meter-legend");

    $meterBar.empty();
    $meterLegend.empty();

    if (!Array.isArray(languages) || languages.length === 0) {
      // Fallback default languages if none specified
      languages = [
        { name: "JavaScript", percent: 60, color: "#f1e05a" },
        { name: "HTML", percent: 25, color: "#e34c26" },
        { name: "CSS", percent: 15, color: "#563d7c" },
      ];
    }

    let barHTML = "";
    let legendHTML = "";

    languages.forEach((lang) => {
      barHTML += `<div class="meter-segment" style="width: 0%; background-color: ${lang.color};" title="${lang.name}: ${lang.percent}%" data-percent="${lang.percent}%"></div>`;
      legendHTML += `
        <div class="legend-item">
          <span class="legend-dot" style="background-color: ${lang.color};"></span>
          <span class="legend-name">${lang.name}</span>
          <span class="legend-percent">${lang.percent}%</span>
        </div>
      `;
    });

    $meterBar.html(barHTML);
    $meterLegend.html(legendHTML);

    // Animate meter bars on page load
    setTimeout(() => {
      $meterBar.find(".meter-segment").each(function () {
        const targetPercent = $(this).attr("data-percent");
        $(this).css("width", targetPercent);
      });
    }, 150);
  }

  // Slideshow Setup with 4-second Auto Play Interval
  function setupSlideshow(images) {
    const $container = $("#slideshow-container");
    const $indicators = $("#slide-indicators");

    $container.empty();
    $indicators.empty();

    images.forEach((imgUrl, index) => {
      const activeClass = index === 0 ? "active" : "";
      $container.append(`
        <div class="slide ${activeClass}" data-slide="${index}">
          <img src="${imgUrl}" alt="Project screenshot ${index + 1}" draggable="false" />
        </div>
      `);

      $indicators.append(`
        <span class="indicator-dot ${activeClass}" data-slide="${index}"></span>
      `);
    });

    let currentSlide = 0;
    const totalSlides = images.length;
    let slideTimer = null;
    const SLIDE_INTERVAL = 4000; // 4 Seconds Interval as requested

    function goToSlide(slideIndex) {
      if (slideIndex < 0) {
        slideIndex = totalSlides - 1;
      } else if (slideIndex >= totalSlides) {
        slideIndex = 0;
      }

      currentSlide = slideIndex;

      $container.find(".slide").removeClass("active");
      $container.find(`.slide[data-slide="${currentSlide}"]`).addClass("active");

      $indicators.find(".indicator-dot").removeClass("active");
      $indicators.find(`.indicator-dot[data-slide="${currentSlide}"]`).addClass("active");
    }

    function startTimer() {
      if (totalSlides > 1) {
        stopTimer();
        slideTimer = setInterval(() => {
          goToSlide(currentSlide + 1);
        }, SLIDE_INTERVAL);
      }
    }

    function stopTimer() {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    }

    // Event Handlers for Slideshow Controls
    $("#next-slide").off("click").on("click", function () {
      goToSlide(currentSlide + 1);
      startTimer();
    });

    $("#prev-slide").off("click").on("click", function () {
      goToSlide(currentSlide - 1);
      startTimer();
    });

    $indicators.on("click", ".indicator-dot", function () {
      const idx = parseInt($(this).attr("data-slide"), 10);
      goToSlide(idx);
      startTimer();
    });

    // Pause on hover over slideshow wrapper
    $("#slideshow-wrapper").hover(
      function () {
        stopTimer();
      },
      function () {
        startTimer();
      }
    );

    // Initialize timer
    startTimer();
  }
});
