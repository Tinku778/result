document.getElementById('result-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the default form submission

  const hallTicket = document.getElementById('hall-ticket').value.trim();
  
  if (!hallTicket) {
    document.getElementById('result-message').textContent = "Please enter a valid hall ticket number.";
    return;
  }

  // Show spinner while fetching the result
  document.getElementById('result-message').textContent = '';
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  document.getElementById('result').appendChild(spinner);

  try {
    // Make a GET request to your Firebase Cloud Function endpoint
    const response = await fetch(`/check-result?ticketNumber=${hallTicket}`);
    
    if (response.ok) {
      const data = await response.json();  // Get the result and marks from the backend

      // Hide spinner and display result
      spinner.remove();
      document.getElementById('result-message').innerHTML = ''; // Clear any existing message

      const resultMessage = `Result: ${data.result}`;
      const marksMessage = `Marks: ${data.marks}`;
      
      document.getElementById('result-details').style.display = 'block';
      document.getElementById('result-status').textContent = resultMessage;
      document.getElementById('result-marks').textContent = marksMessage;
      
      // Add success class if qualified
      if (data.result === "Qualified") {
        document.getElementById('result-status').classList.add('success');
      } else {
        document.getElementById('result-status').classList.remove('success');
      }
    } else {
      const errorMessage = await response.text();
      spinner.remove();
      document.getElementById('result-message').textContent = `Error: ${errorMessage}`;
    }
  } catch (error) {
    spinner.remove();
    document.getElementById('result-message').textContent = "An error occurred while checking the result. Please try again.";
    console.error("Error fetching the result:", error);
  }
});
