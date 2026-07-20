document.addEventListener('DOMContentLoaded', () => {
    initScrollSpy();
    initScrollAnimations();
    initNativeCarousel();
    initCertAutoScroll();
    initYear();
    fetchDynamicData();
});

window.addEventListener('load', () => {
    // Minimum load time for preloader
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
    }, 3500);
});

/* Navigation Scroll Spy */
function initScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.target === id) {
                        link.classList.add('active');
                        // Scroll active link into view on mobile (bottom nav)
                        if (window.innerWidth <= 768) {
                            link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                        }
                    }
                });
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

    sections.forEach(sec => observer.observe(sec));
}

/* Scroll Reveals */
function initScrollAnimations() {
    const animElements = document.querySelectorAll('.reveal-wipe, .section-line, .fade-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '0px 200px -50px 0px' });

    animElements.forEach(el => observer.observe(el));
}

function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* Native Carousel */
function initNativeCarousel() {
    const track = document.getElementById('projects-carousel');
    if (!track) return;

    // Desktop controls
    const prevBtnDesk = document.querySelector('.carousel-controls:not(.mobile-controls) .prev-btn');
    const nextBtnDesk = document.querySelector('.carousel-controls:not(.mobile-controls) .next-btn');
    
    // Mobile controls
    const prevBtnMob = document.querySelector('.mobile-controls .prev-btn');
    const nextBtnMob = document.querySelector('.mobile-controls .next-btn');

    const getScrollAmount = () => {
        const slide = track.querySelector('.carousel-slide');
        if (!slide) return 300;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 32;
        return slide.offsetWidth + gap;
    };

    const scrollLeft = () => track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    const scrollRight = () => track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });

    if (prevBtnDesk) prevBtnDesk.addEventListener('click', scrollLeft);
    if (nextBtnDesk) nextBtnDesk.addEventListener('click', scrollRight);
    if (prevBtnMob) prevBtnMob.addEventListener('click', scrollLeft);
    if (nextBtnMob) nextBtnMob.addEventListener('click', scrollRight);
}

/* Certifications Auto-Scroll */
function initCertAutoScroll() {
    const certBox = document.querySelector('.certifications-scroll-box');
    if (!certBox) return;

    let autoScrollTimer;
    let isUserScrolling = false;

    // Start auto scrolling very slowly when section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isUserScrolling) startAutoScroll();
            } else {
                stopAutoScroll();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(certBox);

    const startAutoScroll = () => {
        autoScrollTimer = setInterval(() => {
            if (!isUserScrolling && certBox.scrollTop < (certBox.scrollHeight - certBox.clientHeight)) {
                certBox.scrollBy({ top: 1, behavior: 'auto' });
            }
        }, 50); // Very slow
    };

    const stopAutoScroll = () => {
        clearInterval(autoScrollTimer);
    };

    // If user touches or wheels, pause auto scroll for 5 seconds
    const pauseAutoScroll = () => {
        isUserScrolling = true;
        stopAutoScroll();
        clearTimeout(certBox.resumeTimer);
        certBox.resumeTimer = setTimeout(() => {
            isUserScrolling = false;
            startAutoScroll();
        }, 5000);
    };

    certBox.addEventListener('wheel', pauseAutoScroll, { passive: true });
    certBox.addEventListener('touchmove', pauseAutoScroll, { passive: true });
    certBox.addEventListener('mousedown', pauseAutoScroll, { passive: true });
}

/* Data Fetching Engine */
const GOOGLE_SHEET_ID = "18zxQWlRN2uHHeII_DIQeFf_hKSbb0DPgpHc05s3rrLs";
const API_BASE = `https://opensheet.elk.sh/${GOOGLE_SHEET_ID}`;

const FALLBACK_DATA = {
    experience: [
        { role: "Technical Product Manager", company: "nodedCode Studio", period: "Jun 2025 - Present", description: "Directing an agency focused on high-impact solutions. Leveraging AI to accelerate full-stack prototyping." }
    ],
    education: [
        { degree: "B.S. Computer Science", school: "University of the People", year: "GPA 4.0" }
    ],
    projects: [
        { title: "Wait, What Day?", description: "A minimalist calendar utility. Designed with a focus on cognitive ease and typographic hierarchy.", code: "#", demo: "#" }
    ],
    skills: ["SOLIDITY","WEB APP","ANDROID DEVELOPMENT"],
    certifications: [
        { title: "Government Accredited Freelancer", issuer: "Freelancers Bangladesh", link: "#" }
    ],
    connect: [
        { platform: "Email", url: "mailto:sejabur.rahat@proton.me" },
        { platform: "Resume", url: "https://github.com/Sejabur/sejabur.github.io/blob/main/Universal%20CV.pdf" },
        { platform: "Github", url: "https://github.com/Sejabur" },
        { platform: "Linkedin", url: "https://www.linkedin.com/in/md-sejabur-rahat/" },
        { platform: "NodedCode", url: "https://nodedcode.studio/" },
        { platform: "Upwork", url: "https://www.upwork.com/freelancers/~01ef6e44200861a5e2" }
    ]
};

