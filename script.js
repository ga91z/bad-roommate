function playSound(type = 'click') {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'click') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
        
    } else if (type === 'close') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.08);
    }
}

function fadeIn(element, duration = 300) {
    element.style.display = 'block';
    element.classList.remove('hide');
    element.classList.add('show');
    
    showBackdrop();
    
    setTimeout(() => {
        element.classList.remove('show');
        element.style.opacity = '1';
        element.style.transform = 'translate(-50%, -50%) scale(1)';
    }, duration);
}

function fadeOut(element, duration = 250) {
    element.classList.remove('show');
    element.classList.add('hide');
    
    setTimeout(() => {
        element.style.display = 'none';
        element.classList.remove('hide');
        
        if (!hasOpenPopups()) {
            hideBackdrop();
        }
    }, duration);
}

function fadeToggle(element) {
    const isVisible = window.getComputedStyle(element).display !== 'none';
    
    if (isVisible) {
        fadeOut(element);
    } else {
        fadeIn(element);
    }
}

const navButtons = document.querySelectorAll('.window');

let backdrop = null;


function showBackdrop() {
    if (backdrop) {
        backdrop.style.display = 'block';
        backdrop.classList.remove('hide');
        backdrop.classList.add('show');
    }
}

function hideBackdrop() {
    if (backdrop) {
        backdrop.classList.remove('show');
        backdrop.classList.add('hide');
        setTimeout(() => {
            backdrop.style.display = 'none';
            backdrop.classList.remove('hide');
        }, 250);
    }
}

function hasOpenPopups() {
    const popups = document.querySelectorAll('#About, #Gallery, #Info, #Download');
    return Array.from(popups).some(popup => window.getComputedStyle(popup).display !== 'none');
}

document.addEventListener('DOMContentLoaded', () => {
    const popups = document.querySelectorAll('#About, #Gallery, #Info, #Download');
    popups.forEach(popup => {
        popup.style.display = 'none';
        popup.style.position = 'fixed';
        popup.style.zIndex = '1000';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
    });
});

navButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        playSound('click');
        
        // Add click animation to the button
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 300);
        
        const buttonText = button.querySelector('.nav-btn').textContent.trim();
        const popupId = buttonText;
        const popup = document.getElementById(popupId);
        
        if (popup) {
            fadeToggle(popup);
            if (window.getComputedStyle(popup).display !== 'none') {
                bringToFront(popup);
            }
        }
    });
});

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;
    let hasBeenDragged = false;
    const header = element.querySelector('.card-header');
    
    if (header) {
        header.style.cursor = 'move';
        header.onmousedown = dragMouseDown;
    }
    
    function dragMouseDown(e) {
        // Don't start dragging if the click was on the close button
        if (e.target.closest('.xp-close')) {
            return;
        }
        
        e.preventDefault();
        
        if (!hasBeenDragged && element.style.transform === 'translate(-50%, -50%)') {
            const rect = element.getBoundingClientRect();
            element.style.left = rect.left + 'px';
            element.style.top = rect.top + 'px';
            element.style.transform = 'none';
            hasBeenDragged = true;
        }
        
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        isDragging = true;
        
        bringToFront(element);
    }
    
    function elementDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        isDragging = false;
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

let highestZIndex = 1000;
function bringToFront(element) {
    highestZIndex++;
    element.style.zIndex = highestZIndex;
}

function wireCloseButton(popup) {
    const closeBtn = popup.querySelector('.xp-close');
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            playSound('close');
            fadeOut(popup);
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const popups = document.querySelectorAll('#About, #Gallery, #Info, #Download');
    popups.forEach(popup => {
        makeDraggable(popup);
        wireCloseButton(popup);
    });
});

function handleDownload() {
    playSound('click');
    const link = document.createElement('a');
    link.href = '/home/ahmed/bad-roommate-master/idk lol';
    link.download = 'BadRoommate.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ========== Gallery Lightbox ==========
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const downloadBtn = document.getElementById('downloadBtn');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    let currentSrc = '';

    // Open lightbox when clicking any gallery image
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            playSound('click');
            currentSrc = img.src;
            lightboxImg.src = currentSrc;
            lightbox.classList.add('show');
        });
    });

    // Close lightbox
    function closeLightbox() {
        playSound('close');
        lightbox.classList.remove('show');
        lightboxImg.src = '';
    }

    closeBtn.addEventListener('click', closeLightbox);

    // Close when clicking the dark background
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('show')) {
            closeLightbox();
        }
    });

// Download the current image (more reliable method)
downloadBtn.addEventListener('click', async () => {
    playSound('click');
    if (!currentSrc) return;

    try {
        const response = await fetch(currentSrc);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        // Get filename from the path
        const filename = currentSrc.split('/').pop().split('?')[0] || 'artwork.png';
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
        console.error('Download failed:', err);
        // Fallback: open in new tab if fetch fails
        window.open(currentSrc, '_blank');
    }
});
});
