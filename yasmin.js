
import * as THREE from "three";

/* =========================================
   1. THREE.JS 3D BACKGROUND
========================================= */

const container = document.getElementById("three-container");

let scene;
let camera;
let renderer;
let crystal;
let particles;
let animationFrameId;

let mouseX = 0;
let mouseY = 0;

let targetMouseX = 0;
let targetMouseY = 0;

let crystalMaterial;
let particleMaterial;

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


function createThreeScene() {

    if (!container) {
        return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width === 0 || height === 0) {
        return;
    }

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        45,
        width / height,
        0.1,
        1000
    );

    camera.position.z = 6;


    /* Renderer */

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 1.5)
    );

    renderer.setSize(width, height);

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);


    /* Lighting */

    const ambientLight = new THREE.AmbientLight(
        0x8b5cf6,
        2
    );

    scene.add(ambientLight);


    const purpleLight = new THREE.PointLight(
        0xa855f7,
        40,
        20
    );

    purpleLight.position.set(3, 3, 4);

    scene.add(purpleLight);


    const blueLight = new THREE.PointLight(
        0x38bdf8,
        30,
        20
    );

    blueLight.position.set(-3, -2, 3);

    scene.add(blueLight);


    /* Main crystal geometry */

    const crystalGeometry = new THREE.IcosahedronGeometry(
        1.45,
        1
    );


    /* Crystal material */

    crystalMaterial = new THREE.MeshStandardMaterial({
        color: 0x9d4edd,
        metalness: 0.65,
        roughness: 0.25,
        flatShading: true,
        emissive: 0x241044,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.88
    });


    crystal = new THREE.Mesh(
        crystalGeometry,
        crystalMaterial
    );

    scene.add(crystal);


    /* Wireframe around crystal */

    const wireGeometry = new THREE.IcosahedronGeometry(
        1.49,
        1
    );

    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x67e8f9,
        wireframe: true,
        transparent: true,
        opacity: 0.45
    });

    const wireCrystal = new THREE.Mesh(
        wireGeometry,
        wireMaterial
    );

    crystal.add(wireCrystal);


    /* Inner crystal */

    const innerGeometry = new THREE.IcosahedronGeometry(
        0.62,
        0
    );

    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0xc084fc,
        wireframe: true,
        transparent: true,
        opacity: 0.75
    });

    const innerCrystal = new THREE.Mesh(
        innerGeometry,
        innerMaterial
    );

    crystal.add(innerCrystal);


    /* Orbital ring */

    const ringGeometry = new THREE.TorusGeometry(
        2,
        0.008,
        8,
        120
    );

    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x818cf8,
        transparent: true,
        opacity: 0.65
    });

    const ring = new THREE.Mesh(
        ringGeometry,
        ringMaterial
    );

    ring.rotation.x = Math.PI / 2.6;
    ring.rotation.y = Math.PI / 5;

    crystal.add(ring);


    /* Small orbiting sphere */

    const sphereGeometry = new THREE.SphereGeometry(
        0.09,
        16,
        16
    );

    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x67e8f9
    });

    const orbitSphere = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
    );

    orbitSphere.position.set(1.8, 0.4, 0);

    crystal.add(orbitSphere);


    /* Particle system */

    const particleCount = 600;

    const particlePositions = new Float32Array(
        particleCount * 3
    );

    const particleColors = new Float32Array(
        particleCount * 3
    );

    for (let i = 0; i < particleCount; i++) {

        const index = i * 3;

        particlePositions[index] =
            (Math.random() - 0.5) * 9;

        particlePositions[index + 1] =
            (Math.random() - 0.5) * 9;

        particlePositions[index + 2] =
            (Math.random() - 0.5) * 5;


        const useBlue = Math.random() > 0.5;

        if (useBlue) {

            particleColors[index] = 0.22;
            particleColors[index + 1] = 0.74;
            particleColors[index + 2] = 0.97;

        } else {

            particleColors[index] = 0.66;
            particleColors[index + 1] = 0.33;
            particleColors[index + 2] = 0.97;

        }
    }


    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(particlePositions, 3)
    );

    particleGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(particleColors, 3)
    );


    particleMaterial = new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
        depthWrite: false
    });


    particles = new THREE.Points(
        particleGeometry,
        particleMaterial
    );

    scene.add(particles);


    /* Start animation */

    animate();
}


/* =========================================
   2. ANIMATION LOOP
========================================= */

function animate() {

    animationFrameId = requestAnimationFrame(animate);

    if (!renderer || !scene || !camera) {
        return;
    }

    if (!reducedMotion) {

        mouseX += (targetMouseX - mouseX) * 0.035;
        mouseY += (targetMouseY - mouseY) * 0.035;


        if (crystal) {

            crystal.rotation.y += 0.003;
            crystal.rotation.x += 0.0015;

            crystal.rotation.y += mouseX * 0.0008;
            crystal.rotation.x += mouseY * 0.0008;
        }


        if (particles) {

            particles.rotation.y += 0.00025;
            particles.rotation.x += 0.00012;
        }

    }

    renderer.render(scene, camera);
}


