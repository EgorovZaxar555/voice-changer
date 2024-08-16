const startButton = document.getElementById('startButton');
const statusText = document.getElementById('status');

startButton.addEventListener('click', async () => {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Your device doesn't support real-time audio processing.");
            return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);

        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1;

        const pitchShifter = audioContext.createBiquadFilter();
        pitchShifter.type = 'lowshelf';
        pitchShifter.frequency.setValueAtTime(1000, audioContext.currentTime);
        pitchShifter.gain.setValueAtTime(25, audioContext.currentTime);

        source.connect(pitchShifter).connect(gainNode).connect(audioContext.destination);

        statusText.textContent = 'Voice changer is active. Speak into the microphone.';
    } catch (err) {
        console.error('Error accessing microphone:', err);
        statusText.textContent = 'Error accessing microphone.';
    }
});