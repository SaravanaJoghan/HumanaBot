/*---------------------------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', function () {
    const chat = document.getElementById('chat');
    const userInput = document.getElementById('userInput');
    const clearChatButton = document.getElementById('clearChatButton');
    const methodSelector = document.getElementById('methodSelector'); // Add this line

    // Function to add a message to the chat
    function addMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
        messageDiv.textContent = message;
        chat.appendChild(messageDiv);

        // Scroll to the bottom of the chat
        chat.scrollTop = chat.scrollHeight;
    }

    // Function to clear the chat
    function clearChat() {
        while (chat.firstChild) {
            chat.removeChild(chat.firstChild);
        }
    }

    // Event listener for the "Clear Chat" button
    clearChatButton.addEventListener('click', clearChat);

    // Function to handle user input and get responses
    async function handleUserInput(userMessage) {
        addMessage('user', userMessage);

        // Get the selected method from the dropdown menu
        const selectedMethod = methodSelector.value;

        if (selectedMethod === 'gpt2') {
            // Call the server to get a GPT-2 response
            try {
                const response = await fetch('https://192.168.130.221:5000/get_gpt2_response', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_input: userMessage }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const realBotResponse = data.bot_response;

                addMessage('bot', realBotResponse);
            } catch (error) {
                console.error('Error:', error);
                addMessage('bot', "Sorry, there was an error processing your request.");
            }
        } else if (selectedMethod === 'cosine_similarity') {
            // Call the server to get a cosine similarity-based response
            try {
                const response = await fetch('https://192.168.130.221:5000/get_gpt2_response', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_input: userMessage }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const realBotResponse = data.bot_response;

                addMessage('bot', realBotResponse);
            } catch (error) {
                console.error('Error:', error);
                addMessage('bot', "Sorry, there was an error processing your request.");
            }
        }

        // Clear the user input
        userInput.value = '';
    }

    // Event listener for user input
    userInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const message = userInput.value;
            if (message.trim() !== '') {
                handleUserInput(message);
            }
        }
    });
});