/* =========================================
   3. HANDLE WINDOW RESIZE
========================================= */

function resizeThreeScene() {

    if (!container || !renderer || !camera) {
        return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width === 0 || height === 0) {
        return;
    }

    camera.aspect = width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}


window.addEventListener(
    "resize",
    resizeThreeScene
);


/* =========================================
   4. MOUSE MOVEMENT
========================================= */

document.addEventListener("mousemove", function (event) {

    targetMouseX =
        (event.clientX / window.innerWidth - 0.5) * 2;

    targetMouseY =
        (event.clientY / window.innerHeight - 0.5) * 2;

});


/* =========================================
   5. TYPING ANIMATION
========================================= */

const typingText = document.getElementById("typingText");

const roles = [
    "Full Stack Developer",
    "Python Developer",
    "Problem Solver",
    "AI Enthusiast"
];

let roleIndex = 0;
let characterIndex = 0;
let deleting = false;


function typeRole() {

    if (!typingText) {
        return;
    }

    if (reducedMotion) {

        typingText.textContent = roles[0];

        return;
    }

    const currentRole = roles[roleIndex];

    if (deleting) {

        characterIndex--;

    } else {

        characterIndex++;

    }


    typingText.textContent = currentRole.substring(
        0,
        characterIndex
    );


    let delay = deleting ? 45 : 85;


    if (!deleting && characterIndex === currentRole.length) {

        deleting = true;

        delay = 1300;

    } else if (deleting && characterIndex === 0) {

        deleting = false;

        roleIndex = (roleIndex + 1) % roles.length;

        delay = 400;

    }


    setTimeout(typeRole, delay);
}


typeRole();


/* =========================================
   6. MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menuToggle");

const navLinks = document.getElementById("navLinks");

const navItems = document.querySelectorAll(".nav-link");


if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";

    });


    navItems.forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.textContent = "☰";

        });

    });

}


/* =========================================
   7. ACTIVE NAVIGATION LINK
========================================= */

const observedSections = document.querySelectorAll(
    "main section[id]"
);


if ("IntersectionObserver" in window) {

    const navObserver = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    const currentId = entry.target.id;

                    navItems.forEach(function (link) {

                        link.classList.remove("active");

                        if (
                            link.getAttribute("href") ===
                            "#" + currentId
                        ) {

                            link.classList.add("active");

                        }

                    });

                }

            });

        },
        {
            rootMargin: "-30% 0px -55% 0px"
        }
    );


    observedSections.forEach(function (section) {

        navObserver.observe(section);

    });

}


/* =========================================
   8. SCROLL REVEAL ANIMATION
========================================= */

const revealElements = document.querySelectorAll(
    ".section-heading, .about-card, .stat-card, " +
    ".experience-card, .skill-category, .project-card, " +
    ".resume-card, .contact-card"
);


revealElements.forEach(function (element) {

    element.classList.add("reveal");

});


if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12
        }
    );


    revealElements.forEach(function (element) {

        revealObserver.observe(element);

    });

} else {

    revealElements.forEach(function (element) {

        element.classList.add("visible");

    });

}


/* =========================================
   9. CONTACT FORM
========================================= */

const contactForm = document.getElementById("contactForm");

const formStatus = document.getElementById("formStatus");


if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document
            .getElementById("name")
            .value.trim();

        const email = document
            .getElementById("email")
            .value.trim();

        const message = document
            .getElementById("message")
            .value.trim();


        if (!name || !email || !message) {

            if (formStatus) {

                formStatus.textContent =
                    "Please fill in all fields.";

            }

            return;
        }


        /*
          This opens the visitor's email application.
          Replace this address with your real email address.
          The form does not send messages to a server.
        */

        const yourEmail = "your-email@example.com";

        const subject = encodeURIComponent(
            "Portfolio Contact from " + name
        );

        const body = encodeURIComponent(
            "Name: " + name +
            "\nEmail: " + email +
            "\n\nMessage:\n" + message
        );

        const mailtoLink =
            "mailto:" + yourEmail +
            "?subject=" + subject +
            "&body=" + body;


        if (formStatus) {

            formStatus.textContent =
                "Opening your email application...";

        }

        window.location.href = mailtoLink;

    });

}


/* =========================================
   10. CLEANUP
========================================= */

window.addEventListener("beforeunload", function () {

    if (animationFrameId) {

        cancelAnimationFrame(animationFrameId);

    }

    if (renderer) {

        renderer.dispose();

    }

});


/* =========================================
   11. INITIALIZE THREE.JS
========================================= */

if (container) {

    if (container.clientWidth > 0) {

        createThreeScene();

    } else {

        window.addEventListener(
            "load",
            createThreeScene,
            { once: true }
        );

    }

}
