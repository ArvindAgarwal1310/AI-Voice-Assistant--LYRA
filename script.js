// Sample data (replace this with your actual API response)
const { sendIPCMessage, receiveIPCMessage } = window.electronAPI;

const sampleData = [
    //{ type: 'text', content: 'Hello, this is some dynamic text!' },
    //{ type: 'image', content: 'https://cdn-images-1.medium.com/v2/resize:fill:1600:480/gravity:fp:0.5:0.4/1*blHXXK6qZNDtLGKjEByHTg.gif' },
    //{ type: 'video', content: ";http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
  ];
  
  document.addEventListener('DOMContentLoaded', function() {
    displayData(sampleData);
  });
  
  
  // Function to display the received data on the webpage
  function displayData(data) {
    const contentContainer = document.getElementById('content');
  
    // Loop through the data and create the HTML elements
    data.forEach((item) => {
      const itemDiv = document.createElement('div');
  
      // Check the type of content (text, image, or video) and create respective elements
      if (item.type === 'text') {
        const textElement = document.createElement('p');
        textElement.innerText = item.content;
        itemDiv.appendChild(textElement);
      } else if (item.type === 'image') {
        const imageElement = document.createElement('img');
        imageElement.src = item.content;
        itemDiv.appendChild(imageElement);
      } else if (item.type === 'video') {
        const videoElement = document.createElement('video');
        videoElement.src = item.content;
        videoElement.controls = true;
        itemDiv.appendChild(videoElement);
      }
  
      contentContainer.appendChild(itemDiv);
    });
  }


/*document.getElementById('playButton').addEventListener('click', function() {
    // Make a POST request to the Flask API to get the MP4 audio
    fetch('http://127.0.0.1:5000/speech-to-text', {
      method: 'POST',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      // Create an URL object from the received Blob
      const url = URL.createObjectURL(blob);
  
      // Create an audio element and set the source to the URL
      const audioElement = new Audio(url);
  
      // Play the audio
      audioElement.play();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
  */
  

  document.addEventListener('DOMContentLoaded', function() {
    displayData(sampleData);
  
    const runPythonButton = document.getElementById('runPythonButton');
    runPythonButton.addEventListener('click', () => {
      // Replace 'your-python-script.py' with the relative path to your Python script
      const pythonScriptPath = "C:\Users\aagar\OneDrive\Desktop\Lyra-Backend\SpeechToText.py";
      console.log(12)
      // Send a message to the main process to execute the Python script
      sendIPCMessage('run-python-script', pythonScriptPath);
    });
  
    // Receive the result of the Python script execution from the main process
    receiveIPCMessage('python-script-result', (result) => {
      if (result.success) {
        // Handle successful execution
        console.log('Python script output:', result.output);
        displayChat(result.output);
        alert('Python script executed successfully!\nOutput: ' + result.output);
      } else {
        // Handle error
        console.error('Error executing Python script:', result.output);
        alert('Error executing Python script:\n' + result.output);
      }
    });
  });



  function displayChat(chat) {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = ''; // Clear previous chat
  
    const conversations = chat.split('You said:');// Split the chat into conversations
    conversations.shift(); // Remove the first empty item
  
    conversations.forEach((conversation) => {
      const [userMessage, botMessage] = conversation.trim().split('Bot Says ');
      appendMessage('You', userMessage);
      appendMessage('Lyra', botMessage);
    });
  }

  function appendMessage(sender, message) {
    const chatContainer = document.getElementById('chatContainer');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender === 'You' ? 'user-message' : 'bot-message'}`;
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatContainer.appendChild(messageElement);
  }
  
