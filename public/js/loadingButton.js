function toggleLoading() {
  const button = document.getElementById('loading-button');
  const buttonText = document.getElementById('button-text');
  const loadingSpinner = document.getElementById('loading-spinner');

  button.disabled = !button.disabled; // Disable the button
  buttonText.classList.toggle('hidden'); // Toggle visibility of button text
  loadingSpinner.classList.toggle('hidden'); // Toggle visibility of loading spinner
}
