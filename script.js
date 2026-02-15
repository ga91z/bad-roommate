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

function addCloseButton(popup) {
    const header = popup.querySelector('.card-header');
    if (header && !header.querySelector('.close-btn')) {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.className = 'close-btn';
        closeBtn.style.cssText = `
            position: absolute;
            right: 15px;
            top: 15px;
            background: none;
            border: none;
            font-size: 30px;
            cursor: pointer;
            color: inherit;
            line-height: 1;
            padding: 0;
            width: 30px;
            height: 30px;
            color: white;
        `;
        closeBtn.onclick = () => {
            playSound('close'); 
            fadeOut(popup);
        };
        header.style.position = 'relative';
        header.appendChild(closeBtn);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const popups = document.querySelectorAll('#About, #Gallery, #Info, #Download');
    popups.forEach(popup => {
        makeDraggable(popup);
        addCloseButton(popup);
    });
});

function handleDownload() {
    playSound('click');
    const link = document.createElement('a');
    link.href = 'downloads/your-game.zip';
    link.download = 'BadRoommate.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}