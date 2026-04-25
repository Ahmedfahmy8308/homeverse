document.addEventListener("DOMContentLoaded", () => {
  const propertyCards = document.querySelectorAll(".property-card");

  propertyCards.forEach((card) => {
    // We use the image source filename as a unique ID for the property
    const imgElement = card.querySelector(".card-banner img");
    if (!imgElement) return;

    // Extract filename (e.g., "property-listing-1.jpg")
    const imgSrc = imgElement.getAttribute("src");
    const propertyId = imgSrc.split("/").pop();

    // Select buttons
    const btns = card.querySelectorAll(".card-footer-actions-btn");
    
    // We expect 3 buttons: resize, heart, add-circle
    const resizeBtn = btns[0];
    const heartBtn = btns[1];
    const addBtn = btns[2];

    if (!heartBtn || !addBtn) return;

    // --- HEART BUTTON LOGIC (Favorites) ---
    const heartIcon = heartBtn.querySelector("ion-icon");
    const favoriteKey = "fav_" + propertyId;

    // Load state
    if (localStorage.getItem(favoriteKey) === "true") {
      heartIcon.setAttribute("name", "heart");
      heartBtn.classList.add("active");
      heartIcon.style.color = "#ff5a3c"; // Optional: make it red
    }

    heartBtn.addEventListener("click", () => {
      const isFav = localStorage.getItem(favoriteKey) === "true";
      if (isFav) {
        localStorage.removeItem(favoriteKey);
        heartIcon.setAttribute("name", "heart-outline");
        heartBtn.classList.remove("active");
        heartIcon.style.color = "";
      } else {
        localStorage.setItem(favoriteKey, "true");
        heartIcon.setAttribute("name", "heart");
        heartBtn.classList.add("active");
        heartIcon.style.color = "#ff5a3c";
      }
    });

    // --- ADD BUTTON LOGIC (Compare / List) ---
    const addIcon = addBtn.querySelector("ion-icon");
    const addKey = "add_" + propertyId;

    if (localStorage.getItem(addKey) === "true") {
      addIcon.setAttribute("name", "checkmark-circle");
      addBtn.classList.add("active");
      addIcon.style.color = "#28a745"; // green
    }

    addBtn.addEventListener("click", () => {
      const isAdded = localStorage.getItem(addKey) === "true";
      if (isAdded) {
        localStorage.removeItem(addKey);
        addIcon.setAttribute("name", "add-circle-outline");
        addBtn.classList.remove("active");
        addIcon.style.color = "";
      } else {
        localStorage.setItem(addKey, "true");
        addIcon.setAttribute("name", "checkmark-circle");
        addBtn.classList.add("active");
        addIcon.style.color = "#28a745";
      }
    });

    // --- RESIZE BUTTON LOGIC (Preview Modal) ---
    if (resizeBtn) {
      resizeBtn.addEventListener("click", () => {
        // Visual feedback
        const resizeIcon = resizeBtn.querySelector("ion-icon");
        resizeIcon.style.color = "#ff5a3c";
        setTimeout(() => {
          resizeIcon.style.color = "";
        }, 300);

        // Check if modal already exists
        let modal = document.getElementById("property-image-modal");
        if (!modal) {
          // Create modal
          modal = document.createElement("div");
          modal.id = "property-image-modal";
          modal.style.position = "fixed";
          modal.style.top = "0";
          modal.style.left = "0";
          modal.style.width = "100vw";
          modal.style.height = "100vh";
          modal.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
          modal.style.display = "flex";
          modal.style.justifyContent = "center";
          modal.style.alignItems = "center";
          modal.style.zIndex = "9999";
          modal.style.opacity = "0";
          modal.style.transition = "opacity 0.3s ease";
          modal.style.cursor = "pointer"; // Close on click outside

          const modalImg = document.createElement("img");
          modalImg.id = "property-modal-img";
          modalImg.style.maxWidth = "90%";
          modalImg.style.maxHeight = "90%";
          modalImg.style.borderRadius = "10px";
          modalImg.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
          modalImg.style.transition = "transform 0.3s ease";
          modalImg.style.transform = "scale(0.8)";
          modalImg.style.cursor = "default";

          const closeBtn = document.createElement("button");
          closeBtn.innerHTML = "<ion-icon name='close-outline'></ion-icon>";
          closeBtn.style.position = "absolute";
          closeBtn.style.top = "20px";
          closeBtn.style.right = "30px";
          closeBtn.style.background = "none";
          closeBtn.style.border = "none";
          closeBtn.style.color = "white";
          closeBtn.style.fontSize = "40px";
          closeBtn.style.cursor = "pointer";
          
          modal.appendChild(modalImg);
          modal.appendChild(closeBtn);
          document.body.appendChild(modal);

          // Close modal functions
          const closeModal = () => {
            modal.style.opacity = "0";
            modalImg.style.transform = "scale(0.8)";
            setTimeout(() => {
              modal.style.display = "none";
            }, 300);
          };

          modal.addEventListener("click", (e) => {
            if (e.target === modal || e.target === closeBtn || closeBtn.contains(e.target)) {
              closeModal();
            }
          });
        }

        // Show modal with the current image
        const modalImg = document.getElementById("property-modal-img");
        modalImg.src = imgSrc;
        
        modal.style.display = "flex";
        // Small delay to allow display block to render before transition
        setTimeout(() => {
          modal.style.opacity = "1";
          modalImg.style.transform = "scale(1)";
        }, 10);
      });
    }
  });
});
