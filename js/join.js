/**
 * Join Page specific functionality
 */

function handleApplicationSubmit() {
    console.log("Application form submitted.");
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');

    const successMessage = document.getElementById('successMessage');
    if (success === 'true' && successMessage) {
        successMessage.style.display = 'block';
    }
});