async function fetchSheetData(sheetName) {
    if (GOOGLE_SHEET_ID === "YOUR_GOOGLE_SHEET_ID_HERE") throw new Error("Placeholder ID");
    const response = await fetch(`${API_BASE}/${sheetName}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

async function fetchDynamicData() {
    try {
        const [exp, edu, proj, skills, certs, connect] = await Promise.all([
            fetchSheetData('Experience').catch(() => FALLBACK_DATA.experience),
            fetchSheetData('Education').catch(() => FALLBACK_DATA.education),
            fetchSheetData('Projects').catch(() => FALLBACK_DATA.projects),
            fetchSheetData('Skills').catch(() => FALLBACK_DATA.skills.map(s => ({ skill: s }))),
            fetchSheetData('Certifications').catch(() => FALLBACK_DATA.certifications),
            fetchSheetData('Connect').catch(() => FALLBACK_DATA.connect)
        ]);

        renderExperience(exp);
        renderEducation(edu);
        renderProjects(proj);
        renderSkills(skills);
        renderCertifications(certs);
        renderConnect(connect);

    } catch (error) {
        console.warn("Using fallback data.");
        renderExperience(FALLBACK_DATA.experience);
        renderEducation(FALLBACK_DATA.education);
        renderProjects(FALLBACK_DATA.projects);
        renderSkills(FALLBACK_DATA.skills.map(s => ({ skill: s })));
        renderCertifications(FALLBACK_DATA.certifications);
        renderConnect(FALLBACK_DATA.connect);
    }
    
    // Re-trigger visual observers
    setTimeout(() => {
        initScrollAnimations();
        initNativeCarousel();
        initCertAutoScroll();
    }, 100);
}

/* Render Functions */

function renderExperience(data) {
    const container = document.getElementById('experience-container');
    if (!container) return;
    
    container.innerHTML = data.map((item, idx) => `
        <div class="cyber-card fade-up" style="--delay: ${idx * 0.1}s">
            <div class="card-meta">
                <span class="highlight">${item.period || item.Period}</span>
                <span>// ${item.company || item.Company}</span>
            </div>
            <h3 class="card-title pixel-font">${item.role || item.Role}</h3>
            <p class="card-desc">${item.description || item.Description}</p>
        </div>
    `).join('');
}

function renderEducation(data) {
    const container = document.getElementById('education-container');
    if (!container) return;

    container.innerHTML = data.map((item, idx) => {
        const title = item.degree || item.Degree || item.title || item.Title || '';
        const desc = item.school || item.School || item.description || item.Description || '';
        const extra = item.year || item.Year;
        const extraText = extra ? ` [${extra}]` : '';
        
        return `
        <div class="list-item fade-up" style="--delay: ${idx * 0.1}s">
            <h4>${title}</h4>
            <span>${desc}${extraText}</span>
        </div>
        `;
    }).join('');
}

function renderProjects(data) {
    const container = document.getElementById('projects-carousel');
    if (!container) return;

    container.innerHTML = data.map((item, idx) => `
        <div class="carousel-slide cyber-card fade-up" style="--delay: ${idx * 0.1}s">
            <h3 class="card-title pixel-font glitch-hover" style="display:inline-block">${item.title || item.Title}</h3>
            <p class="card-desc">${item.description || item.Description}</p>
            <div class="card-links">
                <a href="${item.code || item.Code || '#'}" target="_blank">_code</a>
                <a href="${item.demo || item.Demo || '#'}" target="_blank">_live</a>
            </div>
        </div>
    `).join('');
}

function renderSkills(data) {
    const container = document.getElementById('skills-track');
    if (!container) return;
    
    // Double the skills list to ensure seamless marquee loop
    const skillsList = data.map(item => item.skill || item.Skill || item);
    const doubled = [...skillsList, ...skillsList, ...skillsList];

    container.innerHTML = doubled.map((skill) => `
        <span class="skill-tag">${skill}</span>
    `).join('');
}

function renderCertifications(data) {
    const container = document.getElementById('certifications-container');
    if (!container) return;

    container.innerHTML = data.map((item, idx) => `
        <div class="list-item fade-up" style="--delay: ${idx * 0.05}s">
            <div class="cert-header">
                <h4>${item.title || item.Title}</h4>
                <a href="${item.link || item.Link || '#'}" target="_blank" class="verify-btn">verify</a>
            </div>
            <span>Issued_By: ${item.issuer || item.Issuer}</span>
        </div>
    `).join('');
}

function renderConnect(data) {
    const primary = document.getElementById('connect-primary');
    const secondary = document.getElementById('connect-secondary');
    if (!primary || !secondary) return;

    let emailUrl = "mailto:sejabur.rahat@proton.me";
    let resumeUrl = "#";
    let githubUrl = "#";
    let linkedinUrl = "#";
    let nodedcodeUrl = "#";
    let upworkUrl = "#";

    data.forEach(item => {
        const plat = (item.platform || item.Platform || "").toLowerCase();
        const link = item.url || item.Url || item.Link || item.link || "#";
        if (plat.includes("email")) emailUrl = link;
        else if (plat.includes("resume")) resumeUrl = link;
        else if (plat.includes("github")) githubUrl = link;
        else if (plat.includes("linkedin")) linkedinUrl = link;
        else if (plat.includes("nodedcode")) nodedcodeUrl = link;
        else if (plat.includes("upwork")) upworkUrl = link;
    });

    primary.innerHTML = `
        <a href="${emailUrl}" class="btn btn-primary glitch-hover">email me</a>
        <a href="${resumeUrl}" target="_blank" class="btn btn-primary glitch-hover">view resume</a>
    `;
    secondary.innerHTML = `
        <a href="${githubUrl}" target="_blank" class="btn btn-small">github</a>
        <a href="${linkedinUrl}" target="_blank" class="btn btn-small">linkedin</a>
        <a href="${nodedcodeUrl}" target="_blank" class="btn btn-small">nodedcode studio</a>
        <a href="${upworkUrl}" target="_blank" class="btn btn-small">upwork</a>
    `;
}
